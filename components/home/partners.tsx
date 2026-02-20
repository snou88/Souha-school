"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useEffect, useState } from "react";

const partners = [
  "/partenaires/1.png",
  "/partenaires/3.png",
  "/partenaires/4.png",
  "/partenaires/5.png",
  "/partenaires/6.png",
  "/partenaires/7.png",
  "/partenaires/8.png",
  "/partenaires/9.png",
  "/partenaires/10.png",
];

export default function PartnersSection() {
  useScrollAnimation();
  const [animationSpeed, setAnimationSpeed] = useState(30);

  // Ajuster la vitesse d'animation selon la largeur d'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setAnimationSpeed(20); // Plus rapide sur mobile
      } else if (window.innerWidth < 1024) {
        setAnimationSpeed(25);
      } else {
        setAnimationSpeed(30); // Plus lent sur desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Duplique le tableau pour un effet seamless
  const logosLoop = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Titre */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-balance text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
          Nos partenaires de confiance
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-sm md:text-base lg:text-lg leading-relaxed text-gray-600 px-4">
          Nous collaborons avec des entreprises leaders dans leur secteur afin d'offrir à nos étudiants des opportunités concrètes et des parcours professionnels adaptés au monde réel.
        </p>
      </div>

      {/* Conteneur des logos avec dégradés */}
      <div className="relative mt-12 md:mt-16 w-full before:absolute before:left-0 before:top-0 before:bottom-0 before:w-16 md:before:w-32 before:bg-gradient-to-r before:from-white before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-16 md:after:w-32 after:bg-gradient-to-l after:from-white after:to-transparent after:z-10">
        
        {/* Ligne 1 : défilement gauche à droite */}
        <div 
          className="flex"
          style={{
            animation: `marquee ${animationSpeed}s linear infinite`,
            width: 'fit-content'
          }}
        >
          {logosLoop.map((src, i) => (
            <div
              key={`row1-${i}`}
              className="flex items-center justify-center flex-shrink-0 w-28 sm:w-36 md:w-44 lg:w-48 h-16 sm:h-20 md:h-24 mx-4 sm:mx-6 md:mx-8 lg:mx-12 transition-transform duration-300 hover:scale-125"
            >
              <Image
                src={src}
                alt={`Partner ${i + 1}`}
                width={120}
                height={40}
                className="object-contain w-20 sm:w-24 md:w-28 lg:w-32 max-h-12 md:max-h-16"
                priority={i < 10}
              />
            </div>
          ))}
        </div>

        {/* Ligne 2 : défilement droite à gauche */}
        <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-12">
          <div 
            className="flex"
            style={{
              animation: `marquee-reverse ${animationSpeed}s linear infinite`,
              width: 'fit-content'
            }}
          >
            {logosLoop.map((src, i) => (
              <div
                key={`row2-${i}`}
                className="flex items-center justify-center flex-shrink-0 w-28 sm:w-36 md:w-44 lg:w-48 h-16 sm:h-20 md:h-24 mx-4 sm:mx-6 md:mx-8 lg:mx-12 transition-transform duration-300 hover:scale-125"
              >
                <Image
                  src={src}
                  alt={`Partner ${i + 1}`}
                  width={120}
                  height={40}
                  className="object-contain w-20 sm:w-24 md:w-28 lg:w-32 max-h-12 md:max-h-16"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative mt-12 md:mt-16 mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">
          Rejoignez notre réseau d'innovateurs
        </p>
        <a 
          href="/inscription" 
          className="inline-block mt-4 px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:bg-primary/90 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Devenez partenaire
        </a>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        @keyframes marquee-reverse {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }

        @media (max-width: 640px) {
          div[style*="animation"] {
            animation-duration: 20s !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          div[style*="animation"] {
            animation-duration: 25s !important;
          }
        }
      `}</style>
    </section>
  );
}