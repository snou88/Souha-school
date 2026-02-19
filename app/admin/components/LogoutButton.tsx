"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        // Rediriger vers la page login (hors admin)
        router.push("/login")  // ← Changé de "/admin/login" à "/login"
        router.refresh()
      } else {
        console.error("Erreur lors de la déconnexion")
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="w-full justify-start gap-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </Button>
  )
}