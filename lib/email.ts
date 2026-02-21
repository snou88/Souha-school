import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface InscriptionConfirmationParams {
  to: string
  recipientName: string
  formationName: string
}

/**
 * Envoie un email de confirmation d'inscription professionnel au candidat.
 */
export async function sendInscriptionConfirmation({
  to,
  recipientName,
  formationName,
}: InscriptionConfirmationParams): Promise<{ ok: boolean; error?: string }> {
  const from = process.env.CONTACT_EMAIL || process.env.SMTP_USER || "noreply@slt.com"

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation d'inscription</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b;">Souha School - Formation professionnelle</p>
              <h1 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Confirmation de réception de votre demande</h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Madame, Monsieur <strong>${recipientName}</strong>,
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Nous vous confirmons avoir bien reçu votre demande d'inscription à la formation <strong>${formationName}</strong>.
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Votre dossier a été enregistré avec succès. Notre équipe l'examine et vous contactera <strong>très prochainement</strong> à l'adresse indiquée pour vous communiquer la suite à donner et les informations complémentaires.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Nous vous remercions pour l'intérêt que vous portez à nos formations et restons à votre disposition pour toute question.
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Cordialement,<br>
                <strong>L'équipe Souha School</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  const text = `
Souha School - Formation professionnelle

Confirmation de réception de votre demande

Madame, Monsieur ${recipientName},

Nous vous confirmons avoir bien reçu votre demande d'inscription à la formation ${formationName}.

Votre dossier a été enregistré avec succès. Notre équipe l'examine et vous contactera très prochainement à l'adresse indiquée pour vous communiquer la suite à donner et les informations complémentaires.

Nous vous remercions pour l'intérêt que vous portez à nos formations et restons à votre disposition pour toute question.

Cordialement,
L'équipe Souha School
`.trim()

  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("[email] SMTP non configuré (SMTP_HOST, SMTP_USER, SMTP_PASS). Email non envoyé.")
      return { ok: false, error: "SMTP non configuré" }
    }
    await transporter.sendMail({
      from: `"Souha School" <${from}>`,
      to,
      subject: "Confirmation de réception – Inscription formation Souha School",
      text,
      html,
    })
    return { ok: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    console.error("[email] Échec envoi confirmation:", message)
    return { ok: false, error: message }
  }
}

// --- Email d'admission (apprenant approuvé) ---

export interface AdmissionEmailParams {
  to: string
  recipientName: string
  formationName: string
}

/**
 * Envoie un email à l'apprenant pour l'informer qu'il est admis.
 */
export async function sendAdmissionEmail({
  to,
  recipientName,
  formationName,
}: AdmissionEmailParams): Promise<{ ok: boolean; error?: string }> {
  const from = process.env.CONTACT_EMAIL || process.env.SMTP_USER || "noreply@slt.com"

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admission - Souha School</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b;">Souha School - Formation professionnelle</p>
              <h1 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Félicitations, vous êtes admis(e)</h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Madame, Monsieur <strong>${recipientName}</strong>,
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Nous avons le plaisir de vous informer que votre candidature à la formation <strong>${formationName}</strong> a été retenue.
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Vous faites désormais partie des apprenants de Souha School. Notre équipe vous contactera très prochainement pour vous communiquer les prochaines étapes et les informations pratiques (calendrier, accès, etc.).
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Nous vous remercions pour votre confiance et vous souhaitons une excellente formation.
              </p>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Cordialement,<br>
                <strong>L'équipe Souha School</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #f0fdf4; border-top: 1px solid #bbf7d0;">
              <p style="margin: 0; font-size: 12px; color: #166534;">Cet email confirme votre admission. Conservez-le pour vos démarches.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  const text = `
Souha School - Formation professionnelle

Félicitations, vous êtes admis(e)

Madame, Monsieur ${recipientName},

Nous avons le plaisir de vous informer que votre candidature à la formation ${formationName} a été retenue.

Vous faites désormais partie des apprenants de Souha School. Notre équipe vous contactera très prochainement pour vous communiquer les prochaines étapes et les informations pratiques (calendrier, accès, etc.).

Nous vous remercions pour votre confiance et vous souhaitons une excellente formation.

Cordialement,
L'équipe Souha School
`.trim()

  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("[email] SMTP non configuré. Email d'admission non envoyé.")
      return { ok: false, error: "SMTP non configuré" }
    }
    await transporter.sendMail({
      from: `"Souha School" <${from}>`,
      to,
      subject: "Félicitations – Vous êtes admis(e) – Souha School",
      text,
      html,
    })
    return { ok: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    console.error("[email] Échec envoi admission:", message)
    return { ok: false, error: message }
  }
}

// --- Notification admin : nouvelle inscription ---

export interface NewInscriptionNotificationParams {
  candidateName: string
  candidateEmail: string
  formationName: string
  type: "Individual" | "Company"
}

/**
 * Envoie un email à l'admin pour l'informer d'une nouvelle inscription.
 */
export async function sendNewInscriptionNotificationToAdmin(
  params: NewInscriptionNotificationParams
): Promise<{ ok: boolean; error?: string }> {
  const adminEmail = process.env.CONTACT_EMAIL
  if (!adminEmail) {
    console.warn("[email] CONTACT_EMAIL non défini. Notification admin non envoyée.")
    return { ok: false, error: "CONTACT_EMAIL non défini" }
  }

  const { candidateName, candidateEmail, formationName, type } = params
  const from = process.env.SMTP_USER || adminEmail
  const typeLabel = type === "Individual" ? "Individuelle" : "Entreprise"

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle inscription – Souha School</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b;">Souha School – Espace administration</p>
              <h1 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 700; color: #0f172a;">Nouvelle demande d'inscription</h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Une nouvelle inscription a été enregistrée sur le site.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="width: 100%; margin: 24px 0; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Type</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${typeLabel}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Nom / Raison sociale</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${candidateName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${candidateEmail}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Formation</strong></td><td style="padding: 8px 0;">${formationName}</td></tr>
              </table>
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                Connectez-vous à l'espace admin pour traiter cette demande.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  const text = `
Souha School – Nouvelle inscription

Type: ${typeLabel}
Nom / Raison sociale: ${candidateName}
Email: ${candidateEmail}
Formation: ${formationName}

Connectez-vous à l'espace admin pour traiter cette demande.
`.trim()

  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("[email] SMTP non configuré. Notification admin non envoyée.")
      return { ok: false, error: "SMTP non configuré" }
    }
    await transporter.sendMail({
      from: `"Souha School" <${from}>`,
      to: adminEmail,
      subject: `[Souha School] Nouvelle inscription – ${candidateName} – ${formationName}`,
      text,
      html,
    })
    return { ok: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    console.error("[email] Échec notification admin:", message)
    return { ok: false, error: message }
  }
}
