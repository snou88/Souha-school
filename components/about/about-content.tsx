"use client"

import { useEffect, useRef, useState } from "react"
import {
  Target,
  Eye,
  Heart,
  Zap,
  Shield,
  Lightbulb,
  Sparkles,
  Award,
  Users,
  CheckCircle,
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltIdentity } from "@/lib/slt-content"
import { Badge } from "@/components/ui/badge"

const values = [
  {
    icon: Lightbulb,
    title: "Pertinence",
    description: "Des contenus alignés sur les besoins réels des organisations et l'évolution du marché.",
    color: "blue"
  },
  {
    icon: Heart,
    title: "Accompagnement",
    description: "Une démarche centrée sur l'apprenant et les objectifs opérationnels des équipes.",
    color: "red"
  },
  {
    icon: Shield,
    title: "Intégrité",
    description: "Exigence, transparence et respect des engagements, dans un cadre institutionnel.",
    color: "amber"
  },
  {
    icon: Zap,
    title: "Excellence",
    description: "Qualité pédagogique, intervenants experts et amélioration continue.",
    color: "purple"
  },
]

const stats = [
  { label: "Formations disponibles", value: "25+", icon: Award },
  { label: "Apprenants formés", value: "500+", icon: Users },
  { label: "Taux de satisfaction", value: "96%", icon: CheckCircle },
]

// Couleurs pour les cartes
const colorMap = {
  blue: {
    primary: "bg-blue-50",
    secondary: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
    shadow: "shadow-blue-100/50",
    gradient: "from-blue-50 to-blue-100/50",
    icon: "text-blue-500",
    light: "bg-blue-500/5",
    dot: "bg-blue-400"
  },
  red: {
    primary: "bg-red-50",
    secondary: "bg-red-100",
    text: "text-red-600",
    border: "border-red-200",
    shadow: "shadow-red-100/50",
    gradient: "from-red-50 to-red-100/50",
    icon: "text-red-500",
    light: "bg-red-500/5",
    dot: "bg-red-400"
  },
  amber: {
    primary: "bg-amber-50",
    secondary: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
    shadow: "shadow-amber-100/50",
    gradient: "from-amber-50 to-amber-100/50",
    icon: "text-amber-500",
    light: "bg-amber-500/5",
    dot: "bg-amber-400"
  },
  purple: {
    primary: "bg-purple-50",
    secondary: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
    shadow: "shadow-purple-100/50",
    gradient: "from-purple-50 to-purple-100/50",
    icon: "text-purple-500",
    light: "bg-purple-500/5",
    dot: "bg-purple-400"
  }
}

// Cercles statiques pour le background
const staticCircles = [
  { size: 42, top: 15, left: 10, color: 'bg-blue-400/25', delay: 0, duration: 14 },
  { size: 18, top: 8, left: 85, color: 'bg-blue-600/10', delay: 2, duration: 10 },
  { size: 31, top: 22, left: 30, color: 'bg-blue-500/30', delay: 1, duration: 8 },
  { size: 33, top: 45, left: 75, color: 'bg-blue-400/30', delay: 3, duration: 12 },
  { size: 50, top: 12, left: 55, color: 'bg-blue-300/20', delay: 4, duration: 16 },
  { size: 24, top: 35, left: 20, color: 'bg-red-400/25', delay: 0.5, duration: 11 },
  { size: 41, top: 68, left: 40, color: 'bg-amber-400/20', delay: 2.5, duration: 13 },
  { size: 54, top: 82, left: 15, color: 'bg-purple-400/20', delay: 1.5, duration: 15 },
  { size: 29, top: 72, left: 90, color: 'bg-blue-400/30', delay: 3.5, duration: 9 },
  { size: 37, top: 28, left: 70, color: 'bg-red-300/20', delay: 0.8, duration: 14 },
  { size: 46, top: 92, left: 25, color: 'bg-amber-400/25', delay: 2.2, duration: 12 },
  { size: 22, top: 50, left: 45, color: 'bg-purple-400/20', delay: 4.1, duration: 10 },
]

export function AboutContent() {
  useScrollAnimation()
  const [mounted, setMounted] = useState(false)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      if (!parallaxRef.current) return
      
      const scrolled = window.scrollY
      const elements = parallaxRef.current.children
      
      Array.from(elements).forEach((element, index) => {
        const speed = 0.1 + (index * 0.05)
        const yOffset = scrolled * speed
        const htmlElement = element as HTMLElement
        htmlElement.style.transform = `translateY(${yOffset * 0.5}px)`
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  return (
    <div className="relative bg-gradient-to-b from-background via-background to-white pb-24 pt-32 overflow-hidden">
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
                opacity: 0.3
              }}
            />
          ))}
        </div>
      )}

      {/* Grands cercles avec parallaxe */}
      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-blue-200/10 blur-3xl" />
        <div className="absolute -left-20 top-40 h-[500px] w-[500px] rounded-full bg-purple-200/10 blur-3xl" />
        <div className="absolute left-1/3 top-60 h-[400px] w-[400px] rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-[350px] w-[350px] rounded-full bg-red-200/10 blur-3xl" />
      </div>

      {/* Effet de particules */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-20">
        {/* Hero header avec animation */}
        <div className="mx-auto max-w-3xl text-center animate-on-scroll">
          <Badge 
            variant="outline" 
            className="mb-6 px-4 py-1.5 text-xs bg-white/80 backdrop-blur-sm border-primary/20 text-primary animate-pulse-slow"
          >
            <Sparkles className="h-3 w-3 mr-2 text-primary" />
            À propos
          </Badge>
          
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {sltIdentity.officialName}
          </h1>
          
          <div className="mt-6 h-1 w-20 bg-gradient-to-r from-primary/50 to-primary mx-auto rounded-full" />
          
          <p className="mt-8 text-pretty text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            {sltIdentity.description}
          </p>
        </div>

        {/* Statistiques */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="animate-on-scroll group relative rounded-xl border border-border/50 bg-white/70 backdrop-blur-sm p-6 text-center shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Mission & Vision */}
        <div className="mt-24 grid gap-8 md:grid-cols-2">
          <div className="animate-on-scroll group relative rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
            {/* Bande de couleur */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-blue-400" />
            
            <div className="absolute top-3 left-3 flex gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-400 opacity-50" />
              <span className="h-2 w-2 rounded-full bg-blue-400 opacity-30" />
              <span className="h-2 w-2 rounded-full bg-blue-400 opacity-20" />
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Target className="h-7 w-7" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">
              Notre mission
            </h2>
            
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {sltIdentity.objective}
            </p>

            {/* Effet de brillance */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>

          <div className="animate-on-scroll group relative rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
            {/* Bande de couleur */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-purple-400" />
            
            <div className="absolute top-3 left-3 flex gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-400 opacity-50" />
              <span className="h-2 w-2 rounded-full bg-purple-400 opacity-30" />
              <span className="h-2 w-2 rounded-full bg-purple-400 opacity-20" />
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Eye className="h-7 w-7" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">
              Notre vision
            </h2>
            
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Accompagner durablement les organisations et les apprenants par des formations à forte valeur ajoutée, des séminaires et des dispositifs sur mesure, dans le respect des exigences institutionnelles et de la qualité.
            </p>

            {/* Effet de brillance */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <Badge 
              variant="outline" 
              className="mb-4 px-4 py-1.5 text-xs bg-white/80 backdrop-blur-sm border-primary/20 text-primary"
            >
              <Sparkles className="h-3 w-3 mr-2 text-primary" />
              Nos engagements
            </Badge>
            
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ce qui guide notre action
            </h2>
            
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-primary/50 to-primary mx-auto rounded-full" />
          </div>

          <div className="stagger-children mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const colors = colorMap[value.color as keyof typeof colorMap]
              const Icon = value.icon
              
              return (
                <div
                  key={value.title}
                  className="animate-on-scroll group relative rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm p-6 text-center shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Bande de couleur */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.gradient}`} />
                  
                  <div className="absolute top-3 left-3 flex gap-1">
                    <span className={`h-2 w-2 rounded-full ${colors.dot} opacity-50`} />
                    <span className={`h-2 w-2 rounded-full ${colors.dot} opacity-30`} />
                    <span className={`h-2 w-2 rounded-full ${colors.dot} opacity-20`} />
                  </div>

                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-xl ${colors.primary} mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className={`h-8 w-8 ${colors.icon} transition-transform duration-300 group-hover:rotate-6`} />
                  </div>
                  
                  <h3 className={`text-lg font-semibold text-foreground group-hover:${colors.text} transition-colors duration-300`}>
                    {value.title}
                  </h3>
                  
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>

                  {/* Effet de brillance */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section supplémentaire : Notre approche */}
        <div className="mt-24 text-center animate-on-scroll">
          <Badge 
            variant="outline" 
            className="mb-4 px-4 py-1.5 text-xs bg-white/80 backdrop-blur-sm border-primary/20 text-primary"
          >
            <Sparkles className="h-3 w-3 mr-2 text-primary" />
            Notre approche
          </Badge>
          
          <div className="relative rounded-3xl border border-border/50 bg-white/70 backdrop-blur-sm p-12 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary/50 to-primary" />
            
            <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              Nous combinons expertise pédagogique et innovation pour offrir des formations qui transforment les compétences et accélèrent les carrières.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {["Expertise", "Innovation", "Pédagogie", "Résultats"].map((item) => (
                <Badge key={item} variant="secondary" className="px-4 py-2 text-sm bg-white/50">
                  {item}
                </Badge>
              ))}
            </div>

            {/* Effet de brillance */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  )
}