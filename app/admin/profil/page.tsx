"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react"
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
import { useToast } from "@/components/ui/use-toast"

type Admin = {
  id: string  // Changé de number à string pour UUID
  name: string
  email: string
  role?: string
  created_at?: string
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
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

  // Charger les admins depuis l'API
  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin")  // Changé de "admins" à "admin"
      const data = await res.json()
      if (data.success) {
        setAdmins(data.data)
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
      const res = await fetch("/api/admin", {  // Changé de "admins" à "admin"
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const result = await res.json()
      
      if (result.success) {
        setAdmins((prev) => [...prev, result.data])
        setForm({ name: "", email: "", password: "" })
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
      const res = await fetch("/api/admin", {  // Changé de "admins" à "admin"
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
        setForm({ name: "", email: "", password: "" })
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
      const res = await fetch("/api/admin", {  // Changé de "admins" à "admin"
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Admins</h1>
          <p className="text-muted-foreground text-sm">
            Gérez les accès administrateurs
          </p>
        </div>

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
              <DialogTitle>Ajouter un Admin</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                placeholder="Nom complet"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAdd(false)}>
                Annuler
              </Button>
              <Button onClick={handleAdd}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Admin List */}
      <div className="grid gap-4">
        {admins.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun administrateur</p>
              <p className="text-sm mt-1">Commencez par ajouter un administrateur</p>
            </CardContent>
          </Card>
        ) : (
          admins.map((admin) => (
            <Card key={admin.id} className="hover:shadow-md transition">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" />
                    <h3 className="font-semibold">{admin.name}</h3>
                    {admin.role && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {admin.role}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {admin.email}
                  </p>
                  {admin.created_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Créé le {new Date(admin.created_at).toLocaleDateString()}
                    </p>
                  )}
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
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier Admin</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder="Nom complet"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Laissez le mot de passe vide pour ne pas le modifier
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground py-4">
            Êtes-vous sûr de vouloir supprimer l'administrateur <strong>{selectedAdmin?.name}</strong> ?
            <br />
            Cette action est irréversible.
          </p>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}