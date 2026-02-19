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
    if (!token) return setMessage('Not authenticated')
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ full_name: fullName })
    })
    const js = await res.json()
    if (!res.ok) setMessage(js?.error || 'Save failed')
    else setMessage('Profile saved')
  }

  if (loading) return <div>Loading…</div>

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1>My Profile</h1>
      {!profile && <p>No profile yet — create one below.</p>}
      <div>
        <label>Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={save}>Save</button>
      </div>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </div>
  )
}
