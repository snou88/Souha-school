import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { InscriptionForm } from "@/components/inscription/inscription-form"

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Déposez une demande d’inscription et sélectionnez la formation souhaitée.",
}

export default function InscriptionPage() {
  return (
    <>
      <Navbar />
      <main>
        <InscriptionForm />
      </main>
      <Footer />
    </>
  )
}
