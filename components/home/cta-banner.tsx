"use client"

import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function CtaBanner() {
  useScrollAnimation()

  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="animate-on-scroll mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Prêt à renforcer vos compétences ?
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Choisissez la suite : écrire à un conseiller ou déposer directement votre demande
            d’inscription.
          </p>
        </div>

        {/* Deux formes cliquables : gauche = contact, droite = inscription */}
        <div className="relative overflow-hidden rounded-2xl border border-border shadow-xl md:min-h-[300px]">
          <div className="flex flex-col md:relative md:min-h-[300px] md:flex-row">
            {/* Forme gauche : inclinaison / trapèze — couleur secondaire (différente du primary) */}
            <Link
              href="/contact"
              className="group relative flex min-h-[200px] flex-1 flex-col items-center justify-center gap-4 bg-gradient-to-br from-secondary via-secondary to-muted px-8 py-12 text-center transition-[transform,filter,box-shadow] duration-300 hover:brightness-[1.03] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:absolute md:inset-y-0 md:left-0 md:w-[55%] md:py-0 md:text-left md:[clip-path:polygon(0_0,100%_0,72%_100%,0_100%)]"
              aria-label="Contacter un conseiller — aller à la page contact"
            >
              <div className="flex max-w-sm flex-col items-center gap-4 md:ml-8 md:items-start md:pr-[18%]">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/90 text-primary shadow-md ring-2 ring-background/50 transition-transform duration-300 group-hover:scale-110 group-hover:ring-primary/30">
                  <MessageCircle className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Besoin d’un échange ?
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
                    Contacter un conseiller
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Questions, devis ou parcours sur mesure : notre équipe vous répond.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Accéder au contact
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>

            {/* Forme droite : trapèze inversé — primary (déposer une demande) */}
            <Link
              href="/inscription"
              className="group relative flex min-h-[200px] flex-1 flex-col items-center justify-center gap-4 bg-gradient-to-bl from-primary via-primary to-primary/80 px-8 py-12 text-center text-primary-foreground shadow-inner transition-[transform,filter,box-shadow] duration-300 hover:brightness-[1.06] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:absolute md:inset-y-0 md:right-0 md:ml-auto md:w-[55%] md:py-0 md:text-right md:[clip-path:polygon(28%_0,100%_0,100%_100%,0_100%)]"
              aria-label="Déposer une demande — aller à la page inscription"
            >
              <div className="flex max-w-sm flex-col items-center gap-4 md:mr-8 md:items-end md:pl-[18%]">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15 text-primary-foreground ring-2 ring-primary-foreground/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:ring-primary-foreground/50">
                  <ArrowRight className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="md:text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/75">
                    Inscription
                  </span>
                  <h3 className="mt-1 text-xl font-bold sm:text-2xl">Déposer une demande</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/85">
                    Envoyez votre dossier en ligne pour démarrer votre parcours de formation.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground">
                  Continuer vers le formulaire
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
