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
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const circlesRef = useRef<HTMLDivElement>(null)
  const floatingCirclesRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [floatingCircleNodes, setFloatingCircleNodes] = useState<ReactNode[]>([])

  useEffect(() => {
    // Détecter si c'est un mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!circlesRef.current) return
      
      const scrolled = window.scrollY
      const circles = circlesRef.current.children
      
      // Effet de parallaxe - seulement sur desktop
      if (!isMobile) {
        Array.from(circles).forEach((circle, index) => {
          const speed = 0.2 + (index * 0.15)
          const yOffset = scrolled * speed
          const element = circle as HTMLElement
          element.style.transform = `translateY(${yOffset * 0.8}px)`
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  useEffect(() => {
    const circles: ReactNode[] = []

    if (isMobile) {
      const mobileColors = [
        "bg-blue-300/40",
        "bg-blue-400/35",
        "bg-blue-500/30",
        "bg-blue-200/45",
        "bg-blue-600/25",
        "bg-blue-700/20",
      ]

      for (let i = 0; i < 20; i++) {
        const size = Math.floor(Math.random() * 45) + 15
        const top = Math.random() * 100
        const left = Math.random() * 100
        const delay = Math.random() * 3
        const duration = 12 + Math.random() * 12
        const color = mobileColors[Math.floor(Math.random() * mobileColors.length)]

        circles.push(
          <div
            key={`mobile-${i}`}
            className={`absolute rounded-full ${color} blur-sm`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              animation: `float-circle-mobile ${duration}s ease-in-out ${delay}s infinite`,
              opacity: 0.35 + Math.random() * 0.3,
            }}
          />,
        )
      }
    } else {
      const desktopColors = [
        "bg-blue-400/30",
        "bg-blue-500/20",
        "bg-blue-300/40",
        "bg-blue-600/15",
        "bg-blue-400/25",
        "bg-blue-500/30",
        "bg-blue-300/20",
        "bg-blue-600/10",
      ]

      for (let i = 0; i < 30; i++) {
        const size = Math.floor(Math.random() * 40) + 15
        const top = Math.random() * 100
        const left = Math.random() * 100
        const delay = Math.random() * 5
        const duration = 8 + Math.random() * 12
        const color = desktopColors[Math.floor(Math.random() * desktopColors.length)]

        circles.push(
          <div
            key={`desktop-${i}`}
            className={`absolute rounded-full ${color} blur-sm`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              animation: `float-circle ${duration}s ease-in-out ${delay}s infinite`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />,
        )
      }
    }

    setFloatingCircleNodes(circles)
  }, [isMobile])

  const statIcons = [
    Award,
    Building2,
    Globe2,
    GraduationCap,
    SlidersHorizontal,
    Handshake,
  ]

  return (
    <section className="relative z-10 flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-b from-background/35 via-background/25 to-white">
      {/* Dégradé de transition vers le blanc en bas - plus léger sur mobile */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/80 pointer-events-none z-10" />

      {/* Petits cercles flottants */}
      <div 
        ref={floatingCirclesRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {floatingCircleNodes}
      </div>

      {/* Grands cercles avec effet de parallaxe - uniquement sur desktop */}
      {!isMobile && (
        <div 
          ref={circlesRef}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-blue-200/20 blur-3xl" />
          <div className="absolute -left-20 -top-20 h-[550px] w-[550px] rounded-full bg-blue-300/15 blur-3xl" />
          <div className="absolute left-1/4 -top-40 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute right-1/3 top-20 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-3xl" />
        </div>
      )}

      {/* Sur mobile, ajouter des grands cercles plus visibles */}
      {isMobile && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 top-0 h-[350px] w-[350px] rounded-full bg-blue-200/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-blue-300/15 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-[250px] w-[250px] rounded-full bg-blue-400/10 blur-3xl" />
        </div>
      )}

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

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-6 animate-fade-in-up [animation-delay:400ms]">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-primary/30 backdrop-blur-sm text-xs font-bold text-primary shadow-sm hover:-translate-y-1 transition-transform duration-300"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{sltHomeContent.hero.proofTitle}</p>
                <p className="text-xs text-muted-foreground">{sltHomeContent.hero.proofSubtitle}</p>
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
                      <div
                        className={`absolute inset-0 opacity-90 transition-all duration-500 group-hover:opacity-100 ${
                          index % 4 === 0
                            ? "bg-gradient-to-br from-cyan-100/80 via-blue-100/70 to-indigo-100/60"
                            : index % 4 === 1
                              ? "bg-gradient-to-br from-violet-100/80 via-fuchsia-100/70 to-pink-100/60"
                              : index % 4 === 2
                                ? "bg-gradient-to-br from-emerald-100/80 via-teal-100/70 to-cyan-100/60"
                                : "bg-gradient-to-br from-amber-100/80 via-orange-100/70 to-rose-100/60"
                        }`}
                      />
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
              <div className="relative mt-4 w-full rounded-xl border border-border/50 bg-white/90 p-3 shadow-md backdrop-blur-md transition-all duration-500 hover:shadow-lg sm:mt-5 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-400/25 via-emerald-400/20 to-green-500/35 text-green-700 backdrop-blur-sm ring-1 ring-green-500/20">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight text-foreground">
                      {sltHomeContent.hero.certifiedTitle}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {sltHomeContent.hero.certifiedSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-circle {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(15px, -15px) rotate(5deg);
          }
          50% {
            transform: translate(0, -25px) rotate(0deg);
          }
          75% {
            transform: translate(-15px, -10px) rotate(-5deg);
          }
        }

        @keyframes float-circle-mobile {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(12px, -12px) rotate(4deg);
          }
          50% {
            transform: translate(0, -18px) rotate(0deg);
          }
          75% {
            transform: translate(-12px, -6px) rotate(-4deg);
          }
        }

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
  )
}