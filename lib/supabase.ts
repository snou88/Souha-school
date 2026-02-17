import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string

/**
 * Create a browser (public) supabase client for client components.
 * Use only public keys here (NEXT_PUBLIC_*). Do not expose service role keys to the browser.
 */
export function createSupabaseClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Create a server-side Supabase client. Requires SUPABASE_SERVICE_ROLE_KEY to be set.
 * This client bypasses RLS so use it carefully (only on trusted server routes).
 */
export function createSupabaseServerClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}
/**
 * Supabase Client Wrapper
 * This file provides typed Supabase client instances for both browser and server environments.
 * 
 * Usage:
 * - Browser (client components): Always use createBrowserClient() in 'use client' components
 * - Server (API routes, server actions): Use createServerClient()
 */
J// NOTE: Keep this module safe to import from client components.
// Export only simple factory functions that do not import server-only modules like `next/headers`.

