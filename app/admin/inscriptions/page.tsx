"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Check,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
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

const inscriptions: Inscription[] = [
  { id: 1, type: "Individual", name: "Sarah Martinez", email: "sarah.m@email.com", formation: "Web Development", date: "Feb 12, 2026", number: 1, status: "Pending" },
  { id: 2, type: "Company", name: "TechCorp Solutions", email: "contact@techcorp.com", formation: "Data Science", date: "Feb 11, 2026", number: 6, status: "Pending" },
  { id: 3, type: "Individual", name: "Emily Chen", email: "emily.c@email.com", formation: "UI/UX Design", date: "Feb 10, 2026", number: 1, status: "Approved" },
  { id: 4, type: "Company", name: "DesignHouse Ltd.", email: "contact@designhouse.com", formation: "UI/UX Design", date: "Feb 09, 2026", number: 12, status: "Rejected" },
  { id: 5, type: "Individual", name: "Omar Hassan", email: "o.hassan@email.com", formation: "Cloud Engineering", date: "Feb 08, 2026", number: 1, status: "Pending" },
]

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

export default function InscriptionsAdminPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return inscriptions.filter((i) => {
      const matchSearch =
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.formation.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "all" || i.status === statusFilter
      const matchType = typeFilter === "all" || i.type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [search, statusFilter, typeFilter])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const counts = {
    total: inscriptions.length,
    pending: inscriptions.filter((i) => i.status === "Pending").length,
    approved: inscriptions.filter((i) => i.status === "Approved").length,
    rejected: inscriptions.filter((i) => i.status === "Rejected").length,
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and manage enrollment requests
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.total, color: "bg-primary/10 text-primary" },
          { label: "Pending", value: counts.pending, color: "bg-warning/10 text-warning" },
          { label: "Approved", value: counts.approved, color: "bg-success/10 text-success" },
          { label: "Rejected", value: counts.rejected, color: "bg-destructive/10 text-destructive" },
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
            placeholder="Search by name or formation..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-sm"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1) }}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Individual">Individual</SelectItem>
            <SelectItem value="Company">Company</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Account</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Formation</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Number</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => {
                const StatusIcon = statusIcons[row.status]
                return (
                  <tr key={row.id} className="border-b border-border hover:bg-secondary/20">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {row.name.split(" ").map((n) => n[0]).join("").slice(0,3)}
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
                              {row.type}
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
                        {row.status}
                      </Badge>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {row.status === "Pending" && (
                          <>
                            <button className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-success hover:bg-success/10">
                              <Check className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10">
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </>
                        )}
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
