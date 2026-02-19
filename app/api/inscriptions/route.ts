import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// GET /api/inscriptions - Récupère toutes les inscriptions
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('inscriptions')
      .select(`
        id,
        status,
        created_at,
        students (
          id,
          type,
          name,
          email,
          phone,
          number
        ),
        formations (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Transformer les données pour le frontend
    const formattedData = data.map(item => ({
      id: item.id,
      type: item.students?.type || 'Individual',
      name: item.students?.name || '',
      email: item.students?.email || '',
      formation: item.formations?.name || '',
      date: new Date(item.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric', 
        month: 'long' 
      }),
      number: item.students?.number || 1,
      status: item.status || 'Pending'
    }))

    return NextResponse.json({ success: true, data: formattedData })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// POST /api/inscriptions - Crée une nouvelle inscription
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, name, email, phone, number, formation, status } = body

    if (!name || !email || !formation) {
      return NextResponse.json({ 
        success: false, 
        error: "Le nom, l’email et la formation sont requis."
      }, { status: 400 })
    }

    // 1. Trouver l'ID de la formation
    const { data: formationData, error: formationError } = await supabaseAdmin
      .from('formations')
      .select('id')
      .eq('name', formation)
      .single()

    if (formationError || !formationData) {
      return NextResponse.json({ 
        success: false, 
        error: "Formation introuvable."
      }, { status: 404 })
    }

    // 2. Créer l'étudiant
    const { data: studentData, error: studentError } = await supabaseAdmin
      .from('students')
      .insert([{
        type,
        name,
        email,
        phone: phone || null,
        number: number || 1,
        formation_id: formationData.id,
        status: 'Pending' // Les étudiants commencent avec status Pending
      }])
      .select()
      .single()

    if (studentError) {
      console.error('Error creating student:', studentError)
      return NextResponse.json({ 
        success: false, 
        error: studentError.message 
      }, { status: 500 })
    }

    // 3. Créer l'inscription
    const { data: inscriptionData, error: inscriptionError } = await supabaseAdmin
      .from('inscriptions')
      .insert([{
        student_id: studentData.id,
        formation_id: formationData.id,
        status: status || 'Pending'
      }])
      .select()
      .single()

    if (inscriptionError) {
      console.error('Error creating inscription:', inscriptionError)
      return NextResponse.json({ 
        success: false, 
        error: inscriptionError.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        student: studentData,
        inscription: inscriptionData
      }
    })

  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur"
    }, { status: 500 })
  }
}

// PUT /api/inscriptions - Met à jour une inscription (status)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "L’identifiant est requis." }, { status: 400 })
    }

    // Mettre à jour l'inscription
    const { data: inscription, error: inscriptionError } = await supabaseAdmin
      .from('inscriptions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (inscriptionError) {
      console.error('Supabase error:', inscriptionError)
      return NextResponse.json({ success: false, error: inscriptionError.message }, { status: 500 })
    }

    // Si le statut est "Approved", mettre à jour l'étudiant en "Active"
    if (status === "Approved" && inscription?.student_id) {
      await supabaseAdmin
        .from('students')
        .update({ 
          status: 'Active',
          updated_at: new Date().toISOString()
        })
        .eq('id', inscription.student_id)
    }

    // Si le statut est "Rejected", mettre à jour l'étudiant en "Inactive"
    if (status === "Rejected" && inscription?.student_id) {
      await supabaseAdmin
        .from('students')
        .update({ 
          status: 'Inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', inscription.student_id)
    }

    return NextResponse.json({ success: true, data: inscription })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// DELETE /api/inscriptions - Supprime une inscription et l'étudiant associé
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "L’identifiant est requis." }, { status: 400 })
    }

    // Récupérer le student_id associé
    const { data: inscription, error: fetchError } = await supabaseAdmin
      .from('inscriptions')
      .select('student_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 })
    }

    // Supprimer l'inscription
    const { error: deleteError } = await supabaseAdmin
      .from('inscriptions')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Supabase error:', deleteError)
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 })
    }

    // Supprimer l'étudiant associé
    if (inscription?.student_id) {
      await supabaseAdmin
        .from('students')
        .delete()
        .eq('id', inscription.student_id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}