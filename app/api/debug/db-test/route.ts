import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { ensureMigrations } from '@/lib/migrations'
import { corsHeaders } from '@/lib/api-middleware'

/**
 * GET /api/debug/db-test
 *
 * Connection diagnostic endpoint for Supabase.
 * - Verifies that required tables exist (via ensureMigrations)
 * - Runs a lightweight SELECT against the formations table
 */
export async function GET(req: NextRequest) {
  try {
    console.log('[DB TEST] Starting Supabase connection test...')

    await ensureMigrations()

    const { data, error } = await supabase
      .from('formations')
      .select('id')
      .limit(1)

    if (error) {
      console.error('[DB TEST] Supabase query error', error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 500, headers: corsHeaders() }
      )
    }

    console.log('[DB TEST] Supabase connection OK')

    return NextResponse.json(
      {
        success: true,
        message: 'Supabase connection OK',
        sample: data,
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    console.error('[DB TEST] Unexpected error', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error',
        details: error,
      },
      { status: 500, headers: corsHeaders() }
    )
  }
}

