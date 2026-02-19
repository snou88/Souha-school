"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'  // <-- Importez depuis client.ts

type Props = {
  formation: {
    id: number
    title: string
    description?: string
    capacity?: number
    start_date?: string | null
  }
}

export default function FormationCard({ formation }: Props) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()  // <-- Utilisez createClient() au lieu de createSupabaseClient()
    supabase.auth.getUser().then(res => {
      setUser(res.data.user ?? null)
    }).catch(() => setUser(null))
  }, [])

  async function handleEnroll() {
    if (!user) {
      window.location.href = '/inscription'
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const supabase = createClient()  // <-- Utilisez createClient() ici aussi
      const session = await supabase.auth.getSession()
      const token = session.data?.session?.access_token
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ formationId: formation.id })
      })
      const json = await res.json()
      if (!res.ok) {
        setMessage(json?.error || "Échec de l’inscription")
      } else {
        setMessage("Inscription enregistrée")
      }
    } catch (err: any) {
      setMessage(err?.message || "Erreur inattendue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-lg font-semibold text-foreground">{formation.title}</h3>
      {formation.description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{formation.description}</p>
      )}
      <div className="mt-4 text-xs text-muted-foreground">
        Début : <span className="font-medium text-foreground">{formation.start_date ?? "À définir"}</span>
      </div>
      <div className="mt-5">
        <button
          onClick={handleEnroll}
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Traitement…" : "Demander une inscription"}
        </button>
      </div>
      {message && <div className="mt-3 text-sm text-muted-foreground">{message}</div>}
    </div>
  )
}