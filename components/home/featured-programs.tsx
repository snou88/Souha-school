"use client"

import Link from "next/link"
import { ArrowRight, Clock, Code, BarChart3, Palette } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const programs = [
  {
    icon: Code,
    title: "Full-Stack Web Development",
    description:
      "Master front-end and back-end technologies to build modern, scalable web applications from scratch.",
    duration: "6 Months",
    category: "Technology",
  },
  {
    icon: BarChart3,
    title: "Data Science & Analytics",
    description:
      "Learn Python, machine learning, and data visualization to extract insights from complex datasets.",
    duration: "5 Months",
    category: "Data",
  },
  {
    icon: Palette,
    title: "UX/UI Design Mastery",
    description:
      "Create beautiful, user-centered digital products using Figma, research methods, and design systems.",
    duration: "4 Months",
    category: "Design",
  },
]

export function FeaturedPrograms() {
  useScrollAnimation()

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end animate-on-scroll">
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Featured Programs
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Start Learning Today
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Explore our most popular training programs trusted by thousands of professionals.
            </p>
          </div>
          <Link
            href="/formations"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View All Programs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="stagger-children mt-12 grid gap-8 md:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.title}
              className="animate-on-scroll group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Card header */}
              <div className="flex items-center gap-4 border-b border-border p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <program.icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {program.category}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{program.title}</h3>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-6">
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {program.duration}
                  </span>
                  <Link
                    href="/formations"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
