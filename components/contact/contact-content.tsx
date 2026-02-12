"use client"

import { useState, type FormEvent } from "react"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["123 Education Blvd, Suite 400", "New York, NY 10001"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+1 (212) 555-1234"],
    href: "tel:+12125551234",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["info@apexacademy.com"],
    href: "mailto:info@apexacademy.com",
  },
  {
    icon: Clock,
    title: "Office Hours",
    lines: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 2:00 PM"],
  },
]

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactContent() {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  useScrollAnimation()

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!formData.name.trim()) e.name = "Full name is required."
    if (!formData.email.trim()) e.email = "Email address is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Please enter a valid email address."
    if (!formData.subject.trim()) e.subject = "Subject is required."
    if (!formData.message.trim()) e.message = "Message is required."
    else if (formData.message.trim().length < 10)
      e.message = "Message must be at least 10 characters."
    return e
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true)
    }
  }

  return (
    <div className="bg-background pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Get In Touch
          </span>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            We&apos;d Love to Hear From You
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Have questions about our programs? Our team is ready to help you take the next step.
          </p>
        </div>

        {/* Split layout */}
        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          {/* Contact info - left */}
          <div className="lg:col-span-2">
            <div className="stagger-children flex flex-col gap-6">
              {contactInfo.map((item) => (
                <div
                  key={item.title}
                  className="animate-on-scroll flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    {item.lines.map((line) =>
                      item.href ? (
                        <a
                          key={line}
                          href={item.href}
                          className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {line}
                        </a>
                      ) : (
                        <p key={line} className="text-sm text-muted-foreground">
                          {line}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form - right */}
          <div className="lg:col-span-3">
            <div className="animate-on-scroll rounded-xl border border-border bg-card p-8 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">Message Sent!</h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Thank you for reaching out. We typically respond within 24 hours during business days.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: "", email: "", subject: "", message: "" })
                    }}
                    className="mt-6 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(
                          "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
                          errors.name ? "border-destructive" : "border-border"
                        )}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(
                          "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
                          errors.email ? "border-destructive" : "border-border"
                        )}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={cn(
                        "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
                        errors.subject ? "border-destructive" : "border-border"
                      )}
                      placeholder="Inquiry about Web Development program"
                    />
                    {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={cn(
                        "w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
                        errors.message ? "border-destructive" : "border-border"
                      )}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-16 animate-on-scroll overflow-hidden rounded-xl border border-border shadow-sm">
          <div className="flex h-80 items-center justify-center bg-secondary">
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                123 Education Blvd, Suite 400, New York, NY 10001
              </p>
              <a
                href="https://maps.google.com/?q=New+York+NY+10001"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-primary hover:text-primary/80"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
