/**
 * POST /api/formations
 * Create a new formation (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    const adminId = requireAuth(req)

    const { name, description, category, duration, status } = await req.json()

    // Validate input
    if (!name || !description || !category || !duration) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, description, category, and duration are required',
        },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Check if name already exists
    const existing = await prisma.formation.findUnique({
      where: { name: name.trim() },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Formation name already exists' },
        { status: 409, headers: corsHeaders() }
      )
    }

    // Create formation
    const formation = await prisma.formation.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        duration: duration.trim(),
        status: status || 'Draft',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Formation created successfully',
        data: formation,
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
