"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { CtaBanner } from "@/components/home/cta-banner"
import PartnersSection from "@/components/home/partners"
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
        if (student.formation_id) {
          studentCounts[student.formation_id] = (studentCounts[student.formation_id] || 0) + 1
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

  useEffect(() => {
    const load = async () => {
      const formations = await getRecentFormations()
      setLatestThreeFormations(formations)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Nouveautés
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Nos dernières formations
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Découvrez les nouvelles formations que nous venons d'ajouter à notre catalogue. Des programmes actualisés pour répondre aux besoins du marché.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground">Chargement des formations...</p>
                </div>
              ) : latestThreeFormations.length > 0 ? (
                latestThreeFormations.map((formation: Formation) => {
                  const Icon = getIcon(formation.categories?.name || "")
                  const descriptionLines = formatDescription(formation.description)

                  return (
                    <div
                      key={formation.id}
                      className="group relative flex flex-col rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="absolute right-4 top-4 z-10">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                          {formation.categories?.name || "Formation"}
                        </Badge>
                      </div>

                      <div className="p-6 pb-4">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{formation.name}</h3>
                      </div>

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
                            <button
                              type="button"
                              onClick={() => setSelectedFormation(formation)}
                              className="mt-2 text-xs font-medium text-primary hover:underline"
                            >
                              + {descriptionLines.length - 2} autres points...
                            </button>
                          )}
                        </div>
                      )}

                      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border bg-secondary/20 p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{formation.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">Inscriptions ouvertes</span>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          type="button"
                          onClick={() => setSelectedFormation(formation)}
                          className="flex w-full items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
                        >
                          <span>Voir les détails</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
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

      <Footer />
    </>
  )
}