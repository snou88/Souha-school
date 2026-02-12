"use client"

import { Star } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Software Engineer at Google",
    content:
      "The Web Development program completely changed my career trajectory. The instructors were phenomenal, and the hands-on projects prepared me for real-world challenges.",
    rating: 5,
    initials: "SM",
  },
  {
    name: "David Nguyen",
    role: "Data Analyst at Microsoft",
    content:
      "I came in with zero coding experience and left with the skills and confidence to land my dream job. The career support team was incredible throughout the process.",
    rating: 5,
    initials: "DN",
  },
  {
    name: "Elena Rodriguez",
    role: "UX Lead at Shopify",
    content:
      "The UX/UI program exceeded my expectations. The curriculum is current, the mentors are industry veterans, and the community is genuinely supportive.",
    rating: 5,
    initials: "ER",
  },
]

export function Testimonials() {
  useScrollAnimation()

  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-on-scroll">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Our Graduates Say
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Hear from professionals who transformed their careers with Apex Academy.
          </p>
        </div>

        <div className="stagger-children mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="animate-on-scroll flex flex-col rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
