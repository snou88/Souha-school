"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, MoreHorizontal, Users, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import { sltUiLabels } from "@/lib/slt-content"

interface Inscription {
  id: number
  name: string
  email: string
  formation: string
  date: string
  status: "Approved" | "Pending" | "Rejected"
}

const statusStyles: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

export function RecentInscriptions() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentInscriptions() {
      try {
        const res = await fetch('/api/inscriptions')
        const data = await res.json()
        
        if (data.success && Array.isArray(data.data)) {
          const recent = data.data
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
          setInscriptions(recent)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des inscriptions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentInscriptions()
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-4 sm:px-5 py-4">
          <div className="h-5 w-32 animate-pulse rounded bg-muted"></div>
          <div className="mt-1 h-4 w-48 animate-pulse rounded bg-muted"></div>
        </div>
        <div className="p-5 text-center text-sm text-muted-foreground">
          Chargement des inscriptions récentes…
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Inscriptions récentes</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Dernières demandes reçues</p>
        </div>
        <Link 
          href="/admin/inscriptions" 
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap ml-2"
        >
          Voir tout
        </Link>
      </div>

      {/* Version mobile : cartes */}
      <div className="block sm:hidden divide-y divide-border">
        {inscriptions.length === 0 ? (
          <div className="p-5 text-center text-sm text-muted-foreground">
            Aucune inscription trouvée
          </div>
        ) : (
          inscriptions.map((row) => (
            <div key={row.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
                      {row.name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{row.name}</p>
                    <p className="text-[11px] text-muted-foreground">{row.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-[11px] font-semibold", statusStyles[row.status])}>
                  {sltUiLabels.status[row.status] ?? row.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="truncate">{row.formation}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{row.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1">
                <Link 
                  href={`/admin/inscriptions?id=${row.id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Version desktop : tableau */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 sm:px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Apprenant</th>
              <th className="px-4 sm:px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Formation</th>
              <th className="px-4 sm:px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="px-4 sm:px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Statut</th>
              <th className="px-4 sm:px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {inscriptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Aucune inscription trouvée
                </td>
              </tr>
            ) : (
              inscriptions.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/30">
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
                          {row.name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-[200px]">{row.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 text-sm text-muted-foreground truncate max-w-[150px]">{row.formation}</td>
                  <td className="px-4 sm:px-5 py-3.5 text-sm text-muted-foreground whitespace-nowrap">{row.date}</td>
                  <td className="px-4 sm:px-5 py-3.5">
                    <Badge variant="outline" className={cn("text-[11px] font-semibold", statusStyles[row.status])}>
                      {sltUiLabels.status[row.status] ?? row.status}
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/admin/inscriptions?id=${row.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}