/**
 * Database Helper Functions
 * Supabase client initialization and utility functions
 */
 
import { createSupabaseServiceRoleClient } from './supabaseClient'
 
/**
 * Singleton Supabase client for server-side use.
 * Uses the service role key so MUST only be imported from server-only code
 * (API routes, server actions, backend utilities).
 */
export const supabase = createSupabaseServiceRoleClient()

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
  return {
    success: false,
    error: error instanceof Error ? error.message : 'An error occurred',
    details: error,
    statusCode,
  }
}
