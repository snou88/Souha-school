/**
 * Tests for Database Utilities
 */

import { isValidEmail, isValidPhone, sanitizeInput } from '@/lib/db'

describe('Database Utilities', () => {
  describe('Email Validation', () => {
    it('should validate correct email format', () => {
      const validEmails = [
        'user@example.com',
        'john.doe@company.co.uk',
        'test+tag@domain.org',
      ]

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        '',
      ]

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })
  })

  describe('Phone Validation', () => {
    it('should validate correct phone format', () => {
      const validPhones = [
        '+1 (555) 012-3456',
        '555-1234567',
        '+212 6 12345678',
        '001 (555) 123-4567',
      ]

      validPhones.forEach(phone => {
        expect(isValidPhone(phone)).toBe(true)
      })
    })

    it('should reject invalid phone format', () => {
      const invalidPhones = [
        '123', // Too short
        'not a phone',
        '',
      ]

      invalidPhones.forEach(phone => {
        expect(isValidPhone(phone)).toBe(false)
      })
    })
  })

  describe('Input Sanitization', () => {
    it('should sanitize HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello'
      const sanitized = sanitizeInput(input)

      expect(sanitized).not.toContain('<')
      expect(sanitized).not.toContain('>')
      expect(sanitized).toContain('Hello')
    })

    it('should trim whitespace', () => {
      const input = '  Hello World  '
      const sanitized = sanitizeInput(input)

      expect(sanitized).toBe('Hello World')
    })

    it('should limit length to 500 characters', () => {
      const input = 'a'.repeat(1000)
      const sanitized = sanitizeInput(input)

      expect(sanitized.length).toBeLessThanOrEqual(500)
    })
  })
})
