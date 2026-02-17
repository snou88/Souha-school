/**
 * POST /api/contact
 * Create a new contact message (public endpoint)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, isValidEmail, sanitizeInput } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validate
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Create message
    const contact = await prisma.contactMessage.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        subject: sanitizeInput(subject),
        message: sanitizeInput(message),
        status: 'Unread',
      },
    })

    // TODO: Send confirmation email to user
    // TODO: Send notification email to admin

    return NextResponse.json(
      {
        success: true,
        message: 'Message received! We will get back to you shortly.',
        data: {
          messageId: contact.id,
        },
      },
      { status: 201, headers: corsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// GET /api/contact (admin only - view messages)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where = status ? { status } : {}

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      {
        success: true,
        data: messages,
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
