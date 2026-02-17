"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  Phone,
  BookOpen,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  status: "Active" | "Inactive" | "Graduated"
  enrolled: string
  number: number // remplace gpa
}

const allStudents: Student[] = [
  { id: 1, type: "Individual", name: "Sarah Martinez", email: "sarah.m@email.com", phone: "+1 (555) 012-3456", formation: "Web Development", status: "Active", enrolled: "Sep 2025", number: 1 },
  { id: 2, type: "Company", name: "TechCorp Solutions", email: "contact@techcorp.com", phone: "+1 (555) 023-4567", formation: "Data Science", status: "Active", enrolled: "Jan 2026", number: 8 },
  { id: 3, type: "Individual", name: "Emily Chen", email: "emily.c@email.com", phone: "+1 (555) 034-5678", formation: "UI/UX Design", status: "Active", enrolled: "Sep 2025", number: 1 },
  { id: 4, type: "Individual", name: "Lucas Bernard", email: "lucas.b@email.com", phone: "+1 (555) 045-6789", formation: "Cloud Engineering", status: "Inactive", enrolled: "Jan 2025", number: 1 },
  { id: 5, type: "Company", name: "GreenApps SARL", email: "hr@greenapps.com", phone: "+1 (555) 056-7890", formation: "Mobile Dev", status: "Active", enrolled: "Sep 2025", number: 5 },
  { id: 6, type: "Individual", name: "James Wilson", email: "j.wilson@email.com", phone: "+1 (555) 067-8901", formation: "Cybersecurity", status: "Graduated", enrolled: "Jan 2024", number: 1 },
  { id: 7, type: "Individual", name: "Aisha Patel", email: "a.patel@email.com", phone: "+1 (555) 078-9012", formation: "Data Science", status: "Active", enrolled: "Jan 2026", number: 1 },
  { id: 8, type: "Individual", name: "Marco Rossi", email: "m.rossi@email.com", phone: "+1 (555) 089-0123", formation: "Web Development", status: "Active", enrolled: "Sep 2025", number: 1 },
  { id: 9, type: "Company", name: "DesignHouse Ltd.", email: "contact@designhouse.com", phone: "+1 (555) 090-1234", formation: "UI/UX Design", status: "Graduated", enrolled: "Jan 2024", number: 12 },
  { id: 10, type: "Individual", name: "Omar Hassan", email: "o.hassan@email.com", phone: "+1 (555) 101-2345", formation: "Cloud Engineering", status: "Active", enrolled: "Sep 2025", number: 1 },
  { id: 11, type: "Individual", name: "Lina Dubois", email: "l.dubois@email.com", phone: "+1 (555) 112-3456", formation: "Mobile Dev", status: "Inactive", enrolled: "Jan 2025", number: 1 },
  { id: 12, type: "Company", name: "SecureNet Inc.", email: "info@securenet.com", phone: "+1 (555) 123-4567", formation: "Cybersecurity", status: "Active", enrolled: "Jan 2026", number: 20 },
]

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  Graduated: "bg-primary/10 text-primary border-primary/20",
}

const ITEMS_PER_PAGE = 8

export default function StudentsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Student["status"]>("all")
  const [typeFilter, setTypeFilter] = useState<"all" | Student["type"]>("all")
  const [page, setPage] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null)

  const filtered = useMemo(() => {
    return allStudents.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.formation.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "all" || s.status === statusFilter
      const matchType = typeFilter === "all" || s.type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [search, statusFilter, typeFilter])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Accounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage entreprises & clients ({allStudents.length} total)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110">
            <Plus className="h-4 w-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or formation..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:max-w-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setPage(1) }}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Graduated">Graduated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as any); setPage(1) }}>
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
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Account</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Formation</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Enrolled</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Number</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/20">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {s.name.split(" ").map((n) => n[0]).join("").slice(0,3)}
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
                            {s.type}
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
                    <Badge variant="outline" className={cn("text-[11px] font-semibold", statusStyles[s.status])}>{s.status}</Badge>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedStudent(s)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="View account">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Edit account">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteStudent(s)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Delete account">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">No accounts found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} accounts
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account Profile</DialogTitle>
            <DialogDescription>Detailed information about this account.</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                    {selectedStudent.name.split(" ").map((n) => n[0]).join("").slice(0,3)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedStudent.name}</h3>
                  <Badge variant="outline" className={cn("mt-1 text-[11px] font-semibold", statusStyles[selectedStudent.status])}>
                    {selectedStudent.status}
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
                    <p className="text-[11px] text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">{selectedStudent.phone}</p>
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
                      <p className="text-[11px] text-muted-foreground">Enrolled</p>
                      <p className="text-sm font-medium text-foreground">{selectedStudent.enrolled}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-2.5">
                    <div className="flex h-4 w-4 items-center justify-center text-xs font-bold text-muted-foreground">
                      #{selectedStudent.type === "Company" ? "C" : "I"}
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">{selectedStudent.type === "Company" ? "Students" : "Seats"}</p>
                      <p className="text-sm font-semibold text-foreground">{selectedStudent.number}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
                  Edit Profile
                </button>
                <button onClick={() => setSelectedStudent(null)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                  Close
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
            <DialogTitle>Remove Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold text-foreground">{deleteStudent?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setDeleteStudent(null)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Cancel
            </button>
            <button onClick={() => setDeleteStudent(null)} className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-all hover:brightness-110">
              Remove
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
