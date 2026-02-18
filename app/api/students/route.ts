/**
 * GET /api/students
 * Fetch all students with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function GET(req: NextRequest) {
  try {
    console.log('[STUDENTS API] Fetching students from Supabase...')
    
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const formation = searchParams.get('formation')

    let query = supabase.from('students').select('*')

    if (type) query = query.eq('type', type)
    if (status) query = query.eq('status', status)
    if (formation) query = query.eq('formation_id', formation)

    const { data: students, error } = await query.order('enrolled_date', { ascending: false })

    if (error) {
      console.error('[STUDENTS API] Supabase error:', error)
      const errorMessage = error.message || String(error)
      const errorCode = (error as any)?.code
      
      if (errorCode === '42P01' || errorMessage.toLowerCase().includes('does not exist')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database table "students" does not exist. Please run the SQL migration to create it.',
            details: { code: errorCode, message: errorMessage },
          },
          { status: 500, headers: corsHeaders() }
        )
      }
      
      throw error
    }

    console.log('[STUDENTS API] Successfully fetched', students?.length || 0, 'students')

    return NextResponse.json(
      {
        success: true,
        data: students || [],
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    console.error('[STUDENTS API] Unexpected error:', error)
    return handleApiError(error)
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() })
}
