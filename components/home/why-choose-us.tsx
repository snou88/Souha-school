"use client"

import { BookOpen, Users, Award, Briefcase } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Curriculum",
    description:
      "Courses designed and taught by industry professionals with years of real-world experience.",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description:
      "Personalized attention with a maximum of 20 students per session to ensure effective learning.",
  },
  {
    icon: Award,
    title: "Recognized Certifications",
    description:
      "Earn internationally accredited certificates that boost your professional credibility.",
  },
  {
    icon: Briefcase,
    title: "Career Support",
    description:
      "Dedicated placement assistance with 200+ partner companies hiring our graduates.",
  },
]

export function WhyChooseUs() {
  useScrollAnimation()

  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why Apex Academy
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            We combine cutting-edge curriculum with hands-on practice and real industry connections.
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
