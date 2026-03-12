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
  Clock,
  Users,
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltUiLabels } from "@/lib/slt-content"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const steps = [
  { id: 1, title: "Type de demande", icon: GraduationCap },
  { id: 2, title: "Coordonnées", icon: User },
  { id: 3, title: "Formation", icon: BookOpen },
] as const

const accountTypes = ["Individual", "Company"] as const
type AccountType = (typeof accountTypes)[number]

interface Formation {
  id: string
  name: string
  description: string | null
  duration: string
}

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
      if (!data.companyContactEmail.trim()) errors.companyContactEmail = "L'email du contact est requis."
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.companyContactEmail))
        errors.companyContactEmail = "Adresse email du contact invalide."
    }
  }

  if (step === 3) {
    if (!data.selectedProgram) errors.selectedProgram = "Veuillez sélectionner une formation."
  }

  return errors
}

export function InscriptionForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completed, setCompleted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedFormationDetails, setSelectedFormationDetails] = useState<Formation | null>(null)
  const [temporarySelection, setTemporarySelection] = useState<string>("")

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
    agreeTerms: false,
  })

  // State pour les programmes
  const [programs, setPrograms] = useState<Formation[]>([])
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
        
        const formationsData = Array.isArray(json.data) ? json.data.map((f: any) => ({ 
          id: f.id, 
          name: f.name,
          description: f.description,
          duration: f.duration 
        })) : []
        
        setPrograms(formationsData)
        
        // Vérifier s'il y a une formation pré-sélectionnée dans l'URL
        const params = new URLSearchParams(window.location.search)
        const formationId = params.get('formation')
        const formationName = params.get('name')
        
        if (formationId) {
          // Chercher par ID
          const found = formationsData.find((f: Formation) => f.id === formationId)
          if (found) {
            setFormData(prev => ({ ...prev, selectedProgram: found.id }))
          }
        } else if (formationName) {
          // Chercher par nom (pour la compatibilité)
          const found = formationsData.find((f: Formation) => f.name === decodeURIComponent(formationName))
          if (found) {
            setFormData(prev => ({ ...prev, selectedProgram: found.id }))
          }
        }
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
      
      // Récupérer le nom de la formation sélectionnée
      const selectedFormation = programs.find(p => p.id === payload.selectedProgram)
      
      // Construction du payload
      let apiPayload: any = {
        type: payload.accountType,
        formation: selectedFormation?.name || payload.selectedProgram,
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

  function handleFormationSelect(formationId: string) {
    const formation = programs.find(f => f.id === formationId)
    if (formation) {
      setSelectedFormationDetails(formation)
      setShowConfirmDialog(true)
      setTemporarySelection(formationId)
    }
  }

  function confirmFormation() {
    update("selectedProgram", temporarySelection)
    setShowConfirmDialog(false)
  }

  function cancelFormation() {
    setShowConfirmDialog(false)
    setTemporarySelection("")
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

  const selectedFormation = programs.find(f => f.id === formData.selectedProgram)

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
                    : formData.companyName} !
                  Votre demande pour <span className="font-semibold text-foreground">{selectedFormation?.name || formData.selectedProgram}</span>{" "}
                  a bien été enregistrée. Un accusé de réception a été envoyé à{" "}
                  <span className="font-semibold text-foreground">
                    {formData.accountType === "Individual" 
                      ? formData.email 
                      : formData.companyContactEmail}
                  </span>
                  . Nous vous contacterons très prochainement avec les informations complémentaires.
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
                    
                    {selectedFormation ? (
                      // Formation déjà sélectionnée - Affichage carte
                      <div className="relative rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-primary text-white border-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Sélectionnée
                          </Badge>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{selectedFormation.name}</h3>
                            {selectedFormation.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {selectedFormation.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-3 mt-3">
                              <Badge variant="outline" className="bg-background">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                {selectedFormation.duration}
                              </Badge>
                            </div>
                            
                            {/* Message indiquant que la formation vient de la page précédente */}
                            <p className="text-xs text-primary mt-2">
                              ✓ Formation sélectionnée depuis la page des formations
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => update("selectedProgram", "")}
                            className="text-sm text-primary hover:underline"
                          >
                            Changer
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Liste des formations à sélectionner
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {programsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          </div>
                        ) : programsError ? (
                          <p className="text-sm text-destructive text-center py-4">{programsError}</p>
                        ) : programs.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">Aucune formation disponible</p>
                        ) : (
                          programs.map((program) => (
                            <button
                              key={program.id}
                              type="button"
                              onClick={() => handleFormationSelect(program.id)}
                              className="w-full text-left rounded-lg border border-border bg-background p-4 hover:border-primary/50 hover:shadow-sm transition-all group"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/50 group-hover:bg-primary/10 transition-colors">
                                  <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                      {program.name}
                                    </h4>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                  </div>
                                  
                                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {program.duration}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                    
                    {errors.selectedProgram && (
                      <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-destructive" />
                        {errors.selectedProgram}
                      </p>
                    )}
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
                    disabled={loading || (currentStep === 3 && !formData.selectedProgram)}
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

      {/* Dialog de confirmation */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la formation</DialogTitle>
            <DialogDescription>
              Vous avez sélectionné la formation suivante :
            </DialogDescription>
          </DialogHeader>

          {selectedFormationDetails && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h3 className="font-semibold text-foreground mb-2">{selectedFormationDetails.name}</h3>
                {selectedFormationDetails.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedFormationDetails.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-background">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedFormationDetails.duration}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={cancelFormation}>
                  Retour
                </Button>
                <Button onClick={confirmFormation} className="bg-primary text-white">
                  Confirmer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}