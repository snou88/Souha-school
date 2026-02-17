/**
 * GET /api/students
 * Fetch all students with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const formation = searchParams.get('formation')

    let query = supabase.from('students').select('*')

    if (type) query = query.eq('type', type)
    if (status) query = query.eq('status', status)
    if (formation) query = query.eq('formation_id', formation)

    const { data: students, error } = await query.order('enrolled_date', { ascending: false })

    if (error) throw error

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
