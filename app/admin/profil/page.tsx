"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ShieldCheck, Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Admin = {
  id: string
  name: string
  email: string
  role?: string
  created_at?: string
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const { toast } = useToast()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Charger les admins
  useEffect(() => {
    fetchAdmins()
  }, [])

  // Filtrer les admins
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAdmins(admins)
    } else {
      const filtered = admins.filter(
        admin => 
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredAdmins(filtered)
    }
  }, [searchTerm, admins])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin")
      const data = await res.json()
      if (data.success) {
        setAdmins(data.data)
        setFilteredAdmins(data.data)
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Impossible de charger les administrateurs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ name: "", email: "", password: "" })
  }

  // Ajouter Admin
  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont requis",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const result = await res.json()
      
      if (result.success) {
        setAdmins((prev) => [result.data, ...prev])
        resetForm()
        setOpenAdd(false)
        toast({
          title: "Succès",
          description: "Administrateur ajouté avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de l'ajout",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error)
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      })
    }
  }

  // Modifier Admin
  const handleEdit = async () => {
    if (!selectedAdmin) return

    try {
      const res = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: selectedAdmin.id, 
          name: form.name, 
          email: form.email 
        })
      })
      const result = await res.json()
      
      if (result.success) {
        setAdmins((prev) => prev.map(a => a.id === selectedAdmin.id ? result.data : a))
        setOpenEdit(false)
        setSelectedAdmin(null)
        resetForm()
        toast({
          title: "Succès",
          description: "Administrateur modifié avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la modification",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      })
    }
  }

  // Supprimer Admin
  const handleDelete = async () => {
    if (!selectedAdmin) return

    try {
      const res = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedAdmin.id })
      })
      const result = await res.json()
      
      if (result.success) {
        setAdmins((prev) => prev.filter(a => a.id !== selectedAdmin.id))
        setOpenDelete(false)
        setSelectedAdmin(null)
        toast({
          title: "Succès",
          description: "Administrateur supprimé avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la suppression",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast({
        title: "Erreur",
        description: "Erreur de connexion au serveur",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Chargement des administrateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Admins</h1>
          <p className="text-muted-foreground text-sm">
            Gérez les accès administrateurs ({admins.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchAdmins}
            title="Rafraîchir"
          >
            <RefreshCw size={16} />
          </Button>

          {/* Add Admin */}
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Ajouter Admin
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un administrateur</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom complet</label>
                  <Input
                    placeholder="Jean Dupont"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    placeholder="admin@exemple.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mot de passe</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  resetForm()
                  setOpenAdd(false)
                }}>
                  Annuler
                </Button>
                <Button onClick={handleAdd}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou email..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Admin List */}
      <div className="grid gap-4">
        {filteredAdmins.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {searchTerm ? "Aucun résultat" : "Aucun administrateur"}
              </p>
              <p className="text-sm mt-1">
                {searchTerm 
                  ? "Essayez d'autres termes de recherche" 
                  : "Commencez par ajouter un administrateur"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAdmins.map((admin) => (
            <Card key={admin.id} className="hover:shadow-md transition">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {admin.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{admin.name}</h3>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {admin.role || 'Admin'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {admin.email}
                      </p>
                      {admin.created_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Inscrit le {new Date(admin.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* Edit */}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setSelectedAdmin(admin)
                        setForm({
                          name: admin.name,
                          email: admin.email,
                          password: "",
                        })
                        setOpenEdit(true)
                      }}
                    >
                      <Pencil size={16} />
                    </Button>

                    {/* Delete */}
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setSelectedAdmin(admin)
                        setOpenDelete(true)
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'administrateur</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom complet</label>
              <Input
                placeholder="Jean Dupont"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                placeholder="admin@exemple.com"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Pour modifier le mot de passe, utilisez la fonction de réinitialisation.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm()
              setSelectedAdmin(null)
              setOpenEdit(false)
            }}>
              Annuler
            </Button>
            <Button onClick={handleEdit}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'administrateur <strong>{selectedAdmin?.name}</strong> ?
              <br />
              <span className="text-destructive font-medium">
                Cette action est irréversible.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}