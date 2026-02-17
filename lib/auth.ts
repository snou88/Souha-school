/**
 * Authentication Helpers
 * Provides utilities for password hashing, token generation, and session validation
 */

import crypto from 'crypto'

/**
 * Hash a password using PBKDF2
 * Production: Consider using bcrypt package instead
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')
  
  // Return salt:hash for later verification
  return `${salt}:${hash}`
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [salt, storedHash] = hash.split(':')
    const passwordHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex')
    
    return passwordHash === storedHash
  } catch {
    return false
  }
}

/**
 * Generate a simple JWT token (basic implementation)
 * Production: Use a library like jose for proper JWT handling
 */
export function generateToken(
  adminId: string,
  email: string,
  expiresIn: number = 24 * 60 * 60 * 1000 // 24 hours
): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: adminId,
    email,
    iat: now,
    exp: now + expiresIn / 1000,
  }

  const secret = process.env.JWT_SECRET || 'your-secret-key'

  // Base64 encode
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64')
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')

  // Create signature
  const message = `${encodedHeader}.${encodedPayload}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  return `${message}.${signature}`
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): { sub: string; email: string } | null {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const parts = token.split('.')

    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, signature] = parts

    // Verify signature
    const message = `${encodedHeader}.${encodedPayload}`
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    if (signature !== expectedSignature) return null

    // Decode payload
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString())

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return { sub: payload.sub, email: payload.email }
  } catch {
    return null
  }
}

/**
 * Extract admin ID from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  
  return parts[1]
}
