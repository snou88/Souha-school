import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Apex Academy | Professional Training School",
    template: "%s | Apex Academy",
  },
  description:
    "Build your future with professional training programs. Apex Academy offers industry-leading courses designed to accelerate your career.",
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
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
