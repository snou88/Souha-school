"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ChevronDown,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "@/app/admin/components/LogoutButton"
import Link from "next/link"

interface AdminTopbarProps {
  collapsed: boolean
  onMobileToggle?: () => void
}

interface AdminData {
  id: string
  name: string
  email: string
  role: string
}

export function AdminTopbar({ collapsed, onMobileToggle }: AdminTopbarProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch("/api/admin/login")
        const data = await res.json()
        if (data.authenticated && data.admin) {
          setAdmin(data.admin)
        }
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bonjour"
    if (hour < 18) return "Bon après-midi"
    return "Bonsoir"
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 md:px-6 transition-all duration-300",
        collapsed ? "md:pl-[92px]" : "md:pl-[284px]"
      )}
    >
      {/* Left section avec bouton burger et message */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Bouton burger moderne - aligné verticalement */}
        {onMobileToggle && (
          <button
            onClick={onMobileToggle}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl hover:bg-secondary/80 transition-all duration-200"
            aria-label="Menu"
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span className="block w-5 h-0.5 bg-foreground/60 rounded-full transition-all duration-300 group-hover:w-6 group-hover:bg-primary"></span>
              <span className="block w-5 h-0.5 bg-foreground/60 rounded-full transition-all duration-300 group-hover:w-5 group-hover:bg-primary"></span>
              <span className="block w-5 h-0.5 bg-foreground/60 rounded-full transition-all duration-300 group-hover:w-4 group-hover:bg-primary"></span>
            </div>
          </button>
        )}

        {/* Message de bienvenue sur mobile - une seule ligne */}
        {!loading && admin && (
          <div className="md:hidden flex items-center h-9 gap-1 relative top-[4px] left-[50px]">
            <span className="text-xl text-muted-foreground whitespace-nowrap">
              {getWelcomeMessage()},
            </span>
            <span className="text-xl font-medium text-foreground whitespace-nowrap">
              {admin.name.split(" ")[0]}
            </span>
          </div>
        )}

      </div>

      {/* Right: Welcome message desktop + Profile */}
      <div className="flex items-center gap-4">
        {/* Message de bienvenue desktop (complet) */}
        {!loading && admin && (
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-foreground">
              {getWelcomeMessage()}, {admin.name}
            </p>
            <p className="text-[11px] text-muted-foreground">{admin.email}</p>
          </div>
        )}

        {/* Profile */}
        {!mounted ? (
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary group"
            aria-label="Profil"
          >
            <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {admin ? getInitials(admin.name) : "AD"}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary group">
                <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {admin ? getInitials(admin.name) : "AD"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="md:hidden px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">{admin?.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{admin?.email}</p>
                <p className="text-[10px] text-muted-foreground mt-1 capitalize">{admin?.role}</p>
              </div>
              <DropdownMenuItem asChild className="gap-2">
                <Link href="/admin/profil">
                  <User className="h-4 w-4" />
                  <span>Mon profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="p-0">
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}