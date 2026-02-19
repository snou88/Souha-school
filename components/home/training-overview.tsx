"use client"

import { BookOpen, Settings2, Languages, Users } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltHomeContent } from "@/lib/slt-content"

export function TrainingOverview() {
  useScrollAnimation()

  const pro = sltHomeContent.trainings.items
  const transversal = sltHomeContent.transversal.items

  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {sltHomeContent.trainings.eyebrow}
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sltHomeContent.trainings.title}
          </h2>
        </div>

        <div className="stagger-children mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: BookOpen, ...pro[0] },
            { icon: Settings2, ...pro[1] },
            { icon: Users, ...pro[2] },
          ].map((item) => (
            <div key={item.title} className="animate-on-scroll rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {sltHomeContent.transversal.eyebrow}
          </span>
          <h3 className="mt-3 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {sltHomeContent.transversal.title}
          </h3>
        </div>

        <div className="stagger-children mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {transversal.map((item) => (
            <div key={item} className="animate-on-scroll flex items-start gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Languages className="h-5 w-5" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

