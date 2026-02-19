"use client"

import {
  Target,
  Eye,
  Heart,
  Zap,
  Shield,
  Lightbulb,
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltIdentity } from "@/lib/slt-content"

const values = [
  {
    icon: Lightbulb,
    title: "Pertinence",
    description: "Des contenus alignés sur les besoins réels des organisations et l’évolution du marché.",
  },
  {
    icon: Heart,
    title: "Accompagnement",
    description: "Une démarche centrée sur l’apprenant et les objectifs opérationnels des équipes.",
  },
  {
    icon: Shield,
    title: "Intégrité",
    description: "Exigence, transparence et respect des engagements, dans un cadre institutionnel.",
  },
  {
    icon: Zap,
    title: "Excellence",
    description: "Qualité pédagogique, intervenants experts et amélioration continue.",
  },
]

export function AboutContent() {
  useScrollAnimation()

  return (
    <div className="bg-background pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero header */}
        <div className="mx-auto max-w-3xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            À propos
          </span>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {sltIdentity.officialName}
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            {sltIdentity.description}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <div className="animate-on-scroll rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-foreground">Notre mission</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {sltIdentity.objective}
            </p>
          </div>
          <div className="animate-on-scroll rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-foreground">Notre vision</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Accompagner durablement les organisations et les apprenants par des formations à forte valeur ajoutée, des séminaires et des dispositifs sur mesure, dans le respect des exigences institutionnelles et de la qualité.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Nos engagements
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ce qui guide notre action
            </h2>
          </div>
          <div className="stagger-children mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="animate-on-scroll rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
