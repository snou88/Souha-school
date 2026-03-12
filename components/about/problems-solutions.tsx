"use client"

import { useEffect, useRef, useState } from "react"
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Flame,
  Shield,
  Target,
  TrendingUp,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltHomeContent } from "@/lib/slt-content"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Couleurs pour les problèmes (rouge)
const problemColors = {
  primary: "bg-red-50",
  secondary: "bg-red-100",
  text: "text-red-600",
  border: "border-red-200",
  shadow: "shadow-red-100/50",
  gradient: "from-red-500 to-red-400",
  icon: "text-red-500",
  light: "bg-red-500/5",
  dot: "bg-red-400",
  hover: "hover:shadow-red-200/50"
}

// Couleurs pour les solutions (vert)
const solutionColors = {
  primary: "bg-emerald-50",
  secondary: "bg-emerald-100",
  text: "text-emerald-600",
  border: "border-emerald-200",
  shadow: "shadow-emerald-100/50",
  gradient: "from-emerald-500 to-emerald-400",
  icon: "text-emerald-500",
  light: "bg-emerald-500/5",
  dot: "bg-emerald-400",
  hover: "hover:shadow-emerald-200/50"
}

// Cercles statiques pour le background
const staticCircles = [
  { size: 42, top: 15, left: 10, color: 'bg-red-400/20', delay: 0, duration: 14 },
  { size: 18, top: 8, left: 85, color: 'bg-emerald-400/20', delay: 2, duration: 10 },
  { size: 31, top: 22, left: 30, color: 'bg-red-500/20', delay: 1, duration: 8 },
  { size: 33, top: 45, left: 75, color: 'bg-emerald-500/20', delay: 3, duration: 12 },
  { size: 50, top: 12, left: 55, color: 'bg-red-400/20', delay: 4, duration: 16 },
  { size: 24, top: 35, left: 20, color: 'bg-emerald-400/20', delay: 0.5, duration: 11 },
  { size: 41, top: 68, left: 40, color: 'bg-red-300/20', delay: 2.5, duration: 13 },
  { size: 54, top: 82, left: 15, color: 'bg-emerald-300/20', delay: 1.5, duration: 15 },
  { size: 29, top: 72, left: 90, color: 'bg-red-400/20', delay: 3.5, duration: 9 },
  { size: 37, top: 28, left: 70, color: 'bg-emerald-400/20', delay: 0.8, duration: 14 },
]

export function ProblemsSolutions() {
  useScrollAnimation()
  const [mounted, setMounted] = useState(false)
  const [hoveredProblem, setHoveredProblem] = useState<number | null>(null)
  const [hoveredSolution, setHoveredSolution] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative bg-gradient-to-b from-background via-background to-white py-24 overflow-hidden">
      {/* Dégradés de transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white pointer-events-none z-10" />

      {/* Petits cercles flottants */}
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
                opacity: 0.2
              }}
            />
          ))}
        </div>
      )}

      {/* Grands cercles d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-red-200/10 blur-3xl" />
        <div className="absolute -left-20 bottom-40 h-[400px] w-[400px] rounded-full bg-emerald-200/10 blur-3xl" />
        <div className="absolute left-1/3 top-60 h-[300px] w-[300px] rounded-full bg-amber-200/5 blur-3xl" />
      </div>

      {/* Grille de fond */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-20">
        {/* En-tête de section */}
        <div className="mx-auto max-w-2xl text-center mb-16 animate-on-scroll">
          <Badge 
            variant="outline" 
            className="mb-4 px-4 py-1.5 text-xs bg-white/80 backdrop-blur-sm border-primary/20 text-primary"
          >
            <Sparkles className="h-3 w-3 mr-2 text-primary" />
            Pourquoi nous choisir ?
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Des problèmes aux solutions
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Nous transformons vos défis en opportunités de croissance
          </p>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-red-400 to-emerald-400 mx-auto rounded-full" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Colonne des problèmes */}
          <div className="animate-on-scroll space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <Badge variant="outline" className="bg-red-50/50 text-red-600 border-red-200">
                  {sltHomeContent.problems.eyebrow}
                </Badge>
                <h3 className="mt-2 text-2xl font-bold text-foreground">
                  {sltHomeContent.problems.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {sltHomeContent.problems.items.map((item, index) => (
                <div
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setHoveredProblem(index)}
                  onMouseLeave={() => setHoveredProblem(null)}
                >
                  <div
                    className={cn(
                      "relative flex items-start gap-4 rounded-2xl border border-red-200/50 bg-white/70 backdrop-blur-sm p-6 shadow-lg transition-all duration-500 overflow-hidden",
                      hoveredProblem === index ? "shadow-xl scale-[1.02] border-red-300" : "hover:shadow-lg"
                    )}
                    style={{
                      boxShadow: hoveredProblem === index ? "0 20px 40px -15px rgba(239, 68, 68, 0.3)" : ""
                    }}
                  >
                    {/* Bande de couleur en haut */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-400" />
                    
                    {/* Points décoratifs */}
                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-400 opacity-50" />
                      <span className="h-2 w-2 rounded-full bg-red-400 opacity-30" />
                      <span className="h-2 w-2 rounded-full bg-red-400 opacity-20" />
                    </div>

                    {/* Icône avec animation */}
                    <div className={cn(
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 transition-all duration-500",
                      hoveredProblem === index && "scale-110 rotate-3"
                    )}>
                      <AlertTriangle className={cn(
                        "h-6 w-6 text-red-500 transition-all duration-500",
                        hoveredProblem === index && "rotate-12"
                      )} />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <p className="text-base leading-relaxed text-foreground/80">
                        {item}
                      </p>
                      
                      {/* Indicateur de défi */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-medium text-red-500">Défi</span>
                        <div className="h-1 flex-1 rounded-full bg-red-100 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-700"
                            style={{ width: hoveredProblem === index ? "100%" : "60%" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Effet de brillance */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne des solutions */}
          <div className="animate-on-scroll space-y-6" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <Badge variant="outline" className="bg-emerald-50/50 text-emerald-600 border-emerald-200">
                  {sltHomeContent.solutions.eyebrow}
                </Badge>
                <h3 className="mt-2 text-2xl font-bold text-foreground">
                  {sltHomeContent.solutions.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {sltHomeContent.solutions.items.map((item, index) => (
                <div
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setHoveredSolution(index)}
                  onMouseLeave={() => setHoveredSolution(null)}
                >
                  <div
                    className={cn(
                      "relative flex items-start gap-4 rounded-2xl border border-emerald-200/50 bg-white/70 backdrop-blur-sm p-6 shadow-lg transition-all duration-500 overflow-hidden",
                      hoveredSolution === index ? "shadow-xl scale-[1.02] border-emerald-300" : "hover:shadow-lg"
                    )}
                    style={{
                      boxShadow: hoveredSolution === index ? "0 20px 40px -15px rgba(16, 185, 129, 0.3)" : ""
                    }}
                  >
                    {/* Bande de couleur en haut */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
                    
                    {/* Points décoratifs */}
                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 opacity-50" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400 opacity-30" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400 opacity-20" />
                    </div>

                    {/* Icône avec animation */}
                    <div className={cn(
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 transition-all duration-500",
                      hoveredSolution === index && "scale-110 rotate-3"
                    )}>
                      <CheckCircle2 className={cn(
                        "h-6 w-6 text-emerald-500 transition-all duration-500",
                        hoveredSolution === index && "rotate-12"
                      )} />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <p className="text-base leading-relaxed text-foreground/80">
                        {item}
                      </p>
                      
                      {/* Indicateur de solution */}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-medium text-emerald-500">Solution</span>
                        <div className="h-1 flex-1 rounded-full bg-emerald-100 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: hoveredSolution === index ? "100%" : "60%" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Effet de brillance */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-circle {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(15px, -15px) rotate(5deg);
          }
          50% {
            transform: translate(0, -25px) rotate(0deg);
          }
          75% {
            transform: translate(-15px, -10px) rotate(-5deg);
          }
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </section>
  )
}