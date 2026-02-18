import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { FeaturedPrograms } from "@/components/home/featured-programs"
import { CtaBanner } from "@/components/home/cta-banner"
import PartnersSection from "@/components/home/partners"
import FormationCard from '@/components/formation-card'
// import { getFormations } from '@/lib/formations'

export default async function HomePage() {
  // Server-side: fetch formations
  // const formations = await getFormations()
  // static data for now
  const formations = [
    { id: 1, title: 'Full Stack Web Development', description: 'Learn to build modern web applications using React, Node.js, and more.', capacity: 20, start_date: '2024-07-01' },
    { id: 2, title: 'Data Science with Python', description: 'Master data analysis, visualization, and machine learning with Python.', capacity: 15, start_date: '2024-08-15' },
    { id: 3, title: 'UI/UX Design Fundamentals', description: 'Design user-friendly interfaces and experiences with Figma and Adobe XD.', capacity: 10, start_date: '2024-09-10' },
  ]
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
