"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  User,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltUiLabels } from "@/lib/slt-content"

const steps = [
  { id: 1, title: "Type de demande", icon: GraduationCap },
  { id: 2, title: "Coordonnées", icon: User },
  { id: 3, title: "Formation", icon: BookOpen },
] as const

const accountTypes = ["Individual", "Company"] as const
type AccountType = (typeof accountTypes)[number]

interface FormData {
  accountType: AccountType | ""
  // Individual fields
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string

  // Company fields
  companyName: string
  companyPhone: string
  companyStudentCount: string
  companyContactName: string
  companyContactEmail: string

  // Program
  selectedProgram: string
  startDate: string
  agreeTerms: boolean
}

interface FormErrors {
  [key: string]: string
}

function validateStep(step: number, data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (step === 1) {
    if (!data.accountType) errors.accountType = "Veuillez sélectionner le type de demande."
  }

  if (step === 2) {
    if (data.accountType === "Individual") {
      if (!data.firstName.trim()) errors.firstName = "Le prénom est requis."
      if (!data.lastName.trim()) errors.lastName = "Le nom est requis."
      if (!data.email.trim()) errors.email = "L’adresse email est requise."
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Adresse email invalide."
      if (!data.phone.trim()) errors.phone = "Le numéro de téléphone est requis."
      if (!data.dateOfBirth) errors.dateOfBirth = "La date de naissance est requise."
    } else if (data.accountType === "Company") {
      if (!data.companyName.trim()) errors.companyName = "La raison sociale est requise."
      if (!data.companyPhone.trim()) errors.companyPhone = "Le téléphone de l’entreprise est requis."
      if (!data.companyStudentCount.trim() || isNaN(Number(data.companyStudentCount)))
        errors.companyStudentCount = "Veuillez saisir un nombre valide de participants."
      if (!data.companyContactName.trim()) errors.companyContactName = "Le nom du contact est requis."
      if (!data.companyContactEmail.trim()) errors.companyContactEmail = "L’email du contact est requis."
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.companyContactEmail))
        errors.companyContactEmail = "Adresse email du contact invalide."
    }
  }

  if (step === 3) {
    if (!data.selectedProgram) errors.selectedProgram = "Veuillez sélectionner une formation."
    if (!data.startDate) errors.startDate = "Veuillez sélectionner une période souhaitée."
  }

  return errors
}

export function InscriptionForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completed, setCompleted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    accountType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",

    companyName: "",
    companyPhone: "",
    companyStudentCount: "",
    companyContactName: "",
    companyContactEmail: "",

    selectedProgram: "",
    startDate: "",
    agreeTerms: false,
  })

  // State pour les programmes
  const [programs, setPrograms] = useState<Array<{ id: string; name: string }>>([])
  const [programsLoading, setProgramsLoading] = useState(true)
  const [programsError, setProgramsError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrograms() {
      setProgramsLoading(true)
      setProgramsError(null)
      try {
        const res = await fetch("/api/formations")
        const json = await res.json()
        if (!json.success) throw new Error(json.error || "Impossible de charger les formations")
        setPrograms(Array.isArray(json.data) ? json.data.map((f: any) => ({ id: f.id, name: f.name })) : [])
      } catch (e: any) {
        setProgramsError(e.message || "Erreur lors du chargement des programmes")
      } finally {
        setProgramsLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  useScrollAnimation()

  function update(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field as string]
      return next
    })
  }

  async function submitEnrollment(payload: FormData) {
    try {
      setLoading(true)
      
      // Construction du payload
      let apiPayload: any = {
        type: payload.accountType,
        formation: payload.selectedProgram,
        status: "Pending"
      }

      if (payload.accountType === "Individual") {
        apiPayload = {
          ...apiPayload,
          name: `${payload.firstName} ${payload.lastName}`.trim(),
          email: payload.email,
          phone: payload.phone,
          number: 1
        }
      } else if (payload.accountType === "Company") {
        apiPayload = {
          ...apiPayload,
          name: payload.companyName,
          email: payload.companyContactEmail,
          phone: payload.companyPhone,
          number: Number(payload.companyStudentCount) || 1,
        }
      }

      console.log("📤 Envoi des données:", apiPayload)

      const res = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      })

      const responseData = await res.json()
      console.log("📥 Réponse API:", responseData)

      if (!res.ok) {
        throw new Error(responseData.error || "Échec de l’envoi de la demande")
      }

      // Succès !
      setCompleted(true)
      
    } catch (e: any) {
      console.error("❌ Erreur:", e)
      setErrors({ form: e.message || "Erreur réseau" })
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    const stepErrors = validateStep(currentStep, formData)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length === 0) {
      if (currentStep === steps.length) {
        submitEnrollment(formData)
      } else {
        setCurrentStep((s) => s + 1)
      }
    }
  }

  function handleBack() {
    setErrors({})
    setCurrentStep((s) => Math.max(1, s - 1))
  }

  const progressPercent = completed ? 100 : ((currentStep - 1) / steps.length) * 100

  const inputClasses = (field: string) =>
    cn(
      "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
      errors[field] ? "border-destructive" : "border-border"
    )

  return (
    <div className="bg-secondary pb-24 pt-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Inscription</span>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Déposez votre demande
          </h1>
          <p className="mt-3 text-pretty text-lg leading-relaxed text-muted-foreground">
            Quelques minutes suffisent pour transmettre votre demande.
          </p>
        </div>

        <div className="mt-10 animate-on-scroll">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {!completed && (
          <div className="mt-6 animate-on-scroll">
            <div className="flex items-center justify-between">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isDone = currentStep > step.id

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                        isDone
                          ? "border-primary bg-primary text-primary-foreground"
                          : isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span
                      className={cn(
                        "hidden text-xs font-medium sm:block",
                        isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-8 animate-on-scroll">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            {completed ? (
              <div className="flex flex-col items-center py-12 text-center animate-fade-in-up">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-foreground">Demande envoyée</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Merci, {formData.accountType === "Individual" 
                    ? `${formData.firstName} ${formData.lastName}`.trim()
                    : formData.companyName}!
                  Votre demande pour <span className="font-semibold text-foreground">{formData.selectedProgram}</span>{" "}
                  a bien été reçue. Un accusé de réception sera envoyé à{" "}
                  <span className="font-semibold text-foreground">
                    {formData.accountType === "Individual" 
                      ? formData.email 
                      : formData.companyContactEmail}
                  </span>
                  .
                </p>
              </div>
            ) : (
              <>
                {/* STEP 1: Account Type */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-foreground">Type de demande</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {accountTypes.map((t) => {
                        const selected = formData.accountType === t
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => update("accountType", t)}
                            className={cn(
                              "flex items-center gap-4 rounded-lg border p-4 text-left transition-all",
                              selected ? "border-primary bg-primary/10" : "border-border bg-background"
                            )}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/50">
                              {t === "Individual" ? <User className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{sltUiLabels.accountType[t]}</div>
                              <div className="text-sm text-muted-foreground">
                                {t === "Individual"
                                  ? "Demande individuelle"
                                  : "Demande pour plusieurs collaborateurs"}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {errors.accountType && <p className="mt-1 text-xs text-destructive">{errors.accountType}</p>}
                  </div>
                )}

                {/* STEP 2: Details (conditional) */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-foreground">Coordonnées</h2>

                    {formData.accountType === "Individual" ? (
                      <>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-foreground">
                              Prénom
                            </label>
                            <input
                              id="firstName"
                              type="text"
                              className={inputClasses("firstName")}
                              placeholder="Ex : Ahmed"
                              value={formData.firstName}
                              onChange={(e) => update("firstName", e.target.value)}
                            />
                            {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
                          </div>
                          <div>
                            <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-foreground">
                              Nom
                            </label>
                            <input
                              id="lastName"
                              type="text"
                              className={inputClasses("lastName")}
                              placeholder="Ex : Senouci"
                              value={formData.lastName}
                              onChange={(e) => update("lastName", e.target.value)}
                            />
                            {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className={inputClasses("email")}
                            placeholder="exemple@domaine.com"
                            value={formData.email}
                            onChange={(e) => update("email", e.target.value)}
                          />
                          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                              Téléphone
                            </label>
                            <input
                              id="phone"
                              type="tel"
                              className={inputClasses("phone")}
                              placeholder="Ex : 05 XX XX XX XX"
                              value={formData.phone}
                              onChange={(e) => update("phone", e.target.value)}
                            />
                            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                          </div>
                          <div>
                            <label htmlFor="dateOfBirth" className="mb-1.5 block text-sm font-medium text-foreground">
                              Date de naissance
                            </label>
                            <input
                              id="dateOfBirth"
                              type="date"
                              className={inputClasses("dateOfBirth")}
                              value={formData.dateOfBirth}
                              onChange={(e) => update("dateOfBirth", e.target.value)}
                            />
                            {errors.dateOfBirth && (
                              <p className="mt-1 text-xs text-destructive">{errors.dateOfBirth}</p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      // Company fields
                      <>
                        <div>
                          <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium text-foreground">
                            Raison sociale
                          </label>
                          <input
                            id="companyName"
                            type="text"
                            className={inputClasses("companyName")}
                            placeholder="Ex : Société ABC"
                            value={formData.companyName}
                            onChange={(e) => update("companyName", e.target.value)}
                          />
                          {errors.companyName && (
                            <p className="mt-1 text-xs text-destructive">{errors.companyName}</p>
                          )}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="companyPhone" className="mb-1.5 block text-sm font-medium text-foreground">
                              Téléphone entreprise
                            </label>
                            <input
                              id="companyPhone"
                              type="tel"
                              className={inputClasses("companyPhone")}
                              placeholder="Ex : 05 XX XX XX XX"
                              value={formData.companyPhone}
                              onChange={(e) => update("companyPhone", e.target.value)}
                            />
                            {errors.companyPhone && (
                              <p className="mt-1 text-xs text-destructive">{errors.companyPhone}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="companyStudentCount" className="mb-1.5 block text-sm font-medium text-foreground">
                              Nombre de participants
                            </label>
                            <input
                              id="companyStudentCount"
                              type="number"
                              min={1}
                              className={inputClasses("companyStudentCount")}
                              placeholder="Ex : 5"
                              value={formData.companyStudentCount}
                              onChange={(e) => update("companyStudentCount", e.target.value)}
                            />
                            {errors.companyStudentCount && (
                              <p className="mt-1 text-xs text-destructive">{errors.companyStudentCount}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="companyContactName" className="mb-1.5 block text-sm font-medium text-foreground">
                              Contact (nom)
                            </label>
                            <input
                              id="companyContactName"
                              type="text"
                              className={inputClasses("companyContactName")}
                              placeholder="Ex : Responsable formation"
                              value={formData.companyContactName}
                              onChange={(e) => update("companyContactName", e.target.value)}
                            />
                            {errors.companyContactName && (
                              <p className="mt-1 text-xs text-destructive">{errors.companyContactName}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="companyContactEmail" className="mb-1.5 block text-sm font-medium text-foreground">
                              Contact (email)
                            </label>
                            <input
                              id="companyContactEmail"
                              type="email"
                              className={inputClasses("companyContactEmail")}
                              placeholder="contact@entreprise.com"
                              value={formData.companyContactEmail}
                              onChange={(e) => update("companyContactEmail", e.target.value)}
                            />
                            {errors.companyContactEmail && (
                              <p className="mt-1 text-xs text-destructive">{errors.companyContactEmail}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* STEP 3: Program Selection */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-foreground">Choisir une formation</h2>
                    <div>
                      <label htmlFor="selectedProgram" className="mb-1.5 block text-sm font-medium text-foreground">
                        Formation
                      </label>
                      <select
                        id="selectedProgram"
                        className={inputClasses("selectedProgram")}
                        value={formData.selectedProgram}
                        onChange={(e) => update("selectedProgram", e.target.value)}
                      >
                        <option value="">Sélectionner une formation</option>
                        {programsLoading && <option disabled>Chargement…</option>}
                        {programsError && <option disabled>Erreur de chargement</option>}
                        {!programsLoading && !programsError && programs.length === 0 && (
                          <option disabled>Aucune formation disponible</option>
                        )}
                        {!programsLoading && !programsError &&
                          programs.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                      </select>
                      {errors.selectedProgram && <p className="mt-1 text-xs text-destructive">{errors.selectedProgram}</p>}
                    </div>
                    <div>
                      <label htmlFor="startDate" className="mb-1.5 block text-sm font-medium text-foreground">
                        Période souhaitée
                      </label>
                      <select
                        id="startDate"
                        className={inputClasses("startDate")}
                        value={formData.startDate}
                        onChange={(e) => update("startDate", e.target.value)}
                      >
                        <option value="">Sélectionner une période</option>
                        <option value="Mars 2026">Mars 2026</option>
                        <option value="Juin 2026">Juin 2026</option>
                        <option value="Septembre 2026">Septembre 2026</option>
                        <option value="Janvier 2027">Janvier 2027</option>
                      </select>
                      {errors.startDate && <p className="mt-1 text-xs text-destructive">{errors.startDate}</p>}
                    </div>
                  </div>
                )}

                {errors.form && <p className="mt-4 text-sm text-destructive">{errors.form}</p>}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  {currentStep > 1 ? (
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-secondary active:scale-[0.98]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep === steps.length
                      ? loading
                        ? "Envoi…"
                        : "Envoyer la demande"
                      : "Continuer"}
                    {currentStep < steps.length && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}