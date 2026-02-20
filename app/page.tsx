import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { CtaBanner } from "@/components/home/cta-banner"
import PartnersSection from "@/components/home/partners"
import FormationCard from '@/components/formation-card'
// import { getFormations } from '@/lib/formations'

export default async function HomePage() {
  // Server-side: fetch formations
  // const formations = await getFormations()
  // static data for now
  const formations = [
    { id: 1, title: 'Formation technique', description: 'Parcours axés sur les compétences métiers et l’opérationnel.', capacity: 20, start_date: '2026-03-01' },
    { id: 2, title: 'Formation informatique', description: 'Compétences numériques, outils et bonnes pratiques adaptées à votre contexte.', capacity: 15, start_date: '2026-06-15' },
    { id: 3, title: 'Programme sur mesure', description: 'Conception de parcours flexibles selon vos enjeux et objectifs.', capacity: 10, start_date: '2026-09-10' },
  ]
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Nos formations professionnelles
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Des parcours adaptés à vos besoins
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Formations de courte, moyenne et longue durée, en présentiel ou en formats adaptés, avec un accompagnement structuré.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {formations.map((f: any) => (
                <FormationCard key={f.id} formation={f} />
              ))}
            </div>
          </div>
        </section>

        <WhyChooseUs />
        <CtaBanner />
        <PartnersSection />
      </main>
      <Footer />
    </>
  )
}
