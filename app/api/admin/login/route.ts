import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

// POST /api/admin/login - Authentifier un admin
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("🔍 Tentative de connexion pour:", email)

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    // Chercher l'admin dans la table 'admin'
    const { data: admin, error } = await supabaseAdmin
      .from('admin')
      .select('id, name, email, password_hash, role')
      .eq('email', email)
      .single()

    if (error || !admin) {
      console.log("❌ Admin non trouvé")
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 })
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, admin.password_hash)

    if (!isValid) {
      console.log("❌ Mot de passe invalide")
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 })
    }

    // Créer la session
    const sessionData = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role || 'admin',
      loggedIn: true
    }

    const sessionString = Buffer.from(JSON.stringify(sessionData)).toString('base64')

    // Définir le cookie - ATTENTION: on doit attendre cookies()
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    })

    console.log("✅ Connexion réussie pour:", admin.email)

    return NextResponse.json({ 
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    })

  } catch (err) {
    console.error('❌ Login error:', err)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// GET /api/admin/login - Vérifier si l'admin est connecté
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        success: false, 
        authenticated: false 
      })
    }

    // Décoder la session
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString())
    
    return NextResponse.json({ 
      success: true,
      authenticated: true,
      admin: sessionData
    })
  } catch (err) {
    console.error('Session check error:', err)
    return NextResponse.json({ 
      success: false, 
      authenticated: false 
    })
  }
}

// DELETE /api/admin/login - Déconnexion
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    
    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    })
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}