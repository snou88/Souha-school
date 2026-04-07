"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import {
  Code,
  BarChart3,
  Palette,
  Megaphone,
  ShieldCheck,
  Clock,
  ArrowRight,
  Users,
  CheckCircle,
  Award,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface Category {
  id: string
  name: string
}

interface Formation {
  id: string
  name: string
  description: string | null
  duration: string
  status: string
  category_id: string
  categories: Category | null
  student_count?: number
}

// Mapping des icônes
const getIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('dev') || name.includes('développement')) return Code
  if (name.includes('data') || name.includes('données')) return BarChart3
  if (name.includes('design')) return Palette
  if (name.includes('market')) return Megaphone
  if (name.includes('security') || name.includes('sécurité')) return ShieldCheck
  return Code
}

// Formatage de la description
const formatDescription = (description: string | null) => {
  if (!description) return []
  return description.split('\n').filter(line => line.trim() !== '')
}

// Composant principal
export function FormationsContent() {
  const [formations, setFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<string>("Toutes")
  const [categories, setCategories] = useState<string[]>(["Toutes"])
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLElement | null>(null)

  // Détecter si c'est mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchFormations()
  }, [])

  // Effet de scroll
  useEffect(() => {
    if (loading || !mounted) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('card-visible')
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      cardsRef.current.forEach((card) => {
        if (card) observer.observe(card)
      })
    }, 100)

    return () => observer.disconnect()
  }, [loading, mounted, active])

  const fetchFormations = async () => {
    try {
      const res = await fetch('/api/formations')
      const data = await res.json()

      if (data.success && Array.isArray(data.data)) {
        const studentsRes = await fetch('/api/students')
        const studentsData = await studentsRes.json()

        let formationsWithCount = data.data

        if (studentsData.success) {
          const studentCounts: Record<string, number> = {}
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

          formationsWithCount = data.data.map((f: Formation) => ({
            ...f,
            student_count: studentCounts[f.id] || 0
          }))
        }

        const activeFormations = formationsWithCount.filter((f: Formation) => f.status === "Active")
        setFormations(activeFormations)

        // Extraire les catégories uniques
        const uniqueCategories = activeFormations
          .map((f: Formation) => f.categories?.name?.trim())
          .filter((name: string | undefined): name is string => Boolean(name))
          .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index)

        setCategories(["Toutes", ...uniqueCategories])
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrage avec useMemo pour optimiser
  const filtered = useMemo(() => {
    if (!formations.length) return []

    if (active === "Toutes") {
      return formations
    }

    return formations.filter((f) => {
      const categoryName = f.categories?.name?.trim() || ""
      return categoryName === active
    })
  }, [formations, active])

  if (loading) {
    return (
      <section 
        ref={sectionRef}
        className="relative -mt-px overflow-hidden bg-cover bg-no-repeat py-24 min-h-[60vh]"
        style={{
          backgroundImage: isMobile ? "url('/image/background-tel1.png')" : "url('/image/background1.png')",
          backgroundPosition: isMobile ? "center top" : "center",
        }}
      >
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-4 text-sm text-muted-foreground">Chargement des formations...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="relative -mt-px overflow-hidden bg-cover bg-no-repeat py-24"
        style={{
          backgroundImage: isMobile ? "url('/image/background-tel1.png')" : "url('/image/background1.png')",
          backgroundPosition: isMobile ? "center top" : "center",
        }}
      >
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 pointer-events-none" />
        
        {/* Dégradé de transition */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white pointer-events-none z-10" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-20">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center animate-fade-in">
            <Badge
              variant="outline"
              className="mb-4 px-4 py-1.5 text-xs bg-white/80 backdrop-blur-sm border-primary/20 text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse mr-2" />
              Catalogue 2026
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
              Nos formations
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-black-90 max-w-2xl mx-auto">
              Des programmes conçus pour votre réussite professionnelle
            </p>
          </div>

          {/* Filtres */}
          {categories.length > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 animate-fade-in [animation-delay:200ms]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActive(cat)
                    // Reset des refs pour les nouvelles cartes
                    cardsRef.current = []
                  }}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                    active === cat
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-white/70 backdrop-blur-sm text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grille */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-white">Aucune formation disponible dans cette catégorie.</p>
              </div>
            ) : (
              filtered.map((formation, index) => {
                const Icon = getIcon(formation.categories?.name || '')
                const descriptionLines = formatDescription(formation.description)

                return (
                  <div
                    key={formation.id}
                    ref={(el) => { cardsRef.current[index] = el }}
                    className="group relative flex flex-col rounded-2xl border border-border bg-white/80 backdrop-blur-sm shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 overflow-hidden cursor-pointer opacity-0 translate-y-10"
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                    onClick={() => setSelectedFormation(formation)}
                  >
                    {/* Badge catégorie */}
                    <div className="absolute right-4 top-4 z-10">
                      <Badge variant="secondary" className="border-0 bg-muted/80 text-muted-foreground shadow-sm backdrop-blur-sm">
                        {formation.categories?.name || "Formation"}
                      </Badge>
                    </div>

                    {/* Icône et titre */}
                    <div className="p-6 pb-4">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-muted transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="h-7 w-7 text-primary transition-transform duration-500 group-hover:rotate-6" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {formation.name}
                      </h3>
                    </div>

                    {/* Description */}
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
                          <p className="mt-2 text-xs font-medium text-primary">
                            + {descriptionLines.length - 2} autres points...
                          </p>
                        )}
                      </div>
                    )}

                    {/* Métriques */}
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{formation.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Inscriptions ouvertes
                        </span>
                      </div>
                    </div>

                    {/* Bouton */}
                    <div className="p-4 pt-2">
                      <div className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98] gap-2">
                        <span>Voir les détails</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Effet de brillance */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </>
  )
}