/**
 * GET /api/partners
 * Fetch all partners
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured') === 'true'

    let query = supabase.from('partners').select('*')

    if (featured) {
      query = query.eq('featured', true)
    }

    const { data: partners, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        data: partners,
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, website, logoUrl, featured } = await req.json()

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Partner name required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Check if name exists
    const { data: existing } = await supabase
      .from('partners')
      .select('id')
      .eq('name', name)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Partner name already exists' },
        { status: 409, headers: corsHeaders() }
      )
    }

    const { data: partner, error } = await supabase
      .from('partners')
      .insert([
        {
          name: name.trim(),
          website: website?.trim(),
          logo_url: logoUrl,
        },
      ])
      .select()
      .maybeSingle()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: 'Partner created',
        data: partner,
      },
      { status: 201, headers: corsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() })
}
