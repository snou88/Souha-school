import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function assertEnv(variable: string | undefined, name: string) {
  if (!variable) {
    console.error(`[Supabase] Missing environment variable: ${name}`)
    throw new Error(`Missing environment variable: ${name}`)
  }
}

/**
 * Create a browser (public) supabase client for client components.
 * Uses the anon key and MUST only be imported in 'use client' components.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  assertEnv(SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL')
  assertEnv(SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')

  console.log('[Supabase] Initializing browser client')
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
}

/**
 * Create a server-side Supabase client for authenticated user operations.
 * Uses the anon key but is intended for server components / server actions.
 */
export function createSupabaseServerClient(): SupabaseClient {
  assertEnv(SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL')
  assertEnv(SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')

  console.log('[Supabase] Initializing server client (anon)')
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
}

/**
 * Create a server-side Supabase client with the service role key.
 * This bypasses RLS and MUST only be used in trusted server-only contexts
 * like API routes and backend jobs.
 */
export function createSupabaseServiceRoleClient(): SupabaseClient {
  assertEnv(SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL')
  assertEnv(SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY')

  console.log('[Supabase] Initializing service role client')
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
}

