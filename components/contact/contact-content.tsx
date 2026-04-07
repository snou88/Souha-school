"use client";

import { useState, type FormEvent, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { sltIdentity } from "@/lib/slt-content";

const contactEmail = "SOUHA.SCHOOL.LT@GMAIL.COM";

const mapAddressHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sltIdentity.address)}`;

const normalizePhoneForTel = (phone: string) => phone.replace(/[^\d+]/g, "");

type ContactLine = { label: string; href?: string };

type ContactInfoBlock = {
  icon: typeof MapPin;
  title: string;
  subtitle?: string;
  lines: ContactLine[];
};

const contactInfo: ContactInfoBlock[] = [
  {
    icon: MapPin,
    title: "Adresse",
    subtitle: "Cliquez pour ouvrir l’itinéraire",
    lines: [{ label: sltIdentity.address, href: mapAddressHref }],
  },
  {
    icon: Phone,
    title: "Téléphone",
    subtitle: "Cliquez pour appeler",
    lines: sltIdentity.phones.map((phone) => ({
      label: phone,
      href: `tel:${normalizePhoneForTel(phone)}`,
    })),
  },
  {
    icon: Mail,
    title: "Email",
    subtitle: "Réponse généralement sous 24h ouvrées",
    lines: [{ label: contactEmail, href: `mailto:${contactEmail}` }],
  },
  {
    icon: Clock,
    title: "Horaires",
    lines: [
      { label: "Dimanche - Jeudi : 09:00 - 18:00" },
      { label: "Samedi : 10:00 - 14:00" },
    ],
  },
];

const infoCardStyles = [
  {
    iconWrap:
      "bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-blue-500/5 text-blue-700 ring-blue-500/25",
    glow: "from-blue-100/80 via-blue-50/40 to-transparent",
  },
] as const;

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  form?: string;
}

export function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useScrollAnimation();

  // Détecter si c'est mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = "Le nom complet est requis.";
    if (!formData.email.trim()) e.email = "L’adresse email est requise.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Veuillez saisir une adresse email valide.";
    if (!formData.subject.trim()) e.subject = "L’objet est requis.";
    if (!formData.message.trim()) e.message = "Le message est requis.";
    else if (formData.message.trim().length < 10)
      e.message = "Le message doit contenir au moins 10 caractères.";
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setErrors({ form: data.error ?? "Impossible d'envoyer le message. Réessayez plus tard." });
      }
    } catch {
      setErrors({ form: "Erreur de connexion. Réessayez plus tard." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={sectionRef}
      className="relative -mt-px overflow-hidden bg-cover bg-no-repeat pb-24 pt-32"
      style={{
        backgroundImage: isMobile ? "url('/image/background-tel1.png')" : "url('/image/background1.png')",
        backgroundPosition: isMobile ? "center top" : "center",
      }}
    >
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 pointer-events-none" />
      
      {/* Effets décoratifs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-20">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-black">
            Contact
          </span>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
            Parlons de votre projet
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-black-90">
            Une question sur nos formations, séminaires ou accompagnements ? Notre équipe vous répond avec un accompagnement clair, rapide et personnalisé.
          </p>
        </div>

        {/* Split layout */}
        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          {/* Contact info - left */}
          <div className="lg:col-span-2">
            <div className="stagger-children flex flex-col gap-6">
              {contactInfo.map((item, index) => {
                const styles = infoCardStyles[index % infoCardStyles.length];
                return (
                <div
                  key={item.title}
                  className="animate-on-scroll group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border/70 bg-white/95 p-5 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-500 group-hover:opacity-90", styles.glow)} />
                  <div className={cn("relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", styles.iconWrap)}>
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.subtitle}
                      </p>
                    )}
                    {item.lines.map((line) =>
                      line.href != null && line.href !== "" ? (
                        <a
                          key={line.label}
                          href={line.href}
                          target={line.href.startsWith("http") ? "_blank" : undefined}
                          rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {line.label}
                        </a>
                      ) : (
                        <p key={line.label} className="mt-1 text-sm text-muted-foreground">
                          {line.label}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Form - right */}
          <div className="lg:col-span-3">
            <div className="animate-on-scroll relative overflow-hidden rounded-2xl border border-border/70 bg-white/95 p-8 shadow-md backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent" />
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary/40 to-primary/70" />
              {submitted ? (
                <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-200">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">
                    Message envoyé
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Merci pour votre message. Nous vous répondrons dans les meilleurs délais, généralement sous 24 heures ouvrées.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="mt-6 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  id="contact-form"
                  className="relative z-10 flex flex-col gap-6"
                >
                  {errors.form && (
                    <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {errors.form}
                    </p>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Nom complet
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={cn(
                          "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
                          errors.name ? "border-destructive" : "border-border",
                        )}
                        placeholder="Ex : Ahmed Senouci"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-destructive">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={cn(
                          "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
                          errors.email ? "border-destructive" : "border-border",
                        )}
                        placeholder="exemple@domaine.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Objet
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className={cn(
                        "w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
                        errors.subject ? "border-destructive" : "border-border",
                      )}
                      placeholder="Ex : Demande d’information sur une formation"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className={cn(
                        "w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
                        errors.message ? "border-destructive" : "border-border",
                      )}
                      placeholder="Décrivez votre besoin (contexte, objectifs, public concerné, délais)…"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {loading ? "Envoi en cours…" : "Envoyer le message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map avec Google Maps iframe */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-border/70 bg-white/95 shadow-md backdrop-blur-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d199.80932610909935!2d2.9864058231843993!3d36.74778999494874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzbCsDQ0JzUyLjEiTiAywrA1OScxMS44IkU!5e0!3m2!1sfr!2sdz!4v1770982457442!5m2!1sfr!2sdz"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}