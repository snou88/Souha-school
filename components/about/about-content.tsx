"use client"

import {
  Target,
  Eye,
  Heart,
  Zap,
  Shield,
  Lightbulb,
  Linkedin,
  Twitter,
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We constantly evolve our curriculum to reflect the latest industry trends and technologies.",
  },
  {
    icon: Heart,
    title: "Student-First",
    description: "Every decision we make is guided by what creates the best learning experience for our students.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description: "We maintain the highest standards of honesty, transparency, and ethical conduct.",
  },
  {
    icon: Zap,
    title: "Excellence",
    description: "We pursue the highest quality in teaching, mentoring, and career support services.",
  },
]

const milestones = [
  { year: "2015", title: "Founded", description: "Apex Academy launched with 3 programs and 45 students." },
  { year: "2017", title: "Expansion", description: "Grew to 10 programs and opened a second campus location." },
  { year: "2019", title: "1,000 Graduates", description: "Reached our first major milestone with a 92% employment rate." },
  { year: "2021", title: "Online Launch", description: "Introduced hybrid and fully online learning options for all programs." },
  { year: "2023", title: "International Recognition", description: "Received accreditation from international education bodies." },
  { year: "2025", title: "2,500+ Alumni", description: "Our growing community of graduates now spans 40+ countries." },
]

const team = [
  { name: "Dr. James Parker", role: "Founder & CEO", initials: "JP", bio: "Former CTO with 20+ years in tech education and leadership." },
  { name: "Sarah Chen", role: "Academic Director", initials: "SC", bio: "PhD in Education, previously led curriculum at MIT Professional." },
  { name: "Michael Osei", role: "Head of Technology", initials: "MO", bio: "Ex-Google engineer and open-source contributor for 15 years." },
  { name: "Laura Kim", role: "Career Services Lead", initials: "LK", bio: "Talent acquisition expert with connections to 200+ companies." },
]

export function AboutContent() {
  useScrollAnimation()

  return (
    <div className="bg-background pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero header */}
        <div className="mx-auto max-w-3xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            About Us
          </span>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Shaping the Next Generation of Professionals
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Since 2015, Apex Academy has been committed to delivering world-class education
            that bridges the gap between academic knowledge and real-world expertise.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          <div className="animate-on-scroll rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-foreground">Our Mission</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              To empower individuals with practical, industry-relevant skills through
              innovative training programs that accelerate career growth and create lasting
              professional impact. We believe education should be accessible, results-driven,
              and designed for the real world.
            </p>
          </div>
          <div className="animate-on-scroll rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-foreground">Our Vision</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              To become the global standard for professional education, recognized for
              transforming careers and communities through excellence in teaching, mentoring,
              and career placement. We envision a world where talent meets opportunity
              through quality training.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our Values
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What Drives Us Forward
            </h2>
          </div>
          <div className="stagger-children mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="animate-on-scroll rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our Journey
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Milestones That Define Us
            </h2>
          </div>
          <div className="relative mt-12">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 hidden h-full w-px bg-border md:left-1/2 md:block" aria-hidden="true" />

            <div className="flex flex-col gap-8">
              {milestones.map((milestone, i) => (
                <div
                  key={milestone.year}
                  className={`animate-on-scroll flex flex-col gap-4 md:flex-row md:items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`rounded-xl border border-border bg-card p-6 shadow-sm ${i % 2 === 0 ? "md:ml-auto md:mr-8" : "md:ml-8"} max-w-md`}>
                      <span className="text-sm font-bold text-primary">{milestone.year}</span>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">{milestone.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className="hidden h-4 w-4 shrink-0 rounded-full border-2 border-primary bg-background md:block" aria-hidden="true" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mt-24">
          <div className="mx-auto max-w-2xl text-center animate-on-scroll">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Leadership
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Experienced professionals dedicated to your success.
            </p>
          </div>
          <div className="stagger-children mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="animate-on-scroll group rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {member.initials}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm font-medium text-primary">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={`${member.name} Twitter`}
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
