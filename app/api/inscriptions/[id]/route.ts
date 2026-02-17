/**
 * PATCH /api/inscriptions/[id]
 * Update inscription status (approve, reject)
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, notes } = await req.json()
    const id = params.id

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Fetch the inscription first
    const { data: inscriptionData } = await supabase
      .from('inscriptions')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    // Update inscription
    const { data: inscription, error } = await supabase
      .from('inscriptions')
      .update({
        status,
        notes: notes || null,
      })
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) throw error

    // If approved, update student status
    if (status === 'Approved' && inscriptionData?.student_id) {
      await supabase
        .from('students')
        .update({ status: 'Active' })
        .eq('id', inscriptionData.student_id)
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
