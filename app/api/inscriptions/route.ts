/**
 * GET /api/inscriptions
 * Fetch all inscriptions with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const formation = searchParams.get('formation')

    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (formation) where.formationId = formation

    const inscriptions = await prisma.inscription.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            email: true,
            type: true,
            formationId: true,
          },
        },
        formation: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Count stats
    const stats = {
      total: await prisma.inscription.count(),
      pending: await prisma.inscription.count({ where: { status: 'Pending' } }),
      approved: await prisma.inscription.count({ where: { status: 'Approved' } }),
      rejected: await prisma.inscription.count({ where: { status: 'Rejected' } }),
    }

    return NextResponse.json(
      {
        success: true,
        data: inscriptions,
        stats,
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
