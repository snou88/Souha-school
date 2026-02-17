/**
 * Database Helper Functions
 * Provides typed Prisma client instance for use throughout the app
 */

import { PrismaClient } from '@prisma/client'

// Singleton instance to avoid creating multiple connections
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 500) // Limit length
}

/**
 * Validate phone number (basic format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/
  return phoneRegex.test(phone)
}

/**
 * Format database response for API
 */
export function formatResponse<T>(data: T, message = 'Success') {
  return {
    success: true,
    message,
    data,
  }
}

/**
 * Format error response
 */
export function formatErrorResponse(
  error: unknown,
  statusCode: number = 400
) {
  const message =
    error instanceof Error ? error.message : 'An error occurred'

  return {
    success: false,
    message,
    statusCode,
  }
}
