import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

// ==============================
// GET /api/formations
// ==============================
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("formations")
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase GET error:", error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error("Unexpected GET error:", err)
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// ==============================
// POST /api/formations
// ==============================
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, description, status, duration, category_id } = body

    // Validation obligatoire
    if (!name || !duration) {
      return NextResponse.json(
        { success: false, error: "Le nom et la durée sont requis." },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("formations")
      .insert([
        {
          name,
          description: description || null,
          duration,
          status: status || "Draft",
          category_id: category_id || null
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase POST error:", error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error("Unexpected POST error:", err)
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// ==============================
// PUT /api/formations
// ==============================
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, description, status, duration, category_id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "L’identifiant est requis." },
        { status: 400 }
      )
    }

    const updates: any = {}

    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (status !== undefined) updates.status = status
    if (duration !== undefined) updates.duration = duration
    if (category_id !== undefined) updates.category_id = category_id

    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from("formations")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Supabase PUT error:", error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error("Unexpected PUT error:", err)
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// ==============================
// DELETE /api/formations
// ==============================
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "L’identifiant est requis." },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from("formations")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Supabase DELETE error:", error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Unexpected DELETE error:", err)
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
