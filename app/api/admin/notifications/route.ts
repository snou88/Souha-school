import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/admin/notifications
 * Retourne le nombre d'inscriptions en attente (Pending) pour l'affichage des notifications admin.
 */
export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('inscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      pendingInscriptions: count ?? 0,
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}
