/**
 * /api/categories
 * - GET:    list categories
 * - POST:   create category
 * - PUT:    update category
 * - DELETE: delete category
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

type CategoryStatus = 'Active' | 'Draft' | 'Archived'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_\s]/g, '')
    .replace(/\s+/g, '-')
}

export async function GET(req: NextRequest) {
  try {
    console.log('[CATEGORIES API] Fetching categories from Supabase...')
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[CATEGORIES API] Supabase error:', error)
      // Check if table doesn't exist
      const errorMessage = error.message || String(error)
      const errorCode = (error as any)?.code
      
      if (errorCode === '42P01' || errorMessage.toLowerCase().includes('does not exist')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database table "categories" does not exist. Please run the SQL migration to create it.',
            details: { code: errorCode, message: errorMessage },
          },
          { status: 500, headers: corsHeaders() }
        )
      }
      
      throw error
    }

    console.log('[CATEGORIES API] Successfully fetched', data?.length || 0, 'categories')
    
    return NextResponse.json(
      { success: true, data: data || [] },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    console.error('[CATEGORIES API] Unexpected error:', error)
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('[CATEGORIES API] Creating new category...')
    
    const body = await req.json()
    console.log('[CATEGORIES API] Request body:', body)
    
    const rawName = (body.name ?? '').toString().trim()
    const rawSlug = (body.slug ?? '').toString().trim()
    const status = (body.status ?? 'Active') as CategoryStatus

    if (!rawName) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: name is required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    const slug = rawSlug || slugify(rawName)
    console.log('[CATEGORIES API] Inserting category:', { name: rawName, slug, status })

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: rawName, slug, status }])
      .select()
      .maybeSingle()

    if (error) {
      console.error('[CATEGORIES API] Supabase insert error:', error)
      const errorMessage = error.message || String(error)
      const errorCode = (error as any)?.code
      
      if (errorCode === '42P01' || errorMessage.toLowerCase().includes('does not exist')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database table "categories" does not exist. Please run the SQL migration to create it.',
            details: { code: errorCode, message: errorMessage },
          },
          { status: 500, headers: corsHeaders() }
        )
      }
      
      throw error
    }

    console.log('[CATEGORIES API] Category created successfully:', data)
    
    return NextResponse.json(
      {
        success: true,
        message: 'Category created',
        data,
      },
      { status: 201, headers: corsHeaders() }
    )
  } catch (error) {
    console.error('[CATEGORIES API] Unexpected error in POST:', error)
    return handleApiError(error)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const id = body.id
    const rawName = (body.name ?? '').toString().trim()
    const rawSlug = (body.slug ?? '').toString().trim()
    const status = (body.status ?? 'Active') as CategoryStatus

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: id is required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    if (!rawName) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: name is required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    const slug = rawSlug || slugify(rawName)

    const { data, error } = await supabase
      .from('categories')
      .update({ name: rawName, slug, status })
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: 'Category updated',
        data,
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const id = body.id

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: id is required' },
        { status: 400, headers: corsHeaders() }
      )
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: 'Category deleted',
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

