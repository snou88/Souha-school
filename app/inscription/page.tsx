import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { InscriptionForm } from "@/components/inscription/inscription-form"

export const metadata: Metadata = {
  title: "Enroll",
  description:
    "Apply to SLT Academy. Complete your enrollment in minutes and start your professional training journey.",
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
