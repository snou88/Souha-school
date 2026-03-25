"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { CtaBanner } from "@/components/home/cta-banner"
import PartnersSection from "@/components/home/partners"
import { LiquidCursorBlob } from "@/components/home/liquid-cursor-blob"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  Code,
  Megaphone,
  Palette,
  ShieldCheck,
  Users,
} from "lucide-react"

// Interface pour les formations
interface Formation {
  id: string
  name: string
  description: string | null
  duration: string
  status: string
  created_at: string
  category_id: string
  categories: {
    id: string
    name: string
  } | null
  student_count?: number
}

// Couleurs disponibles pour les cartes (version claire)
const cardColors = [
  {
    primary: "bg-blue-50",
    secondary: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
    shadow: "shadow-blue-100/50",
    gradient: "from-blue-50 to-blue-100/50",
    icon: "text-blue-500",
    button: "bg-blue-50 hover:bg-blue-100 text-blue-600",
    light: "bg-blue-500/5",
    dot: "bg-blue-400"
  },
  {
    primary: "bg-red-50",
    secondary: "bg-red-100",
    text: "text-red-600",
    border: "border-red-200",
    shadow: "shadow-red-100/50",
    gradient: "from-red-50 to-red-100/50",
    icon: "text-red-500",
    button: "bg-red-50 hover:bg-red-100 text-red-600",
    light: "bg-red-500/5",
    dot: "bg-red-400"
  },
  {
    primary: "bg-amber-50",
    secondary: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
    shadow: "shadow-amber-100/50",
    gradient: "from-amber-50 to-amber-100/50",
    icon: "text-amber-500",
    button: "bg-amber-50 hover:bg-amber-100 text-amber-600",
    light: "bg-amber-500/5",
    dot: "bg-amber-400"
  },
  {
    primary: "bg-purple-50",
    secondary: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
    shadow: "shadow-purple-100/50",
    gradient: "from-purple-50 to-purple-100/50",
    icon: "text-purple-500",
    button: "bg-purple-50 hover:bg-purple-100 text-purple-600",
    light: "bg-purple-500/5",
    dot: "bg-purple-400"
  },
  {
    primary: "bg-amber-800/10",
    secondary: "bg-amber-800/20",
    text: "text-amber-800",
    border: "border-amber-800/20",
    shadow: "shadow-amber-800/10",
    gradient: "from-amber-800/5 to-amber-800/10",
    icon: "text-amber-700",
    button: "bg-amber-800/10 hover:bg-amber-800/20 text-amber-800",
    light: "bg-amber-800/5",
    dot: "bg-amber-600"
  }
]

const getIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes("dev") || name.includes("développement")) return Code
  if (name.includes("data") || name.includes("données")) return BarChart3
  if (name.includes("design")) return Palette
  if (name.includes("market")) return Megaphone
  if (name.includes("security") || name.includes("sécurité")) return ShieldCheck
  return Code
}

const formatDescription = (description: string | null) => {
  if (!description) return []
  return description.split("\n").filter((line) => line.trim() !== "")
}

async function getRecentFormations() {
  try {
    const formationsRes = await fetch("/api/formations", { cache: "no-store" })
    const formationsData = await formationsRes.json()

    if (!formationsData.success) return []

    const studentsRes = await fetch("/api/students", { cache: "no-store" })
    const studentsData = await studentsRes.json()

    const studentCounts: Record<string, number> = {}
    if (studentsData.success) {
      studentsData.data.forEach((student: any) => {
        const fid = student.formationId ?? student.formation_id
        if (fid) {
          const participantCount =
            typeof student.number === "number" && Number.isFinite(student.number) && student.number > 0
              ? student.number
              : 1
          studentCounts[fid] = (studentCounts[fid] || 0) + participantCount
        }
      })
    }

    const formationsWithCount = formationsData.data
      .filter((f: Formation) => f.status === "Active")
      .map((f: Formation) => ({
        ...f,
        student_count: studentCounts[f.id] || 0,
      }))

    const recentFormations = formationsWithCount
      .sort(
        (a: Formation, b: Formation) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 3)

    return recentFormations
  } catch (error) {
    console.error("Erreur lors du chargement des formations:", error)
    return []
  }
}

export default function HomePage() {
  const [latestThreeFormations, setLatestThreeFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const load = async () => {
      const formations = await getRecentFormations()
      setLatestThreeFormations(formations)
      setLoading(false)
    }
    load()
  }, [])

  // Effet de scroll professionnel avec Intersection Observer
  useEffect(() => {
    if (loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animation d'entrée
            entry.target.classList.add('card-visible')

            // Effet de parallaxe sur l'icône
            const icon = entry.target.querySelector('.card-icon')
            if (icon) {
              icon.classList.add('icon-animate')
            }
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [loading])

  // Effet de parallaxe avancé
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const section = sectionRef.current

      if (section) {
        const rect = section.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0

        if (isVisible) {
          // Effet de parallaxe sur les cartes
          cardsRef.current.forEach((card, index) => {
            if (card) {
              const cardRect = card.getBoundingClientRect()
              const cardCenter = cardRect.top + cardRect.height / 2
              const windowCenter = window.innerHeight / 2
              const distance = cardCenter - windowCenter
              const translateY = distance * 0.1
              const rotateX = distance * 0.02
              const rotateY = (index - 1) * 2

              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${translateY}px)`
              card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading])

  // Effet de particules pour le background
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.className = 'absolute inset-0 pointer-events-none'
    canvas.style.opacity = '0.4'
    const section = sectionRef.current
    if (section) {
      section.style.position = 'relative'
      section.insertBefore(canvas, section.firstChild)
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
    }> = []

    const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#b45309']

    const initParticles = () => {
      if (!section) return
      const rect = section.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }

    const animateParticles = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 10
      })

      requestAnimationFrame(animateParticles)
    }

    initParticles()
    animateParticles()

    const handleResize = () => {
      if (!section) return
      const rect = section.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      particles = []
      initParticles()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.remove()
    }
  }, [])

  // Assigner une couleur aléatoire à chaque carte
  const getRandomColor = (index: number) => {
    return cardColors[index % cardColors.length]
  }

  return (
    <>
      <Navbar />
      <main className="relative z-[2]">
        <LiquidCursorBlob />
        <HeroSection />

        <section
          ref={sectionRef}
          className="relative bg-gradient-to-b from-background to-secondary/20 py-16 overflow-hidden"
        >
          {/* Effet de fond avec cercles animés */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse-slower" />
            <div className="absolute top-40 right-40 w-60 h-60 bg-amber-200/20 rounded-full blur-3xl animate-float" />

            {/* Grille de fond */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Nouveautés
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Nos dernières formations
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Découvrez les nouvelles formations que nous venons d'ajouter à notre catalogue. Des programmes actualisés pour répondre aux besoins du marché.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="mt-2 text-muted-foreground">Chargement des formations...</p>
                </div>
              ) : latestThreeFormations.length > 0 ? (
                latestThreeFormations.map((formation: Formation, index) => {
                  const Icon = getIcon(formation.categories?.name || "")
                  const descriptionLines = formatDescription(formation.description)
                  const colors = getRandomColor(index)

                  return (
                    <div
                      key={formation.id}
                      ref={(el) => { cardsRef.current[index] = el }}
                      className="group relative flex flex-col rounded-2xl border border-border bg-white/80 backdrop-blur-sm shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 overflow-hidden opacity-0 translate-y-10 card-hover"
                      style={{
                        boxShadow: `0 20px 40px -15px ${colors.shadow.replace('shadow-', '')}`,
                        transitionDelay: `${index * 150}ms`
                      }}
                    >
                      {/* Bande de couleur en haut avec animation */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.gradient} animate-gradient-x`} />

                      {/* Points de couleur décoratifs */}
                      <div className="absolute top-3 left-3 flex gap-1">
                        <span className={`h-2 w-2 rounded-full ${colors.dot} opacity-50`} />
                        <span className={`h-2 w-2 rounded-full ${colors.dot} opacity-30`} />
                        <span className={`h-2 w-2 rounded-full ${colors.dot} opacity-20`} />
                      </div>

                      {/* Badge de catégorie */}
                      <div className="absolute right-4 top-4 z-10">
                        <Badge
                          variant="secondary"
                          className={`${colors.light} ${colors.text} border-0 backdrop-blur-sm shadow-sm`}
                        >
                          {formation.categories?.name || "Formation"}
                        </Badge>
                      </div>

                      {/* Contenu principal */}
                      <div className="p-6 pb-4">
                        <div className={`card-icon mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${colors.primary} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                          <Icon className={`h-7 w-7 ${colors.icon} transition-transform duration-500 group-hover:rotate-6`} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {formation.name}
                        </h3>
                      </div>

                      {/* Points clés */}
                      {descriptionLines.length > 0 && (
                        <div className="px-6 flex-1">
                          <ul className="space-y-2">
                            {descriptionLines.slice(0, 2).map((line, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${colors.icon}`} />
                                <span className="text-muted-foreground line-clamp-1">{line}</span>
                              </li>
                            ))}
                          </ul>
                          {descriptionLines.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setSelectedFormation(formation)}
                              className={`mt-2 text-xs font-medium ${colors.text} hover:underline transition-all`}
                            >
                              + {descriptionLines.length - 2} autres points...
                            </button>
                          )}
                        </div>
                      )}

                      {/* Informations supplémentaires avec espacement */}
                      <div className={`mt-6 grid grid-cols-2 gap-4 border-t border-border ${colors.primary} p-4`}>
                        <div className="flex items-center gap-2">
                          <Clock className={`h-4 w-4 ${colors.icon}`} />
                          <span className="text-sm font-medium text-foreground">{formation.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className={`h-4 w-4 ${colors.icon}`} />
                          <span className="text-sm font-medium text-foreground">Inscriptions ouvertes</span>
                        </div>
                      </div>

                      {/* Bouton Voir les détails - Style mis à jour */}
                      <div className="p-4 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedFormation(formation)}
                          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98] gap-2"
                        >
                          <span>Voir les détails</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>

                      {/* Effet de brillance amélioré */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Aucune formation disponible pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <WhyChooseUs />
        <CtaBanner />
        <PartnersSection />
      </main>

      {/* Modal de détail */}
      <Dialog open={!!selectedFormation} onOpenChange={() => setSelectedFormation(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-8">
          {selectedFormation && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold">{selectedFormation.name}</DialogTitle>
                    <DialogDescription className="mt-2">
                      {selectedFormation.categories?.name || "Formation professionnelle"}
                    </DialogDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {selectedFormation.status === "Active" ? "Disponible" : "Bientôt disponible"}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Durée</p>
                    <p className="text-sm font-semibold">{selectedFormation.duration}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Award className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Certification</p>
                    <p className="text-sm font-semibold">Incluse</p>
                  </div>
                </div>

                {selectedFormation.description && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Programme détaillé
                    </h4>
                    <ul className="space-y-3">
                      {formatDescription(selectedFormation.description).map((line, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-muted-foreground flex-1">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-lg border border-border bg-secondary/20 p-4">
                  <h4 className="font-semibold text-foreground mb-3">Informations pratiques</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium">Présentiel / Distanciel</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prérequis</span>
                      <span className="font-medium">Niveau débutant accepté</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tarif</span>
                      <span className="font-medium">Nous consulter</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/inscription?formation=${selectedFormation.id}`}
                  className="block w-full rounded-xl bg-primary px-6 py-4 text-center text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                >
                  S'inscrire à cette formation
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="relative z-[2]">
        <Footer />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2%, -2%) rotate(2deg); }
          50% { transform: translate(0, -4%) rotate(0deg); }
          75% { transform: translate(-2%, -1%) rotate(-2deg); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slow 12s ease-in-out infinite;
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .icon-animate {
          animation: iconPop 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes iconPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </>
  )
}