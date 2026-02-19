"use client"

import { useState, useEffect } from "react"
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
  X,
  Calendar,
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

// Formatage de la description en liste
const formatDescription = (description: string | null) => {
  if (!description) return []
  return description.split('\n').filter(line => line.trim() !== '')
}

export function FormationsContent() {
  const [formations, setFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<string>("Toutes")
  const [categories, setCategories] = useState<string[]>(["Toutes"])
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null)

  useEffect(() => {
    fetchFormations()
  }, [])

  const fetchFormations = async () => {
    try {
      const res = await fetch('/api/formations')
      const data = await res.json()
      
      if (data.success && Array.isArray(data.data)) {
        // Récupérer les étudiants pour les compteurs
        const studentsRes = await fetch('/api/students')
        const studentsData = await studentsRes.json()
        
        let formationsWithCount = data.data
        
        if (studentsData.success) {
          const studentCounts: Record<string, number> = {}
          studentsData.data.forEach((student: any) => {
            if (student.formation_id) {
              studentCounts[student.formation_id] = (studentCounts[student.formation_id] || 0) + 1
            }
          })
          
          formationsWithCount = data.data.map((f: Formation) => ({
            ...f,
            student_count: studentCounts[f.id] || 0
          }))
        }
        
        // Filtrer les formations actives
        const activeFormations = formationsWithCount.filter((f: Formation) => f.status === "Active")
        setFormations(activeFormations)
        
        // Extraire les catégories
        const uniqueCategories = activeFormations
          .map((f: Formation) => f.categories?.name)
          .filter((name, index, self) => name && self.indexOf(name) === index)
        
        setCategories(["Toutes", ...uniqueCategories])
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = active === "Toutes" 
    ? formations 
    : formations.filter((f) => f.categories?.name === active)

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-background to-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
      <section className="bg-gradient-to-b from-background to-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-xs">
              Catalogue 2026
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Nos formations
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Des programmes conçus pour votre réussite professionnelle
            </p>
          </div>

          {/* Filtres */}
          {categories.length > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition-all",
                    active === cat
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                <p className="text-muted-foreground">Aucune formation disponible pour le moment.</p>
              </div>
            ) : (
              filtered.map((formation) => {
                const Icon = getIcon(formation.categories?.name || '')
                const descriptionLines = formatDescription(formation.description)
                
                return (
                  <div
                    key={formation.id}
                    className="group relative flex flex-col rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedFormation(formation)}
                  >
                    {/* Badge catégorie */}
                    <div className="absolute right-4 top-4 z-10">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                        {formation.categories?.name || "Formation"}
                      </Badge>
                    </div>

                    {/* Icône et titre */}
                    <div className="p-6 pb-4">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-7 w-7" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground">{formation.name}</h3>
                    </div>

                    {/* Aperçu de la description (3 premières lignes) */}
                    {descriptionLines.length > 0 && (
                      <div className="px-6">
                        <ul className="space-y-2">
                          {descriptionLines.slice(0, 2).map((line, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary/60" />
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
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border bg-secondary/20 p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{formation.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Inscriptions ouvertes
                        </span>
                      </div>
                    </div>

                    {/* Bouton CTA */}
                    <div className="p-4 pt-0">
                      <div className="flex w-full items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
                        <span>Voir les détails</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Modal de détails */}
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
                {/* Métriques détaillées */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Durée</p>
                    <p className="text-sm font-semibold">{selectedFormation.duration}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Participants</p>
                    <p className="text-sm font-semibold">{selectedFormation.student_count || 0} inscrits</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Award className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Certification</p>
                    <p className="text-sm font-semibold">Incluse</p>
                  </div>
                </div>

                {/* Description complète en liste */}
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

                {/* Informations supplémentaires */}
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

                {/* Bouton d'inscription */}
                <Link
                  href="/inscription"
                  className="block w-full rounded-xl bg-primary px-6 py-4 text-center text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                >
                  S'inscrire à cette formation
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}