"use client"

import { useState } from "react"
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

type Admin = {
  id: number
  name: string
  email: string
  password: string
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 1,
      name: "Ahmed Senouci",
      email: "admin@email.com",
      password: "123456",
    },
    {
      id: 2,
      name: "Karim Ali",
      email: "karim@email.com",
      password: "123456",
    },
  ])

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Ajouter Admin
  const handleAdd = () => {
    if (!form.name || !form.email || !form.password) return

    const newAdmin: Admin = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password,
    }

    setAdmins([...admins, newAdmin])
    setForm({ name: "", email: "", password: "" })
    setOpenAdd(false)
  }

  // Modifier Admin (sans toucher au password)
  const handleEdit = () => {
    if (!selectedAdmin) return

    setAdmins(
      admins.map((admin) =>
        admin.id === selectedAdmin.id
          ? { ...admin, name: form.name, email: form.email }
          : admin
      )
    )

    setOpenEdit(false)
  }

  // Supprimer Admin
  const handleDelete = () => {
    if (!selectedAdmin) return
    setAdmins(admins.filter((admin) => admin.id !== selectedAdmin.id))
    setOpenDelete(false)
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
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button onClick={handleAdd}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Admin List */}
      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id} className="hover:shadow-md transition">
            <CardContent className="p-5 flex justify-between items-center">

              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  <h3 className="font-semibold">{admin.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {admin.email}
                </p>
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
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier Admin</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <Input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button onClick={handleEdit}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer Admin</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground py-4">
            Êtes-vous sûr de vouloir supprimer cet administrateur ?
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
