import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pages publiques (accessibles sans authentification)
const publicPaths = [
  '/admin/login',
  '/api/admin/login',
  '/_next',
  '/favicon.ico'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permet d'accéder aux ressources statiques et pages publiques
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Protéger toutes les routes /admin/*
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin_session')
    
    // Pas de session valide -> rediriger vers login
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Vérifier que la session est valide
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString())
      if (!sessionData.loggedIn) {
        throw new Error('Invalid session')
      }
    } catch {
      // Session invalide -> rediriger vers login
      const loginUrl = new URL('/admin/login', request.url)
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