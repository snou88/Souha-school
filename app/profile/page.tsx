"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async (s) => {
      const token = s.data?.session?.access_token
      if (!token) {
        setLoading(false)
        return
      }
      const res = await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const js = await res.json()
        setProfile(js.profile)
        setFullName(js.profile?.full_name ?? '')
      }
      setLoading(false)
    })
  }, [])

  async function save() {
    setMessage(null)
    const supabase = createClient()
    const s = await supabase.auth.getSession()
    const token = s.data?.session?.access_token
    if (!token) return setMessage("Vous n’êtes pas authentifié.")
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ full_name: fullName })
    })
    const js = await res.json()
    if (!res.ok) setMessage(js?.error || "Enregistrement impossible.")
    else setMessage("Profil enregistré.")
  }

  if (loading) return <div className="px-6 py-24 text-center text-sm text-muted-foreground">Chargement…</div>

  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Mon profil</h1>
      {!profile && (
        <p className="mt-2 text-sm text-muted-foreground">
          Aucun profil n’a été trouvé. Vous pouvez en créer un ci-dessous.
        </p>
      )}
      <div className="mt-8 space-y-2">
        <label className="text-sm font-medium text-foreground">Nom complet</label>
        <input
          className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ex : Ahmed Benali"
        />
      </div>
      <div className="mt-4">
        <button
          onClick={save}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
        >
          Enregistrer
        </button>
      </div>
      {message && <div className="mt-3 text-sm text-muted-foreground">{message}</div>}
    </div>
  )
}
