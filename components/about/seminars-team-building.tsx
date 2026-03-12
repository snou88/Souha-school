"use client"

import { useEffect, useRef, useState } from "react"
import { 
  Users2, 
  ListChecks, 
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltHomeContent } from "@/lib/slt-content"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Couleurs douces pour le site éducatif
const cardColors = [
  {
    primary: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    gradient: "from-blue-500 to-blue-400",
    icon: "text-blue-500",
    dot: "bg-blue-400"
  },
  {
    primary: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-emerald-400",
    icon: "text-emerald-500",
    dot: "bg-emerald-400"
  }
]

// Cercles statiques pour le background
const staticCircles = [
  { size: 42, top: 15, left: 10, color: 'bg-blue-400/20', delay: 0, duration: 14 },
  { size: 18, top: 8, left: 85, color: 'bg-emerald-400/20', delay: 2, duration: 10 },
  { size: 31, top: 22, left: 30, color: 'bg-blue-400/20', delay: 1, duration: 8 },
  { size: 33, top: 45, left: 75, color: 'bg-emerald-400/20', delay: 3, duration: 12 },
  { size: 24, top: 68, left: 40, color: 'bg-blue-400/20', delay: 2.5, duration: 13 },
  { size: 29, top: 82, left: 60, color: 'bg-emerald-400/20', delay: 3.5, duration: 9 },
]

export function SeminarsTeamBuilding() {
  useScrollAnimation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative bg-gradient-to-b from-background to-white py-20 overflow-hidden">
      {/* Dégradé vers le blanc */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

      {/* Petits cercles flottants discrets */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {staticCircles.map((circle, index) => (
            <div
              key={index}
              className={`absolute rounded-full ${circle.color} blur-sm`}
              style={{
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                top: `${circle.top}%`,
                left: `${circle.left}%`,
                animation: `float-circle ${circle.duration}s ease-in-out ${circle.delay}s infinite`,
                opacity: 0.15
              }}
            />
          ))}
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-20">
        {/* En-tête de section - plus sobre */}
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
          <Badge 
            variant="outline" 
            className="mb-4 px-4 py-1.5 text-xs bg-white/80 border-primary/20 text-primary"
          >
            {sltHomeContent.seminars.eyebrow}
          </Badge>
          
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sltHomeContent.seminars.title}
          </h2>
          
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Renforcez la cohésion et développez les compétences de vos équipes
          </p>
        </div>

        {/* Cartes principales */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Carte des types de séminaires */}
          <div className="animate-on-scroll group relative rounded-2xl border border-border/50 bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* En-tête */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users2 className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Types de séminaires</h3>
                <p className="text-sm text-muted-foreground">Formats adaptés</p>
              </div>
            </div>

            {/* Liste des types */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {sltHomeContent.seminars.types.map((type, index) => (
                <div
                  key={type}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/20 p-3 transition-all hover:border-blue-200 hover:bg-blue-50/30"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{type}</span>
                </div>
              ))}
            </div>

            {/* Infos pratiques */}
            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Présentiel</span>
              </div>
            </div>
          </div>

          {/* Carte des thèmes */}
          <div className="animate-on-scroll group relative rounded-2xl border border-border/50 bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* En-tête */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ListChecks className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{sltHomeContent.seminars.themesTitle}</h3>
                <p className="text-sm text-muted-foreground">Thématiques variées</p>
              </div>
            </div>

            {/* Liste des thèmes */}
            <div className="mt-6 space-y-2">
              {sltHomeContent.seminars.themes.map((theme, index) => (
                <div
                  key={theme}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/20 p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/30"
                >
                  <span className="text-sm text-foreground">{theme}</span>
                </div>
              ))}
            </div>

            {/* Participants */}
            <div className="mt-6 flex items-center gap-2 border-t border-border/50 pt-4 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Groupes de 8 à 20 personnes</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-circle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(2deg); }
          50% { transform: translate(0, -15px) rotate(0deg); }
          75% { transform: translate(-10px, -5px) rotate(-2deg); }
        }
      `}</style>
    </section>
  )
}