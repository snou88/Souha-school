"use client"

import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/5" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/[0.03]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-32 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left content */}
          <div className="max-w-xl">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Enrollment Open for 2026
              </span>
            </div>

            <h1 className="mt-8 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in-up [animation-delay:100ms]">
              Build Your Future with
              <span className="text-primary"> Professional Training</span>
            </h1>

            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground animate-fade-in-up [animation-delay:200ms]">
              Gain in-demand skills through hands-on programs designed by industry experts. 
              Join thousands of graduates who transformed their careers at Apex Academy.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-in-up [animation-delay:300ms]">
              <Link
                href="/formations"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
              >
                View Programs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-secondary active:scale-[0.98]"
              >
                <Play className="h-4 w-4" />
                Enroll Now
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-6 animate-fade-in-up [animation-delay:400ms]">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-xs font-bold text-primary"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">2,500+ Graduates</p>
                <p className="text-xs text-muted-foreground">Trusted by leading companies worldwide</p>
              </div>
            </div>
          </div>

          {/* Right - Stats card cluster */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main card */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-lg animate-fade-in-up [animation-delay:200ms]">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { value: "95%", label: "Employment Rate" },
                    { value: "50+", label: "Expert Instructors" },
                    { value: "30+", label: "Training Programs" },
                    { value: "4.9", label: "Student Rating" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-3xl font-bold text-primary">{stat.value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating accent card */}
              <div className="absolute -bottom-6 -left-6 rounded-xl border border-border bg-card p-4 shadow-lg animate-fade-in-up [animation-delay:500ms]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Certified Programs</p>
                    <p className="text-xs text-muted-foreground">Internationally recognized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
