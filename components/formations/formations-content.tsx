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

// Couleurs disponibles pour les cartes
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
    dot: "bg-blue-400",
    hover: "hover:shadow-blue-200/50"
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
    dot: "bg-red-400",
    hover: "hover:shadow-red-200/50"
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
    dot: "bg-amber-400",
    hover: "hover:shadow-amber-200/50"
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
    dot: "bg-purple-400",
    hover: "hover:shadow-purple-200/50"
  },
  {
    primary: "bg-emerald-50",
    secondary: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-200",
    shadow: "shadow-emerald-100/50",
    gradient: "from-emerald-50 to-emerald-100/50",
    icon: "text-emerald-500",
    button: "bg-emerald-50 hover:bg-emerald-100 text-emerald-600",
    light: "bg-emerald-500/5",
    dot: "bg-emerald-400",
    hover: "hover:shadow-emerald-200/50"
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
    dot: "bg-amber-600",
    hover: "hover:shadow-amber-800/20"
  }
]

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

// Cercles statiques pour le background
const staticCircles = [
  { size: 42, top: 15, left: 10, color: 'bg-blue-400/25', delay: 0, duration: 14 },
  { size: 18, top: 8, left: 85, color: 'bg-blue-600/10', delay: 2, duration: 10 },
  { size: 31, top: 22, left: 30, color: 'bg-blue-500/30', delay: 1, duration: 8 },
  { size: 33, top: 45, left: 75, color: 'bg-blue-400/30', delay: 3, duration: 12 },
  { size: 50, top: 12, left: 55, color: 'bg-blue-300/20', delay: 4, duration: 16 },
  { size: 24, top: 35, left: 20, color: 'bg-blue-400/25', delay: 0.5, duration: 11 },
  { size: 41, top: 68, left: 40, color: 'bg-blue-300/40', delay: 2.5, duration: 13 },
  { size: 54, top: 82, left: 15, color: 'bg-blue-500/20', delay: 1.5, duration: 15 },
  { size: 29, top: 72, left: 90, color: 'bg-blue-400/30', delay: 3.5, duration: 9 },
  { size: 37, top: 28, left: 70, color: 'bg-blue-300/20', delay: 0.8, duration: 14 },
  { size: 46, top: 92, left: 25, color: 'bg-blue-400/30', delay: 2.2, duration: 12 },
  { size: 22, top: 50, left: 45, color: 'bg-blue-500/30', delay: 4.1, duration: 10 },
  { size: 39, top: 63, left: 60, color: 'bg-blue-600/15', delay: 1.2, duration: 13 },
  { size: 51, top: 78, left: 80, color: 'bg-blue-400/25', delay: 3.8, duration: 11 },
  { size: 27, top: 40, left: 95, color: 'bg-blue-300/20', delay: 0.3, duration: 9 },
  { size: 35, top: 88, left: 35, color: 'bg-blue-500/20', delay: 2.7, duration: 14 },
  { size: 43, top: 18, left: 48, color: 'bg-blue-400/30', delay: 1.8, duration: 12 },
  { size: 20, top: 95, left: 68, color: 'bg-blue-300/40', delay: 4.5, duration: 8 },
  { size: 48, top: 58, left: 12, color: 'bg-blue-400/25', delay: 0.9, duration: 15 },
  { size: 32, top: 25, left: 82, color: 'bg-blue-600/10', delay: 3.2, duration: 11 }
]

// Composant principal
export function FormationsContent() {
  const [formations, setFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<string>("Toutes")
  const [categories, setCategories] = useState<string[]>(["Toutes"])
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null)
  const [mounted, setMounted] = useState(false)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

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
  }, [loading, mounted, active]) // Ajout de active comme dépendance

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

  const getRandomColor = (index: number) => {
    return cardColors[index % cardColors.length]
  }

  if (loading) {
    return (
      <section className="relative bg-gradient-to-b from-background to-secondary/20 py-24 overflow-hidden min-h-[60vh]">
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
                  opacity: 0.4
                }}
              />
            ))}
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
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
      <section className="relative bg-gradient-to-b from-background to-secondary/20 py-24 overflow-hidden">
        {/* Dégradé de transition */}
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
                  opacity: 0.4
                }}
              />
            ))}
          </div>
        )}

        {/* Grands cercles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-blue-200/10 blur-3xl" />
          <div className="absolute -left-20 top-40 h-[500px] w-[500px] rounded-full bg-purple-200/10 blur-3xl" />
          <div className="absolute right-1/3 -bottom-20 h-[400px] w-[400px] rounded-full bg-amber-200/10 blur-3xl" />
        </div>

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
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Nos formations
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
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
                <p className="text-muted-foreground">Aucune formation disponible dans cette catégorie.</p>
              </div>
            ) : (
              filtered.map((formation, index) => {
                const Icon = getIcon(formation.categories?.name || '')
                const descriptionLines = formatDescription(formation.description)
                const colors = getRandomColor(index)

                return (
                  <div
                    key={formation.id}
                    ref={(el) => { cardsRef.current[index] = el }}
                    className="group relative flex flex-col rounded-2xl border border-border bg-white/80 backdrop-blur-sm shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 overflow-hidden cursor-pointer opacity-0 translate-y-10"
                    style={{
                      boxShadow: `0 20px 40px -15px ${colors.shadow.replace('shadow-', '')}`,
                      transitionDelay: `${index * 100}ms`
                    }}
                    onClick={() => setSelectedFormation(formation)}
                  >
                    {/* Bande de couleur */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.gradient} animate-gradient-x`} />

                    {/* Points décoratifs */}
                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className={`h-2 w-2 rounded-full ${colors.dot} opacity-50`} />
                      <span className={`h-2 w-2 rounded-full ${colors.dot} opacity-30`} />
                      <span className={`h-2 w-2 rounded-full ${colors.dot} opacity-20`} />
                    </div>

                    {/* Badge catégorie */}
                    <div className="absolute right-4 top-4 z-10">
                      <Badge
                        variant="secondary"
                        className={`${colors.light} ${colors.text} border-0 backdrop-blur-sm shadow-sm`}
                      >
                        {formation.categories?.name || "Formation"}
                      </Badge>
                    </div>

                    {/* Icône et titre */}
                    <div className="p-6 pb-4">
                      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${colors.primary} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className={`h-7 w-7 ${colors.icon} transition-transform duration-500 group-hover:rotate-6`} />
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
                              <CheckCircle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${colors.icon}`} />
                              <span className="text-muted-foreground line-clamp-1">{line}</span>
                            </li>
                          ))}
                        </ul>
                        {descriptionLines.length > 2 && (
                          <p className={`mt-2 text-xs font-medium ${colors.text}`}>
                            + {descriptionLines.length - 2} autres points...
                          </p>
                        )}
                      </div>
                    )}

                    {/* Métriques */}
                    <div className={`mt-6 grid grid-cols-2 gap-3 border-t border-border ${colors.primary} p-4`}>
                      <div className="flex items-center gap-2">
                        <Clock className={`h-4 w-4 ${colors.icon}`} />
                        <span className="text-sm font-medium text-foreground">{formation.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className={`h-4 w-4 ${colors.icon}`} />
                        <span className="text-sm font-medium text-foreground">
                          <span className="text-sm font-medium text-foreground">Inscriptions ouvertes</span>
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
        @keyframes float-circle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -15px) rotate(5deg); }
          50% { transform: translate(0, -25px) rotate(0deg); }
          75% { transform: translate(-15px, -10px) rotate(-5deg); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
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
      `}</style>
    </>
  )
}