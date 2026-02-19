"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  BookOpen,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { sltUiLabels } from "@/lib/slt-content"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Student {
  id: number
  type: "Individual" | "Company"
  name: string
  email: string
  phone: string
  formation: string
  status: "Active" | "Inactive" | "Pending" | "Graduated"
  enrolled: string
  number: number
}

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Graduated: "bg-primary/10 text-primary border-primary/20",
}

const ITEMS_PER_PAGE = 8

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Student["status"]>("all")
  const [typeFilter, setTypeFilter] = useState<"all" | Student["type"]>("all")
  const [page, setPage] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null)

  async function fetchStudents() {
    try {
      setLoading(true)
      const res = await fetch("/api/students")
      const data = await res.json()
      
      console.log("📦 Données students reçues:", data)
      
      if (data.success && Array.isArray(data.data)) {
        setStudents(data.data)
        console.log("✅ Students chargés:", data.data.length)
      } else {
        console.error("❌ Format invalide:", data)
        setStudents([])
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.formation.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "all" || s.status === statusFilter
      const matchType = typeFilter === "all" || s.type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [search, statusFilter, typeFilter, students])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE || 1)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  async function handleDelete(id: number) {
    try {
      const res = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      const data = await res.json()
      
      if (data.success) {
        setStudents(prev => prev.filter(s => s.id !== id))
        setDeleteStudent(null)
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Apprenants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérer les apprenants et entreprises ({students.length} au total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou formation…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:max-w-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setPage(1) }}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Active">Actif</SelectItem>
              <SelectItem value="Pending">En attente</SelectItem>
              <SelectItem value="Inactive">Inactif</SelectItem>
              <SelectItem value="Graduated">Diplômé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as any); setPage(1) }}>
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Individual">Particulier</SelectItem>
              <SelectItem value="Company">Entreprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Apprenant</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Formation</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Inscription</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Places</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Statut</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                    <p className="mt-2">Chargement des apprenants…</p>
                  </td>
                </tr>
              )}

              {!loading && paginated.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/20">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {s.name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-semibold",
                              s.type === "Company"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-secondary text-muted-foreground border-border"
                            )}
                          >
                            {sltUiLabels.accountType[s.type] ?? s.type}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.formation}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.enrolled}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-foreground">{s.number}</span>
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge variant="outline" className={cn("gap-1 text-[11px] font-semibold", statusStyles[s.status])}>
                      {s.status === "Pending" && <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse"></span>}
                      {sltUiLabels.status[s.status] ?? s.status}
                    </Badge>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => setSelectedStudent(s)} 
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteStudent(s)} 
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    Aucun apprenant ne correspond à vos critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Affichage {(page - 1) * ITEMS_PER_PAGE + 1} à {Math.min(page * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                    p === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fiche apprenant</DialogTitle>
            <DialogDescription>Informations détaillées.</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                    {selectedStudent.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedStudent.name}</h3>
                  <Badge variant="outline" className={cn("mt-1 text-[11px] font-semibold", statusStyles[selectedStudent.status])}>
                    {sltUiLabels.status[selectedStudent.status] ?? selectedStudent.status}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-2.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{selectedStudent.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-2.5">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-medium text-foreground">{selectedStudent.phone || "Non renseigné"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-2.5">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">Formation</p>
                    <p className="text-sm font-medium text-foreground">{selectedStudent.formation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-2.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Inscription</p>
                      <p className="text-sm font-medium text-foreground">{selectedStudent.enrolled}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-2.5">
                    <div className="flex h-4 w-4 items-center justify-center text-xs font-bold text-muted-foreground">
                      {selectedStudent.type === "Company" ? "👥" : "👤"}
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">{selectedStudent.type === "Company" ? "Participants" : "Places"}</p>
                      <p className="text-sm font-semibold text-foreground">{selectedStudent.number}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
                  Modifier
                </button>
                <button 
                  onClick={() => setSelectedStudent(null)} 
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteStudent} onOpenChange={() => setDeleteStudent(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer l’apprenant</DialogTitle>
            <DialogDescription>
              Confirmez-vous la suppression de <span className="font-semibold text-foreground">{deleteStudent?.name}</span> ?
              Cette action est irréversible et supprimera également les inscriptions associées.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => setDeleteStudent(null)} 
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Annuler
            </button>
            <button 
              onClick={() => deleteStudent && handleDelete(deleteStudent.id)} 
              className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-all hover:brightness-110"
            >
              Supprimer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}