/**
 * POST /api/formations
 * Create a new formation
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

export async function POST(req: NextRequest) {
  try {
    const { name, description, category, duration, status } = await req.json()

    // Validate input
    if (!name || !description || !category || !duration) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, description, category, and duration are required',
        },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Check if name already exists
    const { data: existing } = await supabase
      .from('formations')
      .select('id')
      .eq('name', name.trim())
      .limit(1)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Formation name already exists' },
        { status: 409, headers: corsHeaders() }
      )
    }

    // Create formation
    const { data: formation, error } = await supabase
      .from('formations')
      .insert([
        {
          name: name.trim(),
          description: description.trim(),
          category: category.trim(),
          duration: duration.trim(),
          status: status || 'Draft',
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: 'Formation created successfully',
        data: formation,
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
