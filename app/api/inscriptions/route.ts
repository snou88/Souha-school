import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { sendInscriptionConfirmation, sendAdmissionEmail, sendNewInscriptionNotificationToAdmin } from '@/lib/email'

const RETRY_DELAY_MS = 800
const MAX_RETRIES = 2

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const isTransientFetchError = (error: any) => {
  const msg = `${error?.message || ''} ${error?.details || ''}`.toLowerCase()
  return (
    msg.includes('fetch failed') ||
    msg.includes('connect timeout') ||
    msg.includes('und_err_connect_timeout')
  )
}

async function withRetry<T>(
  operation: () => PromiseLike<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> {
  let lastResult: { data: T | null; error: any } = { data: null, error: null }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const result = await operation()
    lastResult = result

    if (!result.error) {
      return result
    }

    if (!isTransientFetchError(result.error) || attempt === MAX_RETRIES) {
      return result
    }

    await sleep(RETRY_DELAY_MS * (attempt + 1))
  }

  return lastResult
}

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

    type StudentRow = { type?: string; name?: string; email?: string; number?: number }
    type FormationRow = { name?: string }

    const firstOf = <T>(rel: T | T[] | null | undefined): T | undefined => {
      if (rel == null) return undefined
      return Array.isArray(rel) ? rel[0] : rel
    }

    // Transformer les données pour le frontend
    const formattedData = (data ?? []).map((item) => {
      const student = firstOf<StudentRow>(item.students as StudentRow | StudentRow[] | null)
      const formation = firstOf<FormationRow>(item.formations as FormationRow | FormationRow[] | null)
      return {
        id: item.id,
        type: student?.type || 'Individual',
        name: student?.name || '',
        email: student?.email || '',
        formation: formation?.name || '',
        date: new Date(item.created_at).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
        }),
        number: student?.number ?? 1,
        status: item.status || 'Pending',
      }
    })

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
    const { data: formationData, error: formationError } = await withRetry<{ id: number }>(() =>
      supabaseAdmin.from('formations').select('id').eq('name', formation).single()
    )

    if (formationError || !formationData) {
      if (formationError && isTransientFetchError(formationError)) {
        return NextResponse.json({
          success: false,
          error: "Connexion temporairement indisponible. Veuillez réessayer dans quelques secondes."
        }, { status: 503 })
      }
      return NextResponse.json({ 
        success: false, 
        error: "Formation introuvable."
      }, { status: 404 })
    }

    const formationRow = formationData

    // 2. Créer l'étudiant
    const { data: studentData, error: studentError } = await withRetry(() =>
      supabaseAdmin
        .from('students')
        .insert([
          {
            type,
            name,
            email,
            phone: phone || null,
            number: number || 1,
            formation_id: formationRow.id,
            status: 'Pending', // Les étudiants commencent avec status Pending
          },
        ])
        .select()
        .single()
    )

    if (studentError) {
      console.error('Error creating student:', studentError)
      return NextResponse.json({
        success: false,
        error: isTransientFetchError(studentError)
          ? "Connexion temporairement indisponible. Veuillez réessayer dans quelques secondes."
          : studentError.message
      }, { status: isTransientFetchError(studentError) ? 503 : 500 })
    }

    const studentRow = studentData as { id: number } | null
    if (!studentRow) {
      return NextResponse.json({ success: false, error: "Étudiant non créé." }, { status: 500 })
    }

    // 3. Créer l'inscription
    const { data: inscriptionData, error: inscriptionError } = await withRetry(() =>
      supabaseAdmin
        .from('inscriptions')
        .insert([
          {
            student_id: studentRow.id,
            formation_id: formationRow.id,
            status: status || 'Pending',
          },
        ])
        .select()
        .single()
    )

    if (inscriptionError) {
      console.error('Error creating inscription:', inscriptionError)
      return NextResponse.json({
        success: false,
        error: isTransientFetchError(inscriptionError)
          ? "Connexion temporairement indisponible. Veuillez réessayer dans quelques secondes."
          : inscriptionError.message
      }, { status: isTransientFetchError(inscriptionError) ? 503 : 500 })
    }

    // Envoi de l'email de confirmation (n'échoue pas la requête si l'email échoue)
    const emailResult = await sendInscriptionConfirmation({
      to: email,
      recipientName: name,
      formationName: formation,
    })
    if (!emailResult.ok) {
      console.warn('[inscriptions] Email de confirmation non envoyé:', emailResult.error)
    }

    // Notification admin : nouvelle inscription
    const notifResult = await sendNewInscriptionNotificationToAdmin({
      candidateName: name,
      candidateEmail: email,
      formationName: formation,
      type: type === 'Company' ? 'Company' : 'Individual',
    })
    if (!notifResult.ok) {
      console.warn('[inscriptions] Notification admin non envoyée:', notifResult.error)
    }

    return NextResponse.json({
      success: true,
      data: {
        student: studentRow,
        inscription: inscriptionData,
      },
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
    const { data: inscription, error: inscriptionError } = await withRetry(() =>
      supabaseAdmin
        .from('inscriptions')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
    )

    if (inscriptionError) {
      console.error('Supabase error:', inscriptionError)
      return NextResponse.json({
        success: false,
        error: isTransientFetchError(inscriptionError)
          ? "Connexion temporairement indisponible. Veuillez réessayer dans quelques secondes."
          : inscriptionError.message
      }, { status: isTransientFetchError(inscriptionError) ? 503 : 500 })
    }

    const inscriptionRow = inscription as {
      student_id?: number
      formation_id?: number
    } | null

    // Si le statut est "Approved", mettre à jour l'étudiant en "Active" et envoyer l'email d'admission
    if (status === "Approved" && inscriptionRow?.student_id) {
      const { error: studentUpdateError } = await withRetry(() =>
        supabaseAdmin
          .from('students')
          .update({
            status: 'Active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', inscriptionRow.student_id)
      )

      if (studentUpdateError) {
        console.error('Error updating student status to Active:', studentUpdateError)
      } else {
        // Récupérer nom, email de l'étudiant et nom de la formation pour l'email d'admission
        const [studentRes, formationRes] = await Promise.all([
          supabaseAdmin.from('students').select('name, email').eq('id', inscriptionRow.student_id).single(),
          supabaseAdmin.from('formations').select('name').eq('id', inscriptionRow.formation_id).single(),
        ])
        const studentData = studentRes.data
        const formationData = formationRes.data
        if (studentData?.email && studentData?.name && formationData?.name) {
          const admissionResult = await sendAdmissionEmail({
            to: studentData.email,
            recipientName: studentData.name,
            formationName: formationData.name,
          })
          if (!admissionResult.ok) {
            console.warn('[inscriptions] Email d\'admission non envoyé:', admissionResult.error)
          }
        }
      }
    }

    // Si le statut est "Rejected", mettre à jour l'étudiant en "Inactive"
    if (status === "Rejected" && inscriptionRow?.student_id) {
      const { error: studentUpdateError } = await withRetry(() =>
        supabaseAdmin
          .from('students')
          .update({
            status: 'Inactive',
            updated_at: new Date().toISOString(),
          })
          .eq('id', inscriptionRow.student_id)
      )

      if (studentUpdateError) {
        console.error('Error updating student status to Inactive:', studentUpdateError)
      }
    }

    return NextResponse.json({ success: true, data: inscriptionRow })
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