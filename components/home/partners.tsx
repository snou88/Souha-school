"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const partners = [
  "/image/image.png",
  "/image/image.png",
  "/image/image.png",
  "/image/image.png",
  "/image/image.png",
]

export default function PartnersSection() {
  useScrollAnimation()

  // Duplique le tableau plusieurs fois pour un effet seamless plus fluide
  const logosLoop = [...partners, ...partners, ...partners]

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Title */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-balance text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Our Trusted Partners
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-gray-600">
          We collaborate with industry-leading companies to provide real-world
          opportunities and career pathways for our students. Our partnerships
          drive innovation and excellence in education.
        </p>
      </div>

      {/* Infinite Scrolling Logos */}
      <div className="relative mt-16 w-full">
        {/* Row 1: Left to Right */}
        <div className="flex animate-marquee">
          {logosLoop.map((src, i) => (
            <div
              key={`r1-${i}`}
              className="flex items-center justify-center flex-shrink-0 w-48 h-24 mx-12 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-110 hover:-translate-y-2"
            >
              <Image
                src={src}
                alt={`Partner ${i + 1}`}
                width={140}
                height={40}
                className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Row 2: Right to Left */}
        <div className="flex animate-marquee-reverse mt-12">
          {logosLoop.map((src, i) => (
            <div
              key={`r2-${i}`}
              className="flex items-center justify-center flex-shrink-0 w-48 h-24 mx-12 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-110 hover:-translate-y-2"
            >
              <Image
                src={src}
                alt={`Partner ${i + 1}`}
                width={140}
                height={40}
                className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action or Additional Element for Professionalism */}
      <div className="relative mt-16 mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          Join Our Network of Innovators
        </p>
        <button className="mt-4 px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-primary/90 transition-colors duration-300">
          <a href="inscription">Become a Partner</a>
        </button>
      </div>

      {/* Custom CSS for Infinite Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes marquee-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
      `}</style>
    </section>
  )
}