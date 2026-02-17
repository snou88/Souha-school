import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { ensureMigrations } from '@/lib/migrations'

/**
 * GET: returns the profile for the authenticated user
 * POST/PUT: create or update profile (body contains profile fields)
 * Expects Authorization: Bearer <access_token>
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 })

  await ensureMigrations()
  const supabase = createSupabaseServerClient()
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  const userId = userData.user.id

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ profile: data })
}

export async function POST(req: NextRequest) {
  // create or update profile
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 })

  const body = await req.json()
  await ensureMigrations()
  const supabase = createSupabaseServerClient()
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  const userId = userData.user.id

  // Upsert profile for the authenticated user. Because we're using service-role client, we must ensure id === userId
  const payload = { ...body, id: userId }
  const { data, error } = await supabase.from('profiles').upsert(payload, { onConflict: ['id'] }).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profile: data })
}

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 })

  await ensureMigrations()
  const supabase = createSupabaseServerClient()
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  const userId = userData.user.id

  const { error } = await supabase.from('profiles').delete().eq('id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
