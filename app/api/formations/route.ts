/**
 * GET /api/formations
 * GET /api/formations/[id]
 * DELETE /api/formations?id=X
 * Fetch all formations, a specific formation, or delete a formation
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function GET(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const id = params.id

    if (id) {
      // Fetch single formation
      const { data: formation, error } = await supabase
        .from('formations')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error || !formation) {
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

    // Fetch all formations
    const { data: formations, error } = await supabase
      .from('formations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Formation ID is required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    const { error } = await supabase
      .from('formations')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: 'Formation deleted successfully',
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
