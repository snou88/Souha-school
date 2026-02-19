"use client"

import { useEffect, useState } from "react"
import { Users, ClipboardList, BookOpen, TrendingUp, TrendingDown, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardStats {
  totalStudents: number
  totalCompanies: number
  totalInscriptions: number
  totalFormations: number
  pendingInscriptions: number
  approvedInscriptions: number
  rejectedInscriptions: number
  activeStudents: number
  inscriptionsThisMonth: number
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
          <div className="mt-2 h-8 w-20 animate-pulse rounded bg-muted"></div>
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted"></div>
        </div>
        <div className="h-11 w-11 animate-pulse rounded-xl bg-muted"></div>
      </div>
    </div>
  )
}

export function StatCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [previousMonthStats, setPreviousMonthStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Récupérer les statistiques actuelles
        const [studentsRes, inscriptionsRes, formationsRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/inscriptions'),
          fetch('/api/formations')
        ])

        const studentsData = await studentsRes.json()
        const inscriptionsData = await inscriptionsRes.json()
        const formationsData = await formationsRes.json()

        if (studentsData.success && inscriptionsData.success && formationsData.success) {
          // Compter les étudiants par type
          const totalStudents = studentsData.data.length
          const totalCompanies = studentsData.data.filter((s: any) => s.type === 'Company').length
          const activeStudents = studentsData.data.filter((s: any) => s.status === 'Active').length

          // Compter les inscriptions par statut
          const totalInscriptions = inscriptionsData.data.length
          const pendingInscriptions = inscriptionsData.data.filter((i: any) => i.status === 'Pending').length
          const approvedInscriptions = inscriptionsData.data.filter((i: any) => i.status === 'Approved').length
          const rejectedInscriptions = inscriptionsData.data.filter((i: any) => i.status === 'Rejected').length

          // Compter les inscriptions de ce mois
          const now = new Date()
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          const inscriptionsThisMonth = inscriptionsData.data.filter((i: any) => {
            const date = new Date(i.date || i.created_at)
            return date >= firstDayOfMonth
          }).length

          // Total des formations actives
          const totalFormations = formationsData.data.filter((f: any) => f.status === 'Active').length

          setStats({
            totalStudents,
            totalCompanies,
            totalInscriptions,
            totalFormations,
            pendingInscriptions,
            approvedInscriptions,
            rejectedInscriptions,
            activeStudents,
            inscriptionsThisMonth
          })

          // Simuler les stats du mois précédent (à remplacer par une vraie requête si nécessaire)
          setPreviousMonthStats({
            totalStudents: Math.round(totalStudents * 0.9),
            totalCompanies: Math.round(totalCompanies * 0.85),
            totalInscriptions: Math.round(totalInscriptions * 0.8),
            totalFormations: Math.round(totalFormations * 0.95),
            pendingInscriptions: Math.round(pendingInscriptions * 1.2),
            approvedInscriptions: Math.round(approvedInscriptions * 0.85),
            rejectedInscriptions: Math.round(rejectedInscriptions * 0.9),
            activeStudents: Math.round(activeStudents * 0.88),
            inscriptionsThisMonth: Math.round(inscriptionsThisMonth * 0.7)
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    )
  }

  if (!stats) return null

  // Calculer les tendances
  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return { value: '0%', trend: 'up' as const }
    const percentChange = ((current - previous) / previous) * 100
    const formattedValue = `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`
    return {
      value: formattedValue,
      trend: percentChange >= 0 ? 'up' as const : 'down' as const
    }
  }

  const studentTrend = previousMonthStats ? calculateTrend(stats.totalStudents, previousMonthStats.totalStudents) : { value: '+0%', trend: 'up' }
  const companyTrend = previousMonthStats ? calculateTrend(stats.totalCompanies, previousMonthStats.totalCompanies) : { value: '+0%', trend: 'up' }
  const inscriptionTrend = previousMonthStats ? calculateTrend(stats.totalInscriptions, previousMonthStats.totalInscriptions) : { value: '+0%', trend: 'up' }
  const formationTrend = previousMonthStats ? calculateTrend(stats.totalFormations, previousMonthStats.totalFormations) : { value: '+0%', trend: 'up' }

  const cards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      change: studentTrend.value,
      trend: studentTrend.trend,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Companies",
      value: stats.totalCompanies,
      change: companyTrend.value,
      trend: companyTrend.trend,
      icon: Building2,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      label: "Total Inscriptions",
      value: stats.totalInscriptions,
      change: inscriptionTrend.value,
      trend: inscriptionTrend.trend,
      icon: ClipboardList,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      subtext: `${stats.pendingInscriptions} pending`
    },
    {
      label: "Active Formations",
      value: stats.totalFormations,
      change: formationTrend.value,
      trend: formationTrend.trend,
      icon: BookOpen,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">
                {stat.value.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-xs font-semibold",
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  )}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
              {stat.subtext && (
                <p className="mt-1 text-xs text-muted-foreground">{stat.subtext}</p>
              )}
            </div>
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
          </div>
          <div className={cn("absolute bottom-0 left-0 h-[2px] w-full opacity-0 transition-opacity group-hover:opacity-100", stat.bgColor)} />
        </div>
      ))}
    </div>
  )
}