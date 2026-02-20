import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about/about-content"
import { ProblemsSolutions } from "@/components/about/problems-solutions"
import { TrainingOverview } from "@/components/about/training-overview"
import { SeminarsTeamBuilding } from "@/components/about/seminars-team-building"

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Présentation de Souha School OF Languages and Training, établissement privé agréé spécialisé dans la formation professionnelle.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutContent />
        <ProblemsSolutions />
        <TrainingOverview />
        <SeminarsTeamBuilding />
      </main>
      <Footer />
    </>
  )
}
