import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET /api/partenaires
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, website, logoBase64 } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "Le nom est requis." }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('partners')
      .insert([{ 
        name, 
        website: website || null, 
        logo_url: logoBase64 || null 
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// PUT (UPDATE)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, website, logoBase64, removeLogo } = body

    if (!id || !name) {
      return NextResponse.json({ success: false, error: "ID et nom sont requis." }, { status: 400 })
    }

    let updateData: any = { 
      name, 
      website: website || null 
    }

    // Gérer le logo
    if (removeLogo) {
      updateData.logo_url = null
    } else if (logoBase64) {
      updateData.logo_url = logoBase64
    }

    const { data, error } = await supabaseAdmin
      .from('partners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    const { error } = await supabaseAdmin
      .from('partners')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}