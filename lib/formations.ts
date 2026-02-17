import { createSupabaseServerClient } from './supabase'
import { ensureMigrations } from './migrations'

export type Formation = {
  id: number
  slug: string
  title: string
  description?: string
  capacity?: number
  start_date?: string | null
  end_date?: string | null
}

/**
 * Server-side helper: list formations.
 * Use from server components (App Router) to fetch formations on the server.
 */
export async function getFormations(): Promise<Formation[]> {
  await ensureMigrations()
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from<Formation>('formations')
    .select('*')
    .order('start_date', { ascending: true })

  if (error) {
    console.error('getFormations error', error)
    return []
  }
  return data ?? []
}
