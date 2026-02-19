"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ShieldCheck, 
  Search, 
  RefreshCw,
  Mail,
  Calendar,
  UserCog,
  MoreVertical,
  Filter,
  X,
  Eye,
  EyeOff
} from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
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
    let filtered = admins

    // Filtre recherche
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        admin => 
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre rôle
    if (roleFilter !== "all") {
      filtered = filtered.filter(admin => (admin.role || 'admin') === roleFilter)
    }

    setFilteredAdmins(filtered)
  }, [searchTerm, roleFilter, admins])

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
    setShowPassword(false)
    setShowEditPassword(false)
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

    if (form.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
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
      const payload: any = { 
        id: selectedAdmin.id, 
        name: form.name, 
        email: form.email 
      }
      
      // Si un nouveau mot de passe est fourni, l'ajouter au payload
      if (form.password && form.password.length > 0) {
        if (form.password.length < 6) {
          toast({
            title: "Erreur",
            description: "Le mot de passe doit contenir au moins 6 caractères",
            variant: "destructive",
          })
          return
        }
        payload.password = form.password
      }

      const res = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Chargement des administrateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Gestion des Admins</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les accès administrateurs ({admins.length} au total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchAdmins}
            title="Rafraîchir"
            className="h-9 w-9"
          >
            <RefreshCw size={16} />
          </Button>

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="gap-2 h-9">
                <Plus size={16} />
                <span className="hidden sm:inline">Ajouter Admin</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 caractères
                  </p>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => {
                  resetForm()
                  setOpenAdd(false)
                }} className="w-full sm:w-auto">
                  Annuler
                </Button>
                <Button onClick={handleAdd} className="w-full sm:w-auto">Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres */}
      <div className="space-y-3">
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou email..."
            className="pl-9 pr-20 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Bouton filtres mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 sm:hidden"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <Filter className="h-4 w-4" />
          </Button>

          {/* Filtre rôle desktop */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden sm:block">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-8 w-32 border-0 bg-transparent focus:ring-0">
                <SelectValue placeholder="Tous les rôles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtres mobile */}
        {mobileFiltersOpen && (
          <Card className="sm:hidden">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Filtres</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Rôle</label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tous les rôles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Liste des admins */}
      <div className="grid gap-3 sm:gap-4">
        {filteredAdmins.length === 0 ? (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-base sm:text-lg font-medium">
                {searchTerm ? "Aucun résultat trouvé" : "Aucun administrateur"}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {searchTerm 
                  ? "Essayez d'autres termes de recherche" 
                  : "Commencez par ajouter un administrateur"}
              </p>
              {!searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setOpenAdd(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un admin
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAdmins.map((admin) => (
            <Card key={admin.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4 sm:p-5">
                {/* Version mobile */}
                <div className="sm:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {admin.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{admin.name}</h3>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            {admin.role || 'Admin'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => {
                          setSelectedAdmin(admin)
                          setForm({ name: admin.name, email: admin.email, password: "" })
                          setOpenEdit(true)
                        }}>
                          <Pencil className="h-3.5 w-3.5 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedAdmin(admin)
                            setOpenDelete(true)
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {admin.created_at && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Inscrit le {new Date(admin.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Version desktop */}
                <div className="hidden sm:flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary text-base">
                        {admin.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base">{admin.name}</h3>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {admin.role || 'Admin'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{admin.email}</span>
                        </div>
                        
                        {admin.created_at && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(admin.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedAdmin(admin)
                        setForm({ name: admin.name, email: admin.email, password: "" })
                        setOpenEdit(true)
                      }}
                    >
                      <Pencil size={14} className="mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedAdmin(admin)
                        setOpenDelete(true)
                      }}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Supprimer
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
        <DialogContent className="sm:max-w-md">
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Nouveau mot de passe (optionnel)</label>
              <div className="relative">
                <Input
                  type={showEditPassword ? "text" : "password"}
                  placeholder="Laissez vide pour conserver l'actuel"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 6 caractères, laissez vide pour ne pas modifier
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => {
              resetForm()
              setSelectedAdmin(null)
              setOpenEdit(false)
            }} className="w-full sm:w-auto">
              Annuler
            </Button>
            <Button onClick={handleEdit} className="w-full sm:w-auto">Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Êtes-vous sûr de vouloir supprimer l'administrateur <strong>{selectedAdmin?.name}</strong> ?</p>
              <p className="text-destructive font-medium text-sm">
                Cette action est irréversible.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}