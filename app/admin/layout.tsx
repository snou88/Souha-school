"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // récupère le pathname côté client
  const pathname = usePathname() || ""

  // si true -> on cache la sidebar/topbar (utile pour /admin/login par ex.)
  const hideLayout = pathname.startsWith("/admin/login")

  // si tu veux exclure d'autres routes, tu peux élargir la condition, ex:
  // const hideLayout = ["/admin/login", "/admin/another"].some(p => pathname.startsWith(p))

  // --- Si on cache tout (ex: page login) on affiche juste children ---
  if (hideLayout) {
    return <div className="min-h-screen">{children}</div>
  }

  // --- Layout admin normal ---
  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 h-full w-[280px] animate-in slide-in-from-left duration-300">
            <AdminSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 z-50 flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "md:ml-[68px]" : "md:ml-[260px]"
        )}
      >
        <AdminTopbar collapsed={collapsed} onMobileToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
