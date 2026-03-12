"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useEffect, useState } from "react";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website?: string | null;
}

export default function PartnersSection() {
  useScrollAnimation();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(30);

  // Charger les partenaires depuis l'API
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partenaires');
        const data = await res.json();
        
        if (data.success && Array.isArray(data.data)) {
          // Filtrer les partenaires qui ont un logo
          const partnersWithLogo = data.data.filter((p: Partner) => p.logo_url);
          setPartners(partnersWithLogo);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des partenaires:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

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

  // Si pas de partenaires ou en chargement
  if (loading) {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-balance text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            Nos partenaires de confiance
          </h2>
          <div className="flex justify-center mt-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-balance text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            Nos partenaires de confiance
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-sm md:text-base lg:text-lg leading-relaxed text-gray-600 px-4">
            Nous collaborons avec des entreprises leaders dans leur secteur afin d'offrir à nos étudiants des opportunités concrètes et des parcours professionnels adaptés au monde réel.
          </p>
          <p className="mt-8 text-gray-500">Aucun partenaire pour le moment.</p>
        </div>
      </section>
    );
  }

  // Duplique le tableau pour un effet seamless (au moins 3 fois pour éviter les trous)
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
          {logosLoop.map((partner, i) => (
            <div
              key={`row1-${partner.id}-${i}`}
              className="flex items-center justify-center flex-shrink-0 w-28 sm:w-36 md:w-44 lg:w-48 h-16 sm:h-20 md:h-24 mx-4 sm:mx-6 md:mx-8 lg:mx-12 transition-transform duration-300 hover:scale-125"
            >
              {partner.logo_url ? (
                <a 
                  href={partner.website || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full h-full flex items-center justify-center"
                  title={partner.name}
                >
                  <Image
                    src={partner.logo_url}
                    alt={partner.name}
                    width={120}
                    height={40}
                    className="object-contain w-20 sm:w-24 md:w-28 lg:w-32 max-h-12 md:max-h-16"
                    priority={i < 10}
                  />
                </a>
              ) : null}
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
            {logosLoop.map((partner, i) => (
              <div
                key={`row2-${partner.id}-${i}`}
                className="flex items-center justify-center flex-shrink-0 w-28 sm:w-36 md:w-44 lg:w-48 h-16 sm:h-20 md:h-24 mx-4 sm:mx-6 md:mx-8 lg:mx-12 transition-transform duration-300 hover:scale-125"
              >
                {partner.logo_url ? (
                  <a 
                    href={partner.website || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full h-full flex items-center justify-center"
                    title={partner.name}
                  >
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      width={120}
                      height={40}
                      className="object-contain w-20 sm:w-24 md:w-28 lg:w-32 max-h-12 md:max-h-16"
                    />
                  </a>
                ) : null}
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