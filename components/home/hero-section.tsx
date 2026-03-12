"use client"

import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { sltHomeContent } from "@/lib/slt-content"
import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const circlesRef = useRef<HTMLDivElement>(null)
  const floatingCirclesRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

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

  // Générer des positions pour les petits cercles
  const generateCircles = () => {
    const circles = []
    
    // Sur mobile : cercles bien visibles
    if (isMobile) {
      const mobileColors = [
        'bg-blue-300/40',
        'bg-blue-400/35',
        'bg-blue-500/30',
        'bg-blue-200/45',
        'bg-blue-600/25',
        'bg-blue-700/20',
      ]
      
      for (let i = 0; i < 20; i++) {
        const size = Math.floor(Math.random() * 45) + 15 // 15-60px
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
              opacity: 0.35 + Math.random() * 0.3, // 0.35-0.65
            }}
          />
        )
      }
      return circles
    }
    
    // Sur desktop : garder le design original
    const desktopColors = [
      'bg-blue-400/30',
      'bg-blue-500/20',
      'bg-blue-300/40',
      'bg-blue-600/15',
      'bg-blue-400/25',
      'bg-blue-500/30',
      'bg-blue-300/20',
      'bg-blue-600/10'
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
        />
      )
    }
    return circles
  }

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-b from-background via-background to-white">
      {/* Dégradé de transition vers le blanc en bas - plus léger sur mobile */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/80 pointer-events-none z-10" />

      {/* Petits cercles flottants */}
      <div 
        ref={floatingCirclesRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {generateCircles()}
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

          {/* Right - Stats card cluster - caché sur mobile */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="rounded-2xl border border-border/50 bg-white/70 backdrop-blur-md p-8 shadow-xl animate-fade-in-up [animation-delay:200ms] hover:shadow-2xl transition-all duration-500">
                <div className="grid grid-cols-2 gap-8">
                  {sltHomeContent.hero.stats.map((stat) => (
                    <div key={stat.label} className="text-center group">
                      <p className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 rounded-xl border border-border/50 bg-white/70 backdrop-blur-md p-4 shadow-xl animate-fade-in-up [animation-delay:500ms] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-400/20 to-green-500/30 text-green-600 backdrop-blur-sm">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{sltHomeContent.hero.certifiedTitle}</p>
                    <p className="text-xs text-muted-foreground">{sltHomeContent.hero.certifiedSubtitle}</p>
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