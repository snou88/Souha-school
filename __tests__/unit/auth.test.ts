/**
 * Tests for Authentication Utilities
 */

import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth'

describe('Auth Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'test123456'
      const hashed = await hashPassword(password)

      expect(hashed).toBeDefined()
      expect(hashed).not.toBe(password)
      expect(hashed).toContain(':') // Should have salt:hash format
    })

    it('should verify a correct password', async () => {
      const password = 'test123456'
      const hashed = await hashPassword(password)
      const isValid = await verifyPassword(password, hashed)

      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const password = 'test123456'
      const hashed = await hashPassword(password)
      const isValid = await verifyPassword('wrongpassword', hashed)

      expect(isValid).toBe(false)
    })
  })

  describe('JWT Token', () => {
    it('should generate a valid token', () => {
      const token = generateToken('admin-123', 'admin@test.com')

      expect(token).toBeDefined()
      expect(token).toMatch(/^[\w-]*\.[\w-]*\.[\w-]*$/) // JWT format
    })

    it('should decode a valid token', () => {
      const adminId = 'admin-123'
      const email = 'admin@test.com'
      const token = generateToken(adminId, email)
      const decoded = verifyToken(token)

      expect(decoded).toBeDefined()
      expect(decoded?.sub).toBe(adminId)
      expect(decoded?.email).toBe(email)
    })

    it('should reject an invalid token', () => {
      const result = verifyToken('invalid.token.here')

      expect(result).toBeNull()
    })

    it('should reject an expired token', () => {
      const expiredToken = generateToken('admin-123', 'admin@test.com', -1000) // Expired 1 second ago
      const decoded = verifyToken(expiredToken)

      expect(decoded).toBeNull()
    })
  })
})
