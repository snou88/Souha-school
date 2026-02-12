import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FormationsContent } from "@/components/formations/formations-content"

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore Apex Academy's professional training programs in web development, data science, design, marketing, and more.",
}

export default function FormationsPage() {
  return (
    <>
      <Navbar />
      <main>
        <FormationsContent />
      </main>
      <Footer />
    </>
  )
}
