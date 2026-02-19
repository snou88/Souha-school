import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FormationsContent } from "@/components/formations/formations-content"

export const metadata: Metadata = {
  title: "Formations",
  description:
    "Découvrez nos formations professionnelles: techniques, informatiques, transversales et programmes personnalisés.",
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
