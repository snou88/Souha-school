"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Code,
  BarChart3,
  Palette,
  Megaphone,
  ShieldCheck,
  Server,
  Brain,
  Smartphone,
  Clock,
  ArrowRight,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const categories = ["All", "Technology", "Data", "Design", "Business"] as const

type Category = (typeof categories)[number]

const formations = [
  {
    icon: Code,
    title: "Full-Stack Web Development",
    description:
      "Master HTML, CSS, JavaScript, React, Node.js, and databases to build production-ready applications.",
    duration: "6 Months",
    students: "450+",
    category: "Technology" as Category,
  },
  {
    icon: BarChart3,
    title: "Data Science & Analytics",
    description:
      "Learn Python, SQL, machine learning, and data visualization to drive business decisions with data.",
    duration: "5 Months",
    students: "380+",
    category: "Data" as Category,
  },
  {
    icon: Palette,
    title: "UX/UI Design Mastery",
    description:
      "Create user-centered digital products using Figma, prototyping, research methods, and design systems.",
    duration: "4 Months",
    students: "320+",
    category: "Design" as Category,
  },
  {
    icon: Megaphone,
    title: "Digital Marketing Strategy",
    description:
      "Master SEO, content marketing, social media, paid advertising, and analytics for measurable growth.",
    duration: "3 Months",
    students: "500+",
    category: "Business" as Category,
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity Fundamentals",
    description:
      "Learn network security, ethical hacking, threat analysis, and compliance to protect digital assets.",
    duration: "5 Months",
    students: "210+",
    category: "Technology" as Category,
  },
  {
    icon: Server,
    title: "Cloud & DevOps Engineering",
    description:
      "Master AWS, Docker, Kubernetes, CI/CD pipelines, and infrastructure automation for modern deployments.",
    duration: "5 Months",
    students: "190+",
    category: "Technology" as Category,
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description:
      "Build intelligent systems with deep learning, NLP, computer vision, and production ML pipelines.",
    duration: "6 Months",
    students: "260+",
    category: "Data" as Category,
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Create native and cross-platform mobile applications for iOS and Android using React Native and Swift.",
    duration: "5 Months",
    students: "340+",
    category: "Technology" as Category,
  },
  {
    icon: Megaphone,
    title: "Project Management Professional",
    description:
      "Learn Agile, Scrum, risk management, and stakeholder communication to lead projects successfully.",
    duration: "3 Months",
    students: "420+",
    category: "Business" as Category,
  },
]

export function FormationsContent() {
  const [active, setActive] = useState<Category>("All")
  useScrollAnimation()

  const filtered =
    active === "All" ? formations : formations.filter((f) => f.category === active)

  return (
    <section className="bg-background pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Our Programs
          </span>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Professional Training Programs
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Choose from 30+ programs designed to give you job-ready skills in the most
            in-demand fields.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 animate-on-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
                active === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="stagger-children mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((formation) => (
            <div
              key={formation.title}
              className="animate-on-scroll group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <formation.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                    {formation.category}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-foreground">{formation.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {formation.description}
                </p>

                <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {formation.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {formation.students} enrolled
                  </span>
                </div>
              </div>

              <div className="border-t border-border px-6 py-4">
                <Link
                  href="/inscription"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Learn More
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
