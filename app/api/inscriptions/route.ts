/**
 * GET /api/inscriptions
 * Fetch all inscriptions with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const formation = searchParams.get('formation')

    let query = supabase.from('inscriptions').select('*')

    if (status) query = query.eq('status', status)
    if (type) query = query.eq('type', type)
    if (formation) query = query.eq('formation_id', formation)

    const { data: inscriptions, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    // Count stats
    const { count: totalCount } = await supabase
      .from('inscriptions')
      .select('*', { count: 'exact', head: true })

    const { count: pendingCount } = await supabase
      .from('inscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending')

    const { count: approvedCount } = await supabase
      .from('inscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Approved')

    const { count: rejectedCount } = await supabase
      .from('inscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Rejected')

    const stats = {
      total: totalCount || 0,
      pending: pendingCount || 0,
      approved: approvedCount || 0,
      rejected: rejectedCount || 0,
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
