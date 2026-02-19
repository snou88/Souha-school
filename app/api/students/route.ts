import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'

// GET /api/students - Récupère tous les étudiants avec leurs formations
export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('students')
      .select(`
        *,
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
    const formattedData = data.map(student => ({
      id: student.id,
      type: student.type || 'Individual',
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      name: student.name || '',
      email: student.email,
      phone: student.phone || '',
      companyName: student.companyName || '',
      companyPhone: student.companyPhone || '',
      companyStudentCount: student.companyStudentCount || 1,
      companyContactName: student.companyContactName || '',
      companyContactEmail: student.companyContactEmail || '',
      formationId: student.formation_id,
      formation: student.formations?.name || 'Unknown',
      status: student.status || 'Active',
      enrolled_date: student.enrolled_date || student.created_at,
      created_at: student.created_at,
      number: student.number || 1
    }))

    return NextResponse.json({ success: true, data: formattedData })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// POST /api/students
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      type, 
      name, 
      email, 
      phone, 
      formation_id,
      number,
      firstName,
      lastName,
      companyName,
      companyPhone,
      companyStudentCount,
      companyContactName,
      companyContactEmail,
      status 
    } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "L’email est requis." }, { status: 400 })
    }

    // Préparer les données selon le type
    let studentData: any = {
      type,
      email,
      formation_id,
      status: status || 'Active',
      enrolled_date: new Date().toISOString()
    }

    if (type === 'Individual') {
      studentData = {
        ...studentData,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        phone,
        number: 1
      }
    } else {
      studentData = {
        ...studentData,
        companyName,
        companyPhone,
        companyStudentCount,
        companyContactName,
        companyContactEmail,
        name: companyName,
        number: companyStudentCount || 1
      }
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('students')
      .insert([studentData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// PUT /api/students
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "L’identifiant est requis." }, { status: 400 })
    }

    updates.updated_at = new Date().toISOString()

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// DELETE /api/students
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "L’identifiant est requis." }, { status: 400 })
    }

    // Vérifier s'il y a des inscriptions associées
    const supabaseAdmin = getSupabaseAdmin()
    const { data: inscriptions, error: checkError } = await supabaseAdmin
      .from('inscriptions')
      .select('id')
      .eq('student_id', id)

    if (checkError) {
      return NextResponse.json({ success: false, error: checkError.message }, { status: 500 })
    }

    // Si des inscriptions existent, les supprimer d'abord
    if (inscriptions && inscriptions.length > 0) {
      const { error: deleteInscriptionsError } = await supabaseAdmin
        .from('inscriptions')
        .delete()
        .eq('student_id', id)

      if (deleteInscriptionsError) {
        return NextResponse.json({ success: false, error: deleteInscriptionsError.message }, { status: 500 })
      }
    }

    // Supprimer l'étudiant
    const { error } = await supabaseAdmin
      .from('students')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 })
  }
}