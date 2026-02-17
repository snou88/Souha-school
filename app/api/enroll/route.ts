import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { ensureMigrations } from '@/lib/migrations'

/**
 * POST /api/enroll
 * Body: { formationId: number }
 * Auth: expects Authorization: Bearer <access_token> header (or modify to read cookies)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const formationId = body?.formationId
    if (!formationId) {
      return NextResponse.json({ error: 'formationId is required' }, { status: 400 })
    }

    // Extract access token from Authorization header
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) {
      return NextResponse.json({ error: 'Missing Authorization token' }, { status: 401 })
    }

    // Ensure DB objects and policies exist (no-op if already created)
    await ensureMigrations()

    // Use service role to verify token and perform the insert (service role bypasses RLS).
    // Important: Because service role bypasses RLS, we verify the token and enforce student_id === user.id in code.
    const supabase = createSupabaseServerClient()

    // Verify token and get user
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData?.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const userId = userData.user.id

    // TODO: check formation capacity, existing enrollment, payment, etc.

    const { data, error } = await supabase
      .from('enrollments')
      .insert([{ formation_id: formationId, student_id: userId, status: 'pending' }])
      .select('*')
      .single()

    if (error) {
      console.error('enroll insert error', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, enrollment: data })
  } catch (err: any) {
    console.error('enroll route error', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}
/**
 * POST /api/enroll
 * Create new enrollment/inscription (public endpoint, no auth required)
 * Called from frontend inscription form
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isValidEmail, isValidPhone, sanitizeInput } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

interface EnrollmentPayload {
  accountType: 'Individual' | 'Company'
  firstName?: string
  lastName?: string
  email: string
  phone: string
  dateOfBirth?: string
  companyName?: string
  companyPhone?: string
  companyStudentCount?: string
  companyContactName?: string
  companyContactEmail?: string
  selectedProgram: string
  startDate: string
  agreeTerms: boolean
}

export async function POST(req: NextRequest) {
  try {
    const payload: EnrollmentPayload = await req.json()

    // Validate required fields
    if (!payload.accountType || !payload.email || !payload.phone || !payload.selectedProgram || !payload.startDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400, headers: corsHeaders() }
      )
    }

    if (!payload.agreeTerms) {
      return NextResponse.json(
        { success: false, message: 'Must agree to terms and conditions' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Validate email and phone
    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400, headers: corsHeaders() }
      )
    }

    if (!isValidPhone(payload.phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone format' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Find formation
    const formation = await prisma.formation.findUnique({
      where: { name: payload.selectedProgram },
    })

    if (!formation) {
      return NextResponse.json(
        { success: false, message: 'Selected program not found' },
        { status: 404, headers: corsHeaders() }
      )
    }

    // Determine name based on account type
    let studentName = ''
    let requestorEmail = payload.email

    if (payload.accountType === 'Individual') {
      if (!payload.firstName || !payload.lastName) {
        return NextResponse.json(
          { success: false, message: 'First and last name required' },
          { status: 400, headers: corsHeaders() }
        )
      }
      studentName = `${sanitizeInput(payload.firstName)} ${sanitizeInput(payload.lastName)}`
    } else {
      if (!payload.companyName || !payload.companyContactName) {
        return NextResponse.json(
          { success: false, message: 'Company name and contact name required' },
          { status: 400, headers: corsHeaders() }
        )
      }
      studentName = sanitizeInput(payload.companyName)
      requestorEmail = payload.companyContactEmail || payload.email

      // Validate company student count
      const studentCount = parseInt(payload.companyStudentCount || '0')
      if (isNaN(studentCount) || studentCount < 1) {
        return NextResponse.json(
          { success: false, message: 'Invalid number of students' },
          { status: 400, headers: corsHeaders() }
        )
      }
    }

    // Check if email already enrolled in this formation
    const existingStudent = await prisma.student.findFirst({
      where: {
        email: payload.email.toLowerCase(),
        formationId: formation.id,
      },
    })

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already enrolled in this program',
        },
        { status: 409, headers: corsHeaders() }
      )
    }

    // Create or update student
    let student = await prisma.student.findUnique({
      where: { email: payload.email.toLowerCase() },
    })

    if (student) {
      // Update existing student
      student = await prisma.student.update({
        where: { id: student.id },
        data: {
          formationId: formation.id,
          status: 'Active',
        },
      })
    } else {
      // Create new student
      student = await prisma.student.create({
        data: {
          type: payload.accountType,
          email: payload.email.toLowerCase(),
          phone: sanitizeInput(payload.phone),
          firstName: payload.firstName ? sanitizeInput(payload.firstName) : null,
          lastName: payload.lastName ? sanitizeInput(payload.lastName) : null,
          dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null,
          companyName: payload.companyName ? sanitizeInput(payload.companyName) : null,
          companyStudentCount: payload.companyStudentCount ? parseInt(payload.companyStudentCount) : null,
          formationId: formation.id,
          status: 'Active',
        },
      })
    }

    // Create inscription (enrollment request)
    const inscription = await prisma.inscription.create({
      data: {
        studentId: student.id,
        formationId: formation.id,
        type: payload.accountType,
        requestorName: studentName,
        requestorEmail: requestorEmail.toLowerCase(),
        requestorPhone: sanitizeInput(payload.phone),
        startDate: new Date(payload.startDate),
        numberOfStudents: payload.accountType === 'Company' 
          ? parseInt(payload.companyStudentCount || '1') 
          : 1,
        status: 'Pending',
      },
    })

    // TODO: Send confirmation email to user

    return NextResponse.json(
      {
        success: true,
        message: 'Enrollment successful! We will review your application shortly.',
        data: {
          inscriptionId: inscription.id,
          studentId: student.id,
          status: inscription.status,
        },
      },
      { status: 201, headers: corsHeaders() }
    )
  } catch (error) {
    console.error('Enrollment error:', error)
    return handleApiError(error)
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() })
}
