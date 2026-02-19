"use client"

import { Users2, ListChecks } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltHomeContent } from "@/lib/slt-content"

export function SeminarsTeamBuilding() {
  useScrollAnimation()

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {sltHomeContent.seminars.eyebrow}
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sltHomeContent.seminars.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="animate-on-scroll rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Types de séminaires</h3>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {sltHomeContent.seminars.types.map((t) => (
                <li key={t} className="rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-on-scroll rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ListChecks className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{sltHomeContent.seminars.themesTitle}</h3>
            </div>
            <ul className="mt-6 space-y-2">
              {sltHomeContent.seminars.themes.map((t) => (
                <li key={t} className="text-sm leading-relaxed text-muted-foreground">
                  - {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

