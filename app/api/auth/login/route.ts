/**
 * POST /api/auth/login
 * Authenticates admin user and returns JWT token
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401, headers: corsHeaders() }
      )
    }

    // Verify password
    const passwordValid = await verifyPassword(password, admin.password)
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401, headers: corsHeaders() }
      )
    }

    // Generate token
    const token = generateToken(admin.id, admin.email)

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
          },
        },
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() })
}
