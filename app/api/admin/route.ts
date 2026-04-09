import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

// GET /api/admin - Récupérer tous les admins
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin')  // Changé de 'admins' à 'admin'
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: data || [] 
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur"
    }, { status: 500 })
  }
}

// POST /api/admin - Créer un nouvel admin
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "Le nom, l’email et le mot de passe sont requis."
      }, { status: 400 })
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: "Format d’email invalide."
      }, { status: 400 })
    }

    // Validation mot de passe (minimum 6 caractères)
    if (password.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: "Le mot de passe doit contenir au moins 6 caractères."
      }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const { data: existingAdmin, error: checkError } = await supabaseAdmin
      .from('admin')  // Changé de 'admins' à 'admin'
      .select('email')
      .eq('email', email)
      .maybeSingle()

    if (existingAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: "Cet email existe déjà."
      }, { status: 400 })
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    // Insérer le nouvel admin
    const { data, error } = await supabaseAdmin
      .from('admin')  // Changé de 'admins' à 'admin'
      .insert([
        {
          name,
          email,
          password_hash,
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ])
      .select('id, name, email, role, created_at')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data 
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur"
    }, { status: 500 })
  }
}

// PUT /api/admin - Modifier un admin
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, email, password } = body

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "L’identifiant est requis."
      }, { status: 400 })
    }

    // Vérifier si l'admin existe
    const { data: adminExists, error: checkExistsError } = await supabaseAdmin
      .from('admin')  // Changé de 'admins' à 'admin'
      .select('id')
      .eq('id', id)
      .single()

    if (!adminExists) {
      return NextResponse.json({ 
        success: false, 
        error: "Administrateur introuvable."
      }, { status: 404 })
    }

    // Vérifier si l'email existe déjà pour un autre admin
    if (email) {
      const { data: existingAdmin } = await supabaseAdmin
        .from('admin')  // Changé de 'admins' à 'admin'
        .select('id')
        .eq('email', email)
        .neq('id', id)
        .maybeSingle()

      if (existingAdmin) {
        return NextResponse.json({ 
          success: false, 
          error: "Cet email est déjà utilisé par un autre administrateur."
        }, { status: 400 })
      }
    }

    const updateData: {
      name?: string
      email?: string
      password_hash?: string
      updated_at: string
    } = {
      updated_at: new Date().toISOString()
    }

    if (typeof name === 'string') {
      updateData.name = name
    }

    if (typeof email === 'string') {
      updateData.email = email
    }

    if (typeof password === 'string' && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json({
          success: false,
          error: "Le mot de passe doit contenir au moins 6 caractères."
        }, { status: 400 })
      }

      const salt = await bcrypt.genSalt(10)
      updateData.password_hash = await bcrypt.hash(password, salt)
    }

    // Mettre à jour l'admin
    const { data, error } = await supabaseAdmin
      .from('admin')  // Changé de 'admins' à 'admin'
      .update(updateData)
      .eq('id', id)
      .select('id, name, email, role, created_at')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data 
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur"
    }, { status: 500 })
  }
}

// DELETE /api/admin - Supprimer un admin
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "L’identifiant est requis."
      }, { status: 400 })
    }

    // Vérifier si c'est le dernier admin
    const { count, error: countError } = await supabaseAdmin
      .from('admin')  // Changé de 'admins' à 'admin'
      .select('*', { count: 'exact', head: true })

    if (count === 1) {
      return NextResponse.json({ 
        success: false, 
        error: "Impossible de supprimer le dernier administrateur."
      }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('admin')  // Changé de 'admins' à 'admin'
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: "Administrateur supprimé avec succès."
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur"
    }, { status: 500 })
  }
}