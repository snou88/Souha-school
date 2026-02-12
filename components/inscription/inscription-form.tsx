"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { User, GraduationCap, BookOpen, CreditCard, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Education", icon: GraduationCap },
  { id: 3, title: "Program", icon: BookOpen },
  { id: 4, title: "Payment", icon: CreditCard },
] as const

const programs = [
  "Full-Stack Web Development",
  "Data Science & Analytics",
  "UX/UI Design Mastery",
  "Digital Marketing Strategy",
  "Cybersecurity Fundamentals",
  "Cloud & DevOps Engineering",
  "AI & Machine Learning",
  "Mobile App Development",
  "Project Management Professional",
]

const educationLevels = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Professional Certificate",
  "Other",
]

const paymentOptions = [
  { id: "full", label: "Full Payment", description: "Pay the full tuition upfront and save 10%.", price: "$4,500" },
  { id: "installment", label: "Monthly Installments", description: "Split your tuition into 6 equal monthly payments.", price: "$850/mo" },
  { id: "scholarship", label: "Scholarship Application", description: "Apply for our merit-based scholarship program.", price: "Varies" },
]

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  educationLevel: string
  institution: string
  yearOfCompletion: string
  selectedProgram: string
  startDate: string
  paymentOption: string
  agreeTerms: boolean
}

interface FormErrors {
  [key: string]: string
}

function validateStep(step: number, data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (step === 1) {
    if (!data.firstName.trim()) errors.firstName = "First name is required."
    if (!data.lastName.trim()) errors.lastName = "Last name is required."
    if (!data.email.trim()) errors.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Invalid email address."
    if (!data.phone.trim()) errors.phone = "Phone number is required."
    if (!data.dateOfBirth) errors.dateOfBirth = "Date of birth is required."
  }

  if (step === 2) {
    if (!data.educationLevel) errors.educationLevel = "Education level is required."
    if (!data.institution.trim()) errors.institution = "Institution name is required."
    if (!data.yearOfCompletion) errors.yearOfCompletion = "Year of completion is required."
  }

  if (step === 3) {
    if (!data.selectedProgram) errors.selectedProgram = "Please select a program."
    if (!data.startDate) errors.startDate = "Preferred start date is required."
  }

  if (step === 4) {
    if (!data.paymentOption) errors.paymentOption = "Please select a payment option."
    if (!data.agreeTerms) errors.agreeTerms = "You must agree to the terms."
  }

  return errors
}

export function InscriptionForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completed, setCompleted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    educationLevel: "",
    institution: "",
    yearOfCompletion: "",
    selectedProgram: "",
    startDate: "",
    paymentOption: "",
    agreeTerms: false,
  })

  useScrollAnimation()

  function update(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function handleNext() {
    const stepErrors = validateStep(currentStep, formData)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length === 0) {
      if (currentStep === 4) {
        setCompleted(true)
      } else {
        setCurrentStep((s) => s + 1)
      }
    }
  }

  function handleBack() {
    setErrors({})
    setCurrentStep((s) => s - 1)
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
        {/* Header */}
        <div className="text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Enrollment</span>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Start Your Journey
          </h1>
          <p className="mt-3 text-pretty text-lg leading-relaxed text-muted-foreground">
            Complete your application in just a few minutes.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-10 animate-on-scroll">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stepper */}
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

        {/* Form card */}
        <div className="mt-8 animate-on-scroll">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            {completed ? (
              /* Success Screen */
              <div className="flex flex-col items-center py-12 text-center animate-fade-in-up">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-foreground">Application Submitted!</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Thank you, {formData.firstName}! Your enrollment application for{" "}
                  <span className="font-semibold text-foreground">{formData.selectedProgram}</span>{" "}
                  has been received. We will send a confirmation to{" "}
                  <span className="font-semibold text-foreground">{formData.email}</span> within 24 hours.
                </p>
                <div className="mt-8 rounded-lg bg-secondary p-6 text-left">
                  <h3 className="text-sm font-semibold text-foreground">Application Summary</h3>
                  <dl className="mt-3 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between gap-8">
                      <dt className="text-muted-foreground">Name</dt>
                      <dd className="font-medium text-foreground">
                        {formData.firstName} {formData.lastName}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-8">
                      <dt className="text-muted-foreground">Program</dt>
                      <dd className="font-medium text-foreground">{formData.selectedProgram}</dd>
                    </div>
                    <div className="flex justify-between gap-8">
                      <dt className="text-muted-foreground">Payment Plan</dt>
                      <dd className="font-medium text-foreground">
                        {paymentOptions.find((p) => p.id === formData.paymentOption)?.label}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <>
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-foreground">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          className={inputClasses("firstName")}
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => update("firstName", e.target.value)}
                        />
                        {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-foreground">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          className={inputClasses("lastName")}
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => update("lastName", e.target.value)}
                        />
                        {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={inputClasses("email")}
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => update("email", e.target.value)}
                      />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className={inputClasses("phone")}
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => update("phone", e.target.value)}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                      </div>
                      <div>
                        <label htmlFor="dateOfBirth" className="mb-1.5 block text-sm font-medium text-foreground">
                          Date of Birth
                        </label>
                        <input
                          id="dateOfBirth"
                          type="date"
                          className={inputClasses("dateOfBirth")}
                          value={formData.dateOfBirth}
                          onChange={(e) => update("dateOfBirth", e.target.value)}
                        />
                        {errors.dateOfBirth && <p className="mt-1 text-xs text-destructive">{errors.dateOfBirth}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Education */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-foreground">Education Background</h2>
                    <div>
                      <label htmlFor="educationLevel" className="mb-1.5 block text-sm font-medium text-foreground">
                        Highest Education Level
                      </label>
                      <select
                        id="educationLevel"
                        className={inputClasses("educationLevel")}
                        value={formData.educationLevel}
                        onChange={(e) => update("educationLevel", e.target.value)}
                      >
                        <option value="">Select your education level</option>
                        {educationLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      {errors.educationLevel && (
                        <p className="mt-1 text-xs text-destructive">{errors.educationLevel}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="institution" className="mb-1.5 block text-sm font-medium text-foreground">
                        Institution Name
                      </label>
                      <input
                        id="institution"
                        type="text"
                        className={inputClasses("institution")}
                        placeholder="University of New York"
                        value={formData.institution}
                        onChange={(e) => update("institution", e.target.value)}
                      />
                      {errors.institution && <p className="mt-1 text-xs text-destructive">{errors.institution}</p>}
                    </div>
                    <div>
                      <label htmlFor="yearOfCompletion" className="mb-1.5 block text-sm font-medium text-foreground">
                        Year of Completion
                      </label>
                      <input
                        id="yearOfCompletion"
                        type="number"
                        min="1970"
                        max="2030"
                        className={inputClasses("yearOfCompletion")}
                        placeholder="2023"
                        value={formData.yearOfCompletion}
                        onChange={(e) => update("yearOfCompletion", e.target.value)}
                      />
                      {errors.yearOfCompletion && (
                        <p className="mt-1 text-xs text-destructive">{errors.yearOfCompletion}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Program Selection */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-foreground">Select Your Program</h2>
                    <div>
                      <label htmlFor="selectedProgram" className="mb-1.5 block text-sm font-medium text-foreground">
                        Training Program
                      </label>
                      <select
                        id="selectedProgram"
                        className={inputClasses("selectedProgram")}
                        value={formData.selectedProgram}
                        onChange={(e) => update("selectedProgram", e.target.value)}
                      >
                        <option value="">Choose a program</option>
                        {programs.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {errors.selectedProgram && (
                        <p className="mt-1 text-xs text-destructive">{errors.selectedProgram}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="startDate" className="mb-1.5 block text-sm font-medium text-foreground">
                        Preferred Start Date
                      </label>
                      <select
                        id="startDate"
                        className={inputClasses("startDate")}
                        value={formData.startDate}
                        onChange={(e) => update("startDate", e.target.value)}
                      >
                        <option value="">Select a cohort</option>
                        <option value="March 2026">March 2026</option>
                        <option value="June 2026">June 2026</option>
                        <option value="September 2026">September 2026</option>
                        <option value="January 2027">January 2027</option>
                      </select>
                      {errors.startDate && <p className="mt-1 text-xs text-destructive">{errors.startDate}</p>}
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-foreground">Payment Option</h2>
                    <div className="flex flex-col gap-3">
                      {paymentOptions.map((option) => (
                        <label
                          key={option.id}
                          className={cn(
                            "flex cursor-pointer items-start gap-4 rounded-lg border p-5 transition-all",
                            formData.paymentOption === option.id
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-background hover:border-primary/30"
                          )}
                        >
                          <input
                            type="radio"
                            name="paymentOption"
                            value={option.id}
                            checked={formData.paymentOption === option.id}
                            onChange={(e) => update("paymentOption", e.target.value)}
                            className="mt-0.5 h-4 w-4 accent-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">{option.label}</span>
                              <span className="text-sm font-bold text-primary">{option.price}</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </label>
                      ))}
                      {errors.paymentOption && (
                        <p className="text-xs text-destructive">{errors.paymentOption}</p>
                      )}
                    </div>

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => update("agreeTerms", e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-primary"
                      />
                      <span className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <a href="#" className="font-medium text-primary underline">
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="font-medium text-primary underline">
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                    {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  {currentStep > 1 ? (
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-secondary active:scale-[0.98]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
                  >
                    {currentStep === 4 ? "Submit Application" : "Continue"}
                    {currentStep < 4 && <ArrowRight className="h-4 w-4" />}
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
