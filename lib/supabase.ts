/**
 * Supabase Client Wrapper
 * This file provides typed Supabase client instances for both browser and server environments.
 * 
 * Usage:
 * - Browser (client components): Always use createBrowserClient() in 'use client' components
 * - Server (API routes, server actions): Use createServerClient()
 */

import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Browser-safe Supabase client
 * Use this in client components ('use client'), never expose service_role
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Server-side Supabase client
 * Use this in API routes and server actions
 * Can access service_role for admin operations
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

/**
 * Admin Supabase client with service_role
 * ONLY use in server-side code (API routes, server actions)
 * NEVER expose to the browser
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables for admin client')
  }

  // @ts-ignore - Supabase admin client types
  return createServerClient(url, serviceRoleKey, {
    // Admin client doesn't use cookies
    cookies: {
      getAll() {
        return []
      },
      setAll() {},
    },
  })
}
