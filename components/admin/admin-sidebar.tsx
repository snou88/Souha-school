"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import logo from "@/public/image/image.png"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  GraduationCap,
  ChevronLeft,
  BookUser,
  Archive,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LogoutButton } from "@/app/admin/components/LogoutButton"

const mainNav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/students", label: "Apprenants", icon: Users },
  { href: "/admin/formations", label: "Formations", icon: BookOpen },
  { href: "/admin/inscriptions", label: "Inscriptions", icon: ClipboardList },
  { href: "/admin/Category", label: "Catégories", icon: Archive },
  { href: "/admin/partenaires", label: "Partenaires", icon: BookUser },
]

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  // Fermer le menu mobile quand on redimensionne
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileOpen])

  return (
    <TooltipProvider delayDuration={0}>
      {/* Desktop Sidebar - Version Blanche */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden md:flex flex-col bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-gray-200 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-base font-bold tracking-tight text-gray-900 whitespace-nowrap">
                <img src={logo.src} alt="SLT Logo" className="h-8 w-auto object-contain" />
              </span>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={onToggle}
              className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Réduire le menu"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Bouton pour déployer quand réduit */}
        {collapsed && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-[22px] z-40 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm hover:text-gray-600 transition-colors"
            aria-label="Déployer le menu"
          >
            <ChevronLeft className="h-3 w-3 rotate-180" />
          </button>
        )}

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="flex flex-col gap-1">
            {!collapsed && (
              <span className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Menu principal
              </span>
            )}
            {mainNav.map((item) => {
              const active = isActive(item.href)
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        collapsed ? "justify-center" : "justify-start",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                      <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "text-gray-500")} />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="bg-white border border-gray-200 shadow-md text-gray-900">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-3">
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center">
                  <LogoutButton />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-white border border-gray-200 shadow-md text-gray-900">
                Déconnexion
              </TooltipContent>
            </Tooltip>
          ) : (
            <LogoutButton />
          )}
        </div>
      </aside>

      {/* Mobile Sidebar - Version Blanche */}
      <>
        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
        
        {/* Sidebar mobile */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 ease-in-out md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header mobile */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
            <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-gray-900">
                <img src={logo.src} alt="SLT Logo" className="h-8 w-auto object-contain" />
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation mobile */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <div className="flex flex-col gap-1">
              <span className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Menu principal
              </span>
              {mainNav.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", active ? "text-primary" : "text-gray-500")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Logout mobile */}
          <div className="border-t border-gray-200 p-4">
            <LogoutButton />
          </div>
        </aside>
      </>

      {/* Bouton menu mobile */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg md:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </TooltipProvider>
  )
}