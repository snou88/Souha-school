import Link from "next/link";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import logo from "../public/image/image_w.png";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { sltIdentity, sltNav } from "@/lib/slt-content";

const quickLinks = [...sltNav.links, sltNav.cta];

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="Accueil"
            >
              <div className="w-50 h-20">
                <img src={logo.src} alt="SLT Logo" className="w-full h-full" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground"></span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-background/60 justify-center">
              {sltIdentity.description}
            </p>
            {/* Réseaux sociaux avec icônes */}
            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg transition-transform hover:scale-110 hover:text-blue-600"
                aria-label="Visiter notre page Facebook"
                style={{ fontSize: "2rem" }}
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg transition-transform hover:scale-110 hover:text-pink-500"
                aria-label="Visiter notre page TikTok"
                style={{ fontSize: "2rem" }}
              >
                <FaTiktok />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg transition-transform hover:scale-110 hover:text-blue-700"
                aria-label="Visiter notre page LinkedIn"
                style={{ fontSize: "2rem" }}
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-lg transition-transform hover:scale-110 hover:text-pink-500"
                aria-label="Visiter notre page Instagram"
                style={{ fontSize: "2rem" }}
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/40">
              Liens rapides
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

          {/* Identité */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/40">
              Établissement
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-background/70">
              <li className="font-medium text-background">{sltIdentity.officialName}</li>
              <li>{sltIdentity.objective}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/40">
              Contact
            </h3>

            <ul className="mt-4 flex flex-col gap-4">
              {/* Adresse */}
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-lg text-white transition-transform hover:scale-110 hover:text-blue-500" />
                <span className="text-sm text-background/70">
                  {sltIdentity.address}
                </span>
              </li>

              {/* Téléphone */}
              {sltIdentity.phones.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <FaPhoneAlt className="text-lg text-white transition-transform hover:scale-110 hover:text-green-500" />
                  <a
                    href={`tel:${p.replace(/[^\d+]/g, "")}`}
                    className="text-sm text-background/70 transition-colors hover:text-background"
                  >
                    {p}
                  </a>
                </li>
              ))}

              {/* Email */}
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-lg text-white transition-transform hover:scale-110 hover:text-red-500" />
                <Link
                  href="/contact"
                  className="text-sm text-background/70 transition-colors hover:text-background"
                >
                  Nous écrire via le formulaire de contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4  border-background/10  md:flex-row">
            <p className="text-xs text-background/40">
              {new Date().getFullYear()}{" "}
              <a
                href="https://snouportfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/70 transition-colors hover:text-background"
              >
                Réalisé par Ahmed Senouci
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
