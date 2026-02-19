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
      window.location.href = '/admin/login'
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
        setMessage(json?.error || 'Enrollment failed')
      } else {
        setMessage('Enrolled successfully')
      }
    } catch (err: any) {
      setMessage(err?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>{formation.title}</h3>
      <p>{formation.description}</p>
      <div>
        <small>Starts: {formation.start_date ?? 'TBD'}</small>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={handleEnroll} disabled={loading}>
          {loading ? 'Enrolling…' : 'Enroll'}
        </button>
      </div>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </div>
  )
}