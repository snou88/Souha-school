"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Search,
  Check,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { sltUiLabels } from "@/lib/slt-content"

interface Inscription {
  id: number
  type: "Individual" | "Company"
  name: string
  email: string
  formation: string
  date: string
  number: number
  status: "Pending" | "Approved" | "Rejected"
}

const statusStyles: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusIcons: Record<string, any> = {
  Approved: CheckCircle2,
  Pending: Clock,
  Rejected: XCircle,
}

const ITEMS_PER_PAGE = 8

function InscriptionsAdminContent() {
  const searchParams = useSearchParams()
  const statusFromUrl = searchParams.get("status")
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "Pending" | "Approved" | "Rejected">(
    statusFromUrl === "Pending" || statusFromUrl === "Approved" || statusFromUrl === "Rejected" ? statusFromUrl : "all"
  )
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)
  const { toast } = useToast()

  // Synchroniser le filtre avec l'URL quand elle change (ex: clic sur la cloche notifications)
  useEffect(() => {
    const s = searchParams.get("status")
    if (s === "Pending" || s === "Approved" || s === "Rejected") setStatusFilter(s)
  }, [searchParams])

  // Charger les inscriptions
  useEffect(() => {
    fetchInscriptions()
  }, [])

  async function fetchInscriptions() {
    try {
      setLoading(true)
      const res = await fetch("/api/inscriptions")
      const data = await res.json()
      console.log("📦 Données reçues:", data)
      
      if (data.success && Array.isArray(data.data)) {
        setInscriptions(data.data)
        console.log("✅ Inscriptions chargées:", data.data.length)
      } else {
        console.error("❌ Format de données invalide:", data)
        setInscriptions([])
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id: number) {
    try {
      console.log("🟢 Approbation de l'inscription:", id)
      const res = await fetch("/api/inscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Approved" })
      })
      const result = await res.json()
      console.log("Réponse approve:", result)
      
      if (result.success) {
        setInscriptions((prev) => 
          prev.map(i => i.id === id ? { ...i, status: "Approved" } : i)
        )
        toast({
          title: "Inscription approuvée",
          description: "L'apprenant figure dans la liste des apprenants et est compté dans la formation.",
          action: (
            <Link
              href="/admin/students"
              className="inline-flex rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Voir les apprenants
            </Link>
          ),
        })
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible d'approuver l'inscription",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'approbation:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation",
        variant: "destructive",
      })
    }
  }

  async function handleReject(id: number) {
    try {
      console.log("🔴 Rejet de l'inscription:", id)
      const res = await fetch("/api/inscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Rejected" })
      })
      const result = await res.json()
      console.log("Réponse reject:", result)
      
      if (result.success) {
        setInscriptions((prev) => 
          prev.map(i => i.id === id ? { ...i, status: "Rejected" } : i)
        )
      }
    } catch (error) {
      console.error("❌ Erreur lors du rejet:", error)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?")) {
      return
    }
    
    try {
      console.log("🗑️ Suppression de l'inscription:", id)
      const res = await fetch("/api/inscriptions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      const result = await res.json()
      console.log("Réponse delete:", result)
      
      if (result.success) {
        setInscriptions((prev) => prev.filter(i => i.id !== id))
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error)
    }
  }

  const filtered = useMemo(() => {
    return inscriptions.filter((i) => {
      const matchSearch =
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.formation.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "all" || i.status === statusFilter
      const matchType = typeFilter === "all" || i.type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [search, statusFilter, typeFilter, inscriptions])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const counts = {
    total: inscriptions.length,
    pending: inscriptions.filter((i) => i.status === "Pending").length,
    approved: inscriptions.filter((i) => i.status === "Approved").length,
    rejected: inscriptions.filter((i) => i.status === "Rejected").length,
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Chargement des inscriptions…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Examiner et gérer les demandes d’inscription
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.total, color: "bg-primary/10 text-primary" },
          { label: "En attente", value: counts.pending, color: "bg-warning/10 text-warning" },
          { label: "Approuvées", value: counts.approved, color: "bg-success/10 text-success" },
          { label: "Rejetées", value: counts.rejected, color: "bg-destructive/10 text-destructive" },
        ].map((c) => (
          <div key={c.label} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold", c.color)}>
              {c.value}
            </div>
            <span className="text-sm font-medium text-muted-foreground">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom ou formation…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="Pending">En attente</SelectItem>
            <SelectItem value="Approved">Approuvées</SelectItem>
            <SelectItem value="Rejected">Rejetées</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Compte</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Formation</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Nombre</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Statut</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    Aucune inscription trouvée
                  </td>
                </tr>
              ) : (
                paginated.map((row) => {
                  const StatusIcon = statusIcons[row.status]
                  return (
                    <tr key={row.id} className="border-b border-border hover:bg-secondary/20">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {row.name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{row.name}</p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-semibold",
                                  row.type === "Company"
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-secondary text-muted-foreground border-border"
                                )}
                              >
                                {sltUiLabels.accountType[row.type] ?? row.type}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">{row.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{row.formation}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{row.date}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold">{row.number}</td>

                      <td className="px-5 py-3.5">
                        <Badge variant="outline" className={cn("gap-1 text-[11px] font-semibold", statusStyles[row.status])}>
                          <StatusIcon className="h-3 w-3" />
                          {sltUiLabels.status[row.status] ?? row.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {row.status === "Pending" && (
                            <>
                              <button 
                                onClick={() => handleApprove(row.id)} 
                                className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-success hover:bg-success/10"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Approuver
                              </button>
                              <button 
                                onClick={() => handleReject(row.id)} 
                                className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                              >
                                <X className="h-3.5 w-3.5" />
                                Rejeter
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleDelete(row.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 4V3c0-1 1-2 2-2h4c1 0 2 1 2 2v1"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Affichage {((page - 1) * ITEMS_PER_PAGE) + 1} à {Math.min(page * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-secondary disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-secondary disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InscriptionsAdminFallback() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4 text-sm text-muted-foreground">Chargement des inscriptions…</p>
      </div>
    </div>
  )
}

export default function InscriptionsAdminPage() {
  return (
    <Suspense fallback={<InscriptionsAdminFallback />}>
      <InscriptionsAdminContent />
    </Suspense>
  )
}