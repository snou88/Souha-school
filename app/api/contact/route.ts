import { NextResponse } from "next/server"
import { sendContactFormToAdmin } from "@/lib/email"

/**
 * POST /api/contact – Envoie le message du formulaire contact à l'admin (CONTACT_EMAIL).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Adresse email invalide." },
        { status: 400 }
      )
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Le message doit contenir au moins 10 caractères." },
        { status: 400 }
      )
    }

    const result = await sendContactFormToAdmin({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    })

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error ?? "Impossible d'envoyer le message." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
