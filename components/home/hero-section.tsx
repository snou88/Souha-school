"use client"

import Link from "next/link"
import {
  ArrowRight,
  Play,
  Award,
  Building2,
  Globe2,
  GraduationCap,
  SlidersHorizontal,
  Handshake,
} from "lucide-react"
import { sltHomeContent } from "@/lib/slt-content"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const statIcons = [
    Award,
    Building2,
    Globe2,
    GraduationCap,
    SlidersHorizontal,
    Handshake,
  ]

  return (
    <>
      <section
        className="relative z-10 flex min-h-[100vh] items-start overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            isMobile ? "url('/image/background-tel.png')" : "url('/image/background.png')",
          backgroundPosition: isMobile ? "center top" : "center",
        }}
      >
        {/* Dégradé principal à la fin de l'image */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-white via-white/95 via-10% to-transparent pointer-events-none z-10" />
        
        {/* Transition douce pour fusionner avec la section suivante */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

        <div className="relative mx-auto max-w-7xl px-6 py-32 lg:px-8 z-20">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left content */}
            <div className="max-w-xl">
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {sltHomeContent.hero.pill}
                </span>
              </div>

              <h1 className="mt-8 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in-up [animation-delay:100ms]">
                {sltHomeContent.hero.title}
                <span className="text-primary"> {sltHomeContent.hero.titleAccent}</span>
              </h1>

              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground animate-fade-in-up [animation-delay:200ms]">
                {sltHomeContent.hero.lead}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-in-up [animation-delay:300ms]">
                <Link
                  href="/formations"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  {sltHomeContent.hero.primaryCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-white/80 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <Play className="h-4 w-4" />
                  {sltHomeContent.hero.secondaryCta}
                </Link>
              </div>

              {/* Carte d'accompagnement */}
              <div className="mt-12 rounded-xl border border-border/60 bg-white/85 p-4 shadow-md backdrop-blur-md animate-fade-in-up [animation-delay:400ms]">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["A", "B", "C", "D"].map((letter) => (
                      <div
                        key={letter}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-gradient-to-br from-primary/20 to-primary/30 text-xs font-bold text-primary shadow-sm"
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight text-foreground">
                      Un accompagnement orienté résultats
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Des parcours adaptés aux besoins des entreprises et des apprenants
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Stats card cluster animé (mobile + desktop) */}
            <div className="block">
              <div className="relative">
                <div className="rounded-3xl border border-border/50 bg-white/70 backdrop-blur-md p-5 sm:p-6 lg:p-8 shadow-xl animate-fade-in-up [animation-delay:200ms] hover:shadow-2xl transition-all duration-500">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5">
                    {sltHomeContent.hero.stats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/65 p-4 shadow-md backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                      >
                        <div className="absolute inset-0 opacity-90 transition-all duration-500 group-hover:opacity-100" />
                        <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/40 blur-xl transition-all duration-500 group-hover:scale-125" />
                        <div className="relative z-10">
                          {(() => {
                            const StatIcon = statIcons[index % statIcons.length]
                            return (
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white/50 via-white/20 to-white/5 text-slate-700 shadow-[0_8px_28px_rgba(15,23,42,0.14)] ring-1 ring-white/60 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:from-primary group-hover:via-primary/85 group-hover:to-primary/65 group-hover:text-primary-foreground group-hover:ring-primary/45">
                                <StatIcon className="h-5 w-5" strokeWidth={1.9} />
                              </div>
                            )
                          })()}
                          <p className="text-lg font-black leading-tight text-slate-800 sm:text-xl lg:text-2xl group-hover:scale-[1.03] transition-transform duration-300">
                            {stat.value}
                          </p>
                          <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="group relative mt-4 w-full rounded-xl border border-primary/20 bg-white/90 p-3 shadow-md backdrop-blur-md transition-all duration-500 hover:shadow-lg sm:mt-5 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="mb-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/50 via-white/20 to-white/5 text-slate-700 shadow-[0_8px_28px_rgba(15,23,42,0.14)] ring-1 ring-white/60 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:from-primary group-hover:via-primary/85 group-hover:to-primary/65 group-hover:text-primary-foreground group-hover:ring-primary/45">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight text-foreground">
                        Prestations certifiantes
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Formations et séminaires à forte valeur ajoutée
                      </p>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-primary">
                        Agréé par le Ministére de la Formation et de l&apos;Enseignement Professionnels
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          /* Optimisations mobile */
          @media (max-width: 768px) {
            section {
              min-height: 80vh;
            }
          }
        `}</style>
      </section>

      {/* Section blanche qui suit naturellement après le dégradé */}
      <div className="relative w-full bg-white">
        {/* Votre contenu suivant ici */}
      </div>
    </>
  )
}