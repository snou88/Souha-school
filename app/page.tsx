import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { FeaturedPrograms } from "@/components/home/featured-programs"
import { CtaBanner } from "@/components/home/cta-banner"
import PartnersSection from "@/components/home/partners"
import FormationCard from '@/components/formation-card'
import { getFormations } from '@/lib/formations'

export default async function HomePage() {
  // Server-side: fetch formations
  const formations = await getFormations()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <section style={{ padding: '2rem' }}>
          <h2>Available Formations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {formations.map((f: any) => (
              <FormationCard key={f.id} formation={f} />
            ))}
          </div>
        </section>

        <WhyChooseUs />
        <FeaturedPrograms />
        <CtaBanner />
        <PartnersSection />
      </main>
      <Footer />
    </>
  )
}
