import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactContent } from "@/components/contact/contact-content"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez-nous pour toute demande d’information sur nos formations, séminaires, team building et services d’accompagnement.",
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactContent />
      </main>
      <Footer />
    </>
  )
}
