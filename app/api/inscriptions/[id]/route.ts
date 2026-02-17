/**
 * PATCH /api/inscriptions/[id]
 * Update inscription status (approve, reject)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = requireAuth(req)
    const { status, notes } = await req.json()
    const id = params.id

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400, headers: corsHeaders() }
      )
    }

    const inscription = await prisma.inscription.update({
      where: { id },
      data: {
        status,
        notes: notes || undefined,
      },
      include: {
        student: true,
        formation: true,
      },
    })

    // If approved, update student status
    if (status === 'Approved') {
      await prisma.student.update({
        where: { id: inscription.studentId },
        data: { status: 'Active' },
      })
    }

    // TODO: Send email notification to student

    return NextResponse.json(
      {
        success: true,
        message: `Inscription ${status.toLowerCase()}`,
        data: inscription,
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
