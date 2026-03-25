"use client"

import { useEffect, useState } from "react"
import { 
  GraduationCap,
  Brain,
  Users,
  Code,
  PenTool,
  LineChart,
  Globe,
  Sparkles,
  Award,
  Target,
  Lightbulb,
  Heart,
  Shield
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltHomeContent } from "@/lib/slt-content"

// Couleurs modernes et douces
const cardColors = [
  {
    primary: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
    icon: "text-indigo-500",
    gradient: "from-indigo-500 to-indigo-400"
  },
  {
    primary: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    icon: "text-amber-500",
    gradient: "from-amber-500 to-amber-400"
  },
  {
    primary: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    icon: "text-emerald-500",
    gradient: "from-emerald-500 to-emerald-400"
  },
  {
    primary: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    icon: "text-rose-500",
    gradient: "from-rose-500 to-rose-400"
  },
  {
    primary: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    icon: "text-purple-500",
    gradient: "from-purple-500 to-purple-400"
  }
]

// Cercles de fond
const backgroundCircles = [
  { size: 120, top: 10, left: 5, color: 'bg-indigo-100/30', blur: 'blur-3xl' },
  { size: 150, top: 60, right: 10, color: 'bg-amber-100/30', blur: 'blur-3xl' },
  { size: 100, bottom: 20, left: 20, color: 'bg-emerald-100/30', blur: 'blur-3xl' },
]

const decorativeDots = [
  { top: 8, left: 12, opacity: 0.24 },
  { top: 16, left: 78, opacity: 0.2 },
  { top: 28, left: 36, opacity: 0.26 },
  { top: 44, left: 68, opacity: 0.18 },
  { top: 58, left: 22, opacity: 0.22 },
  { top: 74, left: 82, opacity: 0.2 },
  { top: 86, left: 42, opacity: 0.25 },
  { top: 35, left: 90, opacity: 0.16 },
]

export function TrainingOverview() {
  useScrollAnimation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const pro = sltHomeContent.trainings.items
  const transversal = sltHomeContent.transversal.items

  // Mapping des icônes pour les formations professionnelles
  const proIcons = [
    { icon: GraduationCap, color: "indigo" },
    { icon: Brain, color: "amber" },
    { icon: Users, color: "emerald" }
  ]

  // Mapping des icônes pour les formations transversales
  const transversalIcons = [
    { icon: Globe, color: "indigo" },
    { icon: PenTool, color: "amber" },
    { icon: Code, color: "emerald" },
    { icon: LineChart, color: "rose" },
    { icon: Target, color: "purple" },
    { icon: Lightbulb, color: "amber" },
    { icon: Heart, color: "rose" },
    { icon: Shield, color: "emerald" }
  ]

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 overflow-hidden">
      {/* Grands cercles de fond */}
      {backgroundCircles.map((circle, index) => (
        <div
          key={index}
          className={`absolute rounded-full ${circle.color} ${circle.blur} pointer-events-none`}
          style={{
            width: circle.size,
            height: circle.size,
            top: circle.top ? `${circle.top}%` : 'auto',
            bottom: circle.bottom ? `${circle.bottom}%` : 'auto',
            left: circle.left ? `${circle.left}%` : 'auto',
            right: circle.right ? `${circle.right}%` : 'auto',
          }}
        />
      ))}

      {/* Petits points décoratifs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {decorativeDots.map((dot, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/25"
            style={{
              top: `${dot.top}%`,
              left: `${dot.left}%`,
              opacity: dot.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
        {/* En-tête avec effet */}
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
        </div>

        {/* Section transversale */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {sltHomeContent.transversal.eyebrow}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {sltHomeContent.transversal.title}
            </h3>
          </div>

          {/* Grille des formations transversales */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {transversal.map((item, index) => {
              const Icon = transversalIcons[index % transversalIcons.length].icon
              const colors = cardColors[index % cardColors.length]
              
              return (
                <div
                  key={item}
                  className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-primary/[0.03] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className={`absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r ${colors.gradient} opacity-90`} />
                  <div className="flex items-start gap-4">
                    <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-lg ${colors.primary} ring-1 ring-black/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    
                    <div className="relative z-10 flex-1">
                      <p className="text-sm font-medium text-slate-900 mb-2">{item}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                      </div>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        </div>

        {/* Section avantages */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Objectif carrière",
              desc: "Des formations alignées avec les besoins du marché",
              color: "indigo"
            },
            {
              icon: Award,
              title: "Certification reconnue",
              desc: "Des diplômes et certificats valorisés par les employeurs",
              color: "amber"
            },
            {
              icon: Users,
              title: "Accompagnement personnalisé",
              desc: "Un suivi individuel tout au long de votre parcours",
              color: "emerald"
            }
          ].map((item, index) => {
            const colors = cardColors.find(c => c.text.includes(item.color)) || cardColors[0]
            
            return (
              <div key={item.title} className="group rounded-2xl border border-border/50 bg-white/75 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
                <div className={`inline-flex rounded-full p-3 ${colors.primary} mb-4 ring-1 ring-black/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <item.icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}