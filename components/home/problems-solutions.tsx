"use client"

import { CheckCircle2, AlertTriangle } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltHomeContent } from "@/lib/slt-content"

export function ProblemsSolutions() {
  useScrollAnimation()

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="animate-on-scroll">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              {sltHomeContent.problems.eyebrow}
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {sltHomeContent.problems.title}
            </h2>
            <ul className="mt-8 space-y-3">
              {sltHomeContent.problems.items.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-on-scroll">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              {sltHomeContent.solutions.eyebrow}
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {sltHomeContent.solutions.title}
            </h2>
            <ul className="mt-8 space-y-3">
              {sltHomeContent.solutions.items.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

