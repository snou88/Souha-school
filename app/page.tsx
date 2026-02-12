import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { FeaturedPrograms } from "@/components/home/featured-programs"
import { Testimonials } from "@/components/home/testimonials"
import { CtaBanner } from "@/components/home/cta-banner"
import PartnersSection from "@/components/home/partners"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <WhyChooseUs />
        <FeaturedPrograms />
        <Testimonials />
        <CtaBanner />
        <PartnersSection />
      </main>
      <Footer />
    </>
  )
}
