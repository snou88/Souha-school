/**
 * API Middleware
 * Provides utilities for protecting routes and validating requests
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from './auth'

export type AuthRequest = NextRequest & {
  adminId?: string
  email?: string
}

/**
 * Middleware to validate admin authentication
 * Usage: const adminId = requireAuth(req)
 */
export function requireAuth(req: NextRequest): string {
  const authHeader = req.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    throw new Error('Unauthorized: Missing token')
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    throw new Error('Unauthorized: Invalid token')
  }

  return decoded.sub
}

/**
 * Error handler for API routes
 */
export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      )
    }

    if (error.message.includes('Not found')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 404 }
      )
    }

    if (error.message.includes('Validation failed')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }
  }

  return NextResponse.json(
    { success: false, message: 'Internal server error' },
    { status: 500 }
  )
}

/**
 * Cors headers helper
 */
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}
