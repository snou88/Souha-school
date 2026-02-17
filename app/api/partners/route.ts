/**
 * GET /api/partners
 * Fetch all partners
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured') === 'true'

    const where = featured ? { featured: true } : {}

    const partners = await prisma.partner.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(
      {
        success: true,
        data: partners,
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, website, logoUrl, featured } = await req.json()

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Partner name required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Check if name exists
    const existing = await prisma.partner.findUnique({
      where: { name },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Partner name already exists' },
        { status: 409, headers: corsHeaders() }
      )
    }

    const partner = await prisma.partner.create({
      data: {
        name: name.trim(),
        website: website?.trim(),
        logoUrl,
        featured: featured || false,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Partner created',
        data: partner,
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
