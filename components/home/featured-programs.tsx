"use client"

import Link from "next/link"
import { ArrowRight, Clock, Code, BarChart3, Palette } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const programs = [
  {
    icon: Code,
    title: "Développement web full-stack",
    description:
      "Acquérez des compétences front-end et back-end pour concevoir des applications web modernes et évolutives.",
    duration: "6 mois",
    category: "Technologie",
  },
  {
    icon: BarChart3,
    title: "Data science & analytique",
    description:
      "Python, visualisation et bases du machine learning pour transformer les données en décisions.",
    duration: "5 mois",
    category: "Données",
  },
  {
    icon: Palette,
    title: "UX/UI design",
    description:
      "Concevez des produits numériques centrés utilisateur avec des méthodes et outils de conception.",
    duration: "4 mois",
    category: "Design",
  },
]

export function FeaturedPrograms() {
  useScrollAnimation()

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end animate-on-scroll">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Sélection
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Commencez dès aujourd’hui
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Découvrez une sélection de parcours parmi les plus demandés.
            </p>
          </div>
          <Link
            href="/formations"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
          Voir toutes les formations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="stagger-children mt-12 grid gap-8 md:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.title}
              className="animate-on-scroll group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Card header */}
              <div className="flex items-center gap-4 border-b border-border p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <program.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {program.category}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{program.title}</h3>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-6">
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {program.duration}
                  </span>
                  <Link
                    href="/formations"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    En savoir plus
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
