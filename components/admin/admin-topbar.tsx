"use client"

import { useState } from "react"
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  LogOut,
  X,
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

interface AdminTopbarProps {
  collapsed: boolean
  onMobileToggle: () => void
}

export function AdminTopbar({ collapsed, onMobileToggle }: AdminTopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 transition-all duration-300",
        collapsed ? "md:pl-[92px]" : "md:pl-[284px]"
      )}
    >
      {/* Left: Mobile toggle + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className={cn(
          "relative hidden items-center sm:flex transition-all duration-200",
          searchFocused ? "w-80" : "w-64"
        )}>
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students, formations..."
            className="h-9 w-full rounded-lg border border-input bg-secondary/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="pointer-events-none absolute right-2.5 hidden select-none rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block">
            {"/"} 
          </kbd>
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-2">

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-border" />

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild suppressHydrationWarning>
            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-none text-foreground">Admin User</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">admin@apex.edu</p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              <span> <a href="/admin/profil">My Profile</a></span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              <span><a href="../admin/login">Logout</a></span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
