"use client"

import { BookOpen, Users, Award, Briefcase } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { sltHomeContent } from "@/lib/slt-content"

const features = [
  {
    icon: Award,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Apprenants en formation professionnelle",
    ...sltHomeContent.whyUs.items[0],
  },
  {
    icon: Users,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Formateur expert en atelier",
    ...sltHomeContent.whyUs.items[1],
  },
  {
    icon: BookOpen,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Programme de formation sur mesure",
    ...sltHomeContent.whyUs.items[2],
  },
  {
    icon: Briefcase,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Equipe en activite de team building",
    ...sltHomeContent.whyUs.items[3],
  },
  // Les 2 autres points restent dans la même section pour respecter les exigences.
  {
    icon: BookOpen,
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Campus moderne et installations confortables",
    ...sltHomeContent.whyUs.items[4],
  },
  {
    icon: Award,
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Evolution continue et excellence pedagogique",
    ...sltHomeContent.whyUs.items[5],
  },
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

        <div className="stagger-children mt-16 grid gap-6 sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`animate-on-scroll group relative isolate overflow-hidden border border-border/60 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl 
  ${index === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""} 
  ${index === 5 ? "sm:row-span-2 lg:row-span-1 lg:col-span-2" : ""} 
  ${index % 2 === 0 ? "lg:-translate-y-2" : "lg:translate-y-2"}`}
            >
              <img
                src={feature.image}
                alt={feature.imageAlt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-125 group-hover:rotate-1"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/25 transition-opacity duration-500 group-hover:from-black/90" />
              <div className="relative z-10 flex h-full min-h-[260px] flex-col p-6 pb-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                    <h3 className="text-balance text-lg font-semibold leading-snug tracking-tight text-white drop-shadow-md">
                      {feature.title}
                    </h3>
                    <p className="text-pretty text-sm leading-relaxed text-white drop-shadow-md">
                      {feature.description}
                    </p>
                  </div>
                  <div
                    aria-hidden
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/40 via-white/20 to-white/5 text-white shadow-[0_8px_28px_rgba(0,0,0,0.45)] ring-2 ring-white/30 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:from-primary group-hover:via-primary/85 group-hover:to-primary/65 group-hover:text-primary-foreground group-hover:ring-primary/45 group-hover:shadow-xl"
                  >
                    <feature.icon className="h-6 w-6 drop-shadow-md" strokeWidth={1.75} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
