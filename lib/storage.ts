/**
 * Supabase Storage Integration
 * Handles file uploads, signed URLs, and bucket management
 */

import { supabase } from '@/lib/db'

const PARTNER_LOGOS_BUCKET = process.env.NEXT_PUBLIC_PARTNER_LOGOS_BUCKET || 'partner-logos'
const STUDENT_DOCUMENTS_BUCKET = process.env.NEXT_PUBLIC_STUDENT_DOCUMENTS_BUCKET || 'student-documents'

const MAX_LOGO_SIZE = parseInt(process.env.MAX_LOGO_SIZE || '5242880') // 5MB
const MAX_DOCUMENT_SIZE = parseInt(process.env.MAX_DOCUMENT_SIZE || '10485760') // 10MB

/**
 * Generate signed URL for file upload
 */
export async function generateUploadUrl(
  bucketName: string,
  fileName: string,
  expiresIn: number = 3600
): Promise<{ url: string; token: string }> {
  try {
    // Generate signed upload URL
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(fileName, expiresIn)

    if (error) {
      throw new Error(`Failed to generate upload URL: ${error.message}`)
    }

    return {
      url: data.signedUrl,
      token: data.token,
    }
  } catch (error) {
    throw new Error(`Upload URL generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate signed URL for file download
 */
export async function generateDownloadUrl(
  bucketName: string,
  fileName: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const supabase = createAdminSupabaseClient()
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, expiresIn)

    if (error) {
      throw new Error(`Failed to generate download URL: ${error.message}`)
    }

    return data.signedUrl
  } catch (error) {
    throw new Error(`Download URL generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Upload partner logo
 */
export async function uploadPartnerLogo(
  file: File,
  partnerId: string
): Promise<string> {
  if (file.size > MAX_LOGO_SIZE) {
    throw new Error(`File size exceeds limit of ${MAX_LOGO_SIZE / 1024 / 1024}MB`)
  }

  const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  if (!validMimes.includes(file.type)) {
    throw new Error('Invalid file type. Only PNG, JPG, WEBP, and SVG are allowed')
  }

  try {
    const supabase = createAdminSupabaseClient()
    const fileName = `${partnerId}-${Date.now()}.${file.type.split('/')[1]}`
    const filePath = `partner-logos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(PARTNER_LOGOS_BUCKET)
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Generate signed URL
    const signedUrl = await generateDownloadUrl(PARTNER_LOGOS_BUCKET, filePath)
    return signedUrl
  } catch (error) {
    throw error
  }
}

/**
 * Upload student document
 */
export async function uploadStudentDocument(
  file: File,
  studentId: string
): Promise<{ url: string; fileName: string; fileSize: number; fileType: string }> {
  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error(`File size exceeds limit of ${MAX_DOCUMENT_SIZE / 1024 / 1024}MB`)
  }

  const validMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  if (!validMimes.includes(file.type)) {
    throw new Error('Invalid file type. Only PDF, Images, and Word are allowed')
  }

  try {
    const supabase = createAdminSupabaseClient()
    const fileName = `${studentId}-${Date.now()}-${file.name}`
    const filePath = `student-documents/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(STUDENT_DOCUMENTS_BUCKET)
      .upload(filePath, file)

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Generate signed URL
    const signedUrl = await generateDownloadUrl(STUDENT_DOCUMENTS_BUCKET, filePath)

    return {
      url: signedUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }
  } catch (error) {
    throw error
  }
}

/**
 * Delete file from bucket
 */
export async function deleteFile(
  bucketName: string,
  filePath: string
): Promise<void> {
  try {
    const supabase = createAdminSupabaseClient()
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  } catch (error) {
    throw error
  }
}
