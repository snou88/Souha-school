import { StatCards } from "@/components/admin/dashboard/stat-cards"
import { RecentInscriptions } from "@/components/admin/dashboard/recent-inscriptions"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | SLT Admin",
  description: "Admin dashboard overview for SLT Academy",
}

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back, Admin. Here is your academy overview.</p>
      </div>
      <StatCards />

      {/* Table + Messages Row */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentInscriptions />
        </div>
      </div>
    </div>
  )
}
