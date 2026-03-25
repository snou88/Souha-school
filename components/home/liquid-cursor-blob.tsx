"use client"

import { useEffect, useRef } from "react"

const LERP_MAIN = 0.068
const LERP_GLOW = 0.038

/** Bleus clairs (pastel) pour rester lisibles sur le hero semi-transparent */
const LIQUID_LIGHT = {
  core: "radial-gradient(ellipse 85% 75% at 40% 35%, hsl(222 85% 88% / 0.58) 0%, hsl(214 90% 94% / 0.38) 48%, hsl(220 70% 96% / 0.18) 68%, transparent 76%)",
  main: [
    "radial-gradient(ellipse 90% 80% at 32% 28%, hsl(221 88% 86% / 0.62) 0%, hsl(214 92% 93% / 0.35) 52%, transparent 60%)",
    "radial-gradient(ellipse 70% 65% at 72% 62%, hsl(210 85% 90% / 0.48) 0%, transparent 55%)",
    "linear-gradient(145deg, hsl(var(--primary) / 0.12) 0%, hsl(222 80% 96% / 0.08) 100%)",
  ].join(", "),
} as const

/**
 * Goutte liquide bleu clair — suit le curseur (accueil). Visible derrière le hero grâce au fond semi-transparent.
 */
export function LiquidCursorBlob() {
  const mainRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const mainPos = useRef({ x: 0, y: 0 })
  const glowPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = mq.matches
    const onMq = () => {
      reducedMotionRef.current = mq.matches
    }
    mq.addEventListener("change", onMq)

    const init = () => {
      const x = window.innerWidth / 2
      const y = window.innerHeight / 2
      targetRef.current = { x, y }
      mainPos.current = { x, y }
      glowPos.current = { x, y }
    }
    init()

    const onMove = (e: MouseEvent) => {
      if (reducedMotionRef.current) return
      targetRef.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const t = targetRef.current
      if (!reducedMotionRef.current) {
        mainPos.current.x += (t.x - mainPos.current.x) * LERP_MAIN
        mainPos.current.y += (t.y - mainPos.current.y) * LERP_MAIN
        glowPos.current.x += (t.x - glowPos.current.x) * LERP_GLOW
        glowPos.current.y += (t.y - glowPos.current.y) * LERP_GLOW

        const m = mainPos.current
        const g = glowPos.current
        if (mainRef.current) {
          mainRef.current.style.transform = `translate3d(${m.x}px, ${m.y}px, 0) translate(-50%, -50%)`
        }
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${g.x}px, ${g.y}px, 0) translate(-50%, -50%)`
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("resize", init, { passive: true })
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      mq.removeEventListener("change", onMq)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("resize", init)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        ref={glowRef}
        className="absolute left-0 top-0 motion-reduce:hidden"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      >
        <div className="animate-liquid-wobble">
          <div
            className="h-[min(48vmin,340px)] w-[min(48vmin,340px)] animate-liquid-morph-b opacity-[0.32] blur-[36px] will-change-[border-radius] dark:opacity-[0.28]"
            style={{ background: LIQUID_LIGHT.core }}
          />
        </div>
      </div>

      <div
        ref={mainRef}
        className="absolute left-0 top-0 motion-reduce:hidden"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      >
        <div className="animate-liquid-wobble [animation-delay:2.5s] [animation-direction:alternate-reverse]">
          <div
            className="h-[min(64vmin,460px)] w-[min(64vmin,460px)] animate-liquid-morph-a opacity-[0.38] blur-[40px] will-change-[border-radius] dark:opacity-[0.34]"
            style={{ background: LIQUID_LIGHT.main }}
          />
        </div>
      </div>
    </div>
  )
}
