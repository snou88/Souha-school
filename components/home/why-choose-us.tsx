"use client"

import { BookOpen, Users, Award, Briefcase } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltHomeContent } from "@/lib/slt-content"

const features = [
  { icon: Award, ...sltHomeContent.whyUs.items[0] },
  { icon: Users, ...sltHomeContent.whyUs.items[1] },
  { icon: BookOpen, ...sltHomeContent.whyUs.items[2] },
  { icon: Briefcase, ...sltHomeContent.whyUs.items[3] },
  // Les 2 autres points restent dans la même section pour respecter les exigences.
  { icon: BookOpen, ...sltHomeContent.whyUs.items[4] },
  { icon: Award, ...sltHomeContent.whyUs.items[5] },
]

export function WhyChooseUs() {
  useScrollAnimation()

  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            {sltHomeContent.whyUs.eyebrow}
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sltHomeContent.whyUs.title}
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {sltHomeContent.whyUs.lead}
          </p>
        </div>

        <div className="stagger-children mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="animate-on-scroll group rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
