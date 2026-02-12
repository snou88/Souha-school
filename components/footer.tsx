import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import logo from "../public/image/image_w.png";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/formations", label: "Programs" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/inscription", label: "Enroll Now" },
];

const programs = [
  "Web Development",
  "Data Science",
  "Digital Marketing",
  "UX/UI Design",
  "Cybersecurity",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="SLT Home"
            >
              <div className="w-50 h-20">
                <img src={logo.src} alt="SLT Logo" className="w-full h-full" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground"></span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-background/60">
              Empowering professionals with industry-leading training programs
              since 2015. Your future starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/40">
              Quick Links
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/40">
              Programs
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {programs.map((p) => (
                <li key={p}>
                  <Link
                    href="/formations"
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/40">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-background/40" />
                <span className="text-sm text-background/70">
                  123 Education Blvd, Suite 400
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-background/40" />
                <a
                  href="tel:+12125551234"
                  className="text-sm text-background/70 transition-colors hover:text-background"
                >
                  +1 (212) 555-1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-background/40" />
                <a
                  href="mailto:info@apexacademy.com"
                  className="text-sm text-background/70 transition-colors hover:text-background"
                >
                  info@apexacademy.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
          <p className="text-xs text-background/40">
            {new Date().getFullYear()}{" "}
            <a href="https://snouportfolio.vercel.app/">
              Created by Ahmed senouci
            </a>
          </p>
          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
            <p className="text-xs text-background/40">
              {new Date().getFullYear()}{" "}
              <a href="https://snouportfolio.vercel.app/">
                Created by Ahmed Senouci
              </a>
            </p>

            {/* Réseaux sociaux avec icônes */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg transition-transform hover:scale-110 hover:text-blue-600"
                aria-label="Visit our Facebook page"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg transition-transform hover:scale-110 hover:text-blue-400"
                aria-label="Visit our Twitter page"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg transition-transform hover:scale-110 hover:text-blue-700"
                aria-label="Visit our LinkedIn page"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg transition-transform hover:scale-110 hover:text-pink-500"
                aria-label="Visit our Instagram page"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
