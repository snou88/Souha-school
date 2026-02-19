import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pages publiques (accessibles sans authentification)
const publicPaths = [
  '/login',           // Page de login (hors admin)
  '/api/admin/login', // API de login
  '/_next',
  '/favicon.ico'
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permet d'accéder aux pages publiques
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Protéger toutes les routes /admin/*
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin_session')
    
    // Pas de session valide -> rediriger vers /login (hors admin)
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url)  // ← Changé de /admin/login à /login
      return NextResponse.redirect(loginUrl)
    }

    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString())
      if (!sessionData.loggedIn) {
        throw new Error('Invalid session')
      }
    } catch {
      const loginUrl = new URL('/login', request.url)  // ← Changé de /admin/login à /login
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ]
}