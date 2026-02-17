/**
 * GET /api/students
 * Fetch all students with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const formation = searchParams.get('formation')

    const where: any = {}
    if (type) where.type = type
    if (status) where.status = status
    if (formation) where.formationId = formation

    const students = await prisma.student.findMany({
      where,
      include: {
        formation: { select: { id: true, name: true } },
        inscriptions: { select: { id: true, status: true } },
      },
      orderBy: { enrolledDate: 'desc' },
    })

    return NextResponse.json(
      {
        success: true,
        data: students,
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
