"use client"

import { useEffect, useState, useRef } from "react"
import { Users, ClipboardList, BookOpen, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Total Students",
    value: 2847,
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
    {
    label: "Total Companys",
    value: 2847,
    change: "+12.5%",
    trend: "up" as const,
    icon: BookOpen,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    label: "Total Inscriptions",
    value: 384,
    change: "+8.2%",
    trend: "up" as const,
    icon: ClipboardList,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    label: "Active Formations",
    value: 42,
    change: "+3",
    trend: "up" as const,
    icon: BookOpen,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

function AnimatedCounter({ target, prefix = "" }: { target: number; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const duration = 1200
    const steps = 40
    const stepTime = duration / steps
    const increment = target / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), target)
      setCount(current)
      if (step >= steps) {
        clearInterval(timer)
        setCount(target)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [target])

  const formatted = prefix + count.toLocaleString()
  return <span ref={ref}>{formatted}</span>
}

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-card-foreground">
                <AnimatedCounter target={stat.value} prefix={stat.prefix} />
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
            </div>
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
          </div>
          {/* Subtle decorative accent */}
          <div className={cn("absolute bottom-0 left-0 h-[2px] w-full opacity-0 transition-opacity group-hover:opacity-100", stat.bgColor)} />
        </div>
      ))}
    </div>
  )
}
