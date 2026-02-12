"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const partners = [
  "/image/image.png",
  "/image/image_w.png",
  "/image/image.png",
  "/image/image_w.png",
  "/image/image.png",
]

export default function PartnersSection() {
  useScrollAnimation()

  // Duplique le tableau pour l'animation seamless
  const logosLoop = [...partners, ...partners]

  return (
    <section className="relative py-24 bg-background">
      {/* Title */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Our Trusted Partners
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          We collaborate with industry-leading companies to provide real-world
          opportunities and career pathways for our students.
        </p>
      </div>

      {/* Marquee wrapper */}
      <div className="mt-16 relative w-full overflow-hidden">
        {/* Row 1: left → right */}
        <div className="w-full overflow-hidden">
          <div className="marquee flex">
            {logosLoop.map((src, i) => (
              <div
                key={`r1-${i}`}
                className="flex items-center justify-center flex-shrink-0 min-w-[160px] mx-8 opacity-70 hover:opacity-100 hover:scale-105 transition duration-300"
              >
                <Image
                  src={src}
                  alt={`partner ${i}`}
                  width={160}
                  height={56}
                  className="object-contain grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: right → left */}
        <div className="w-full overflow-hidden mt-8">
          <div className="marquee marquee-reverse flex">
            {logosLoop.map((src, i) => (
              <div
                key={`r2-${i}`}
                className="flex items-center justify-center flex-shrink-0 min-w-[160px] mx-8 opacity-70 hover:opacity-100 hover:scale-105 transition duration-300"
              >
                <Image
                  src={src}
                  alt={`partner ${i}`}
                  width={160}
                  height={56}
                  className="object-contain grayscale hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}