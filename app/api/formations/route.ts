/**
 * GET /api/formations
 * GET /api/formations/[id]
 * Fetch all formations or a specific formation
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function GET(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const id = params.id

    if (id) {
      // Fetch single formation
      const formation = await prisma.formation.findUnique({
        where: { id },
        include: {
          students: { select: { id: true, email: true, type: true } },
          inscriptions: { select: { id: true, status: true } },
        },
      })

      if (!formation) {
        return NextResponse.json(
          { success: false, message: 'Formation not found' },
          { status: 404, headers: corsHeaders() }
        )
      }

      return NextResponse.json(
        {
          success: true,
          data: formation,
        },
        { status: 200, headers: corsHeaders() }
      )
    }

    // Fetch all formations with counts
    const formations = await prisma.formation.findMany({
      include: {
        _count: {
          select: { students: true, inscriptions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
      {
        success: true,
        data: formations,
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
