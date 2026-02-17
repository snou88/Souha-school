/**
 * POST /api/upload/partner-logo
 * Generate signed upload URL for partner logo
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateUploadUrl } from '@/lib/storage'
import { handleApiError, corsHeaders } from '@/lib/api-middleware'

const PARTNER_LOGOS_BUCKET = process.env.NEXT_PUBLIC_PARTNER_LOGOS_BUCKET || 'partner-logos'
const MAX_LOGO_SIZE = parseInt(process.env.MAX_LOGO_SIZE || '5242880')

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileSize, fileType } = await req.json()

    if (!fileName || !fileSize || !fileType) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Validate file size
    if (fileSize > MAX_LOGO_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: `File size exceeds ${MAX_LOGO_SIZE / 1024 / 1024}MB limit`,
        },
        { status: 413, headers: corsHeaders() }
      )
    }

    // Validate file type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!validMimes.includes(fileType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid file type. Only PNG, JPG, WEBP, and SVG are allowed',
        },
        { status: 400, headers: corsHeaders() }
      )
    }

    // Generate signed URL
    const { url } = await generateUploadUrl(
      PARTNER_LOGOS_BUCKET,
      `partner-logos/${Date.now()}-${fileName}`
    )

    return NextResponse.json(
      {
        success: true,
        data: {
          uploadUrl: url,
          bucketName: PARTNER_LOGOS_BUCKET,
        },
      },
      { status: 200, headers: corsHeaders() }
    )
  } catch (error) {
    console.error('Upload URL generation error:', error)
    return handleApiError(error)
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() })
}
