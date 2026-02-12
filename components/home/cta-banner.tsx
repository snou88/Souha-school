"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function CtaBanner() {
  useScrollAnimation()

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="animate-on-scroll overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center shadow-lg sm:px-16">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to Transform Your Career?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Join our next cohort and gain the skills that employers demand. Limited spots available.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 rounded-lg bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              Start Your Application
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/20 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
            >
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
