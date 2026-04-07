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
  const [isMobile, setIsMobile] = useState(false)
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
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

  return (
    <>
      <Navbar />
      <main className="relative z-[2]">
        <LiquidCursorBlob />
        <HeroSection />

        <section
          ref={sectionRef}
          className="relative -mt-px overflow-hidden bg-cover bg-no-repeat py-16"
          style={{
            backgroundImage:
              isMobile ? "url('/image/background-tel1.png')" : "url('/image/background1.png')",
            backgroundPosition: isMobile ? "center top" : "center",
          }}
        >
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

                  return (
                    <div
                      key={formation.id}
                      ref={(el) => { cardsRef.current[index] = el }}
                      className="group relative flex flex-col rounded-2xl border border-border bg-white/80 backdrop-blur-sm shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 overflow-hidden opacity-0 translate-y-10 card-hover"
                      style={{
                        transitionDelay: `${index * 150}ms`
                      }}
                    >
                      {/* Badge de catégorie */}
                      <div className="absolute right-4 top-4 z-10">
                        <Badge variant="secondary" className="border-0 bg-muted/80 text-muted-foreground shadow-sm backdrop-blur-sm">
                          {formation.categories?.name || "Formation"}
                        </Badge>
                      </div>

                      {/* Contenu principal */}
                      <div className="p-6 pb-4">
                        <div className="card-icon mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-muted transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <Icon className="h-7 w-7 text-primary transition-transform duration-500 group-hover:rotate-6" />
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
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                <span className="text-muted-foreground line-clamp-1">{line}</span>
                              </li>
                            ))}
                          </ul>
                          {descriptionLines.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setSelectedFormation(formation)}
                              className="mt-2 text-xs font-medium text-primary hover:underline transition-all"
                            >
                              + {descriptionLines.length - 2} autres points...
                            </button>
                          )}
                        </div>
                      )}

                      {/* Informations supplémentaires avec espacement */}
                      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border bg-muted/30 p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{formation.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
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
      `}</style>
    </>
  )
}