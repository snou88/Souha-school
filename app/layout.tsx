import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { sltIdentity } from "@/lib/slt-content"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: `${sltIdentity.officialName} | Centre de formation professionnelle`,
    template: `%s | ${sltIdentity.officialName}`,
  },
  description:
    sltIdentity.description,
}

export const viewport: Viewport = {
  themeColor: "#324376",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
