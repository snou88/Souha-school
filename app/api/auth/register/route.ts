/**
 * POST /api/auth/register
 * Creates a new admin user (protected endpoint)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, isValidEmail } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { requireAuth, handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const adminId = requireAuth(req)

    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400, headers: corsHeaders() }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Check if email already exists
    const existing = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 409, headers: corsHeaders() }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create admin
    const newAdmin = await prisma.admin.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Admin created successfully',
        data: {
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
        },
      },
      { status: 201, headers: corsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() })
}
