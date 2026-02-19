"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Admin {
  id: string
  name: string
  email: string
  role: string
}

export function useAdminAuth(redirectTo = "/admin/login") {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/login")
      const data = await res.json()
      
      if (data.authenticated && data.admin) {
        setAdmin(data.admin)
      } else {
        router.push(redirectTo)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      router.push(redirectTo)
    } finally {
      setLoading(false)
    }
  }

  return { admin, loading }
}