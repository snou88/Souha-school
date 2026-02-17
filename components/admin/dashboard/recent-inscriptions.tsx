"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, MoreHorizontal } from "lucide-react"

const inscriptions = [
  { id: 1, name: "Sarah Martinez", email: "sarah.m@email.com", formation: "Web Development", date: "Feb 12, 2026", status: "Approved" },
  { id: 2, name: "Ahmed Khalil", email: "a.khalil@email.com", formation: "Data Science", date: "Feb 11, 2026", status: "Pending" },
  { id: 3, name: "Emily Chen", email: "emily.c@email.com", formation: "UI/UX Design", date: "Feb 10, 2026", status: "Approved" },
  { id: 4, name: "Lucas Bernard", email: "lucas.b@email.com", formation: "Cloud Engineering", date: "Feb 09, 2026", status: "Rejected" },
  { id: 5, name: "Fatima Zahra", email: "f.zahra@email.com", formation: "Mobile Dev", date: "Feb 08, 2026", status: "Pending" },
]

const statusStyles: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

export function RecentInscriptions() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Recent Inscriptions</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Latest enrollment requests</p>
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Formation</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {inscriptions.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/30">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
                        {row.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{row.name}</p>
                      <p className="text-[11px] text-muted-foreground">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{row.formation}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{row.date}</td>
                <td className="px-5 py-3.5">
                  <Badge variant="outline" className={cn("text-[11px] font-semibold", statusStyles[row.status])}>
                    {row.status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
