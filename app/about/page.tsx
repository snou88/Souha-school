import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about/about-content"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Apex Academy's mission, values, and the team behind our world-class professional training programs.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}
