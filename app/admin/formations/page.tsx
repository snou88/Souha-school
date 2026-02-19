"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Clock,
  BookOpen,
  Users,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface Category {
  id: string
  name: string
  slug: string
  status: string
}

interface Formation {
  id: string
  name: string
  description: string | null
  duration: string
  status: "Active" | "Draft" | "Archived"
  category_id: string | null
  categories: Category | null
  created_at: string
  updated_at: string
  student_count?: number
}

interface FormData {
  name: string
  category_id: string
  duration: string
  description: string
  status: "Active" | "Draft"
}

const statusConfig = {
  Active: {
    label: "Actif",
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
  Draft: {
    label: "Brouillon",
    color: "bg-warning/10 text-warning border-warning/20",
    icon: AlertCircle,
  },
  Archived: {
    label: "Archivé",
    color: "bg-muted text-muted-foreground border-border",
    icon: XCircle,
  },
}

const categoryColors: Record<string, { bg: string; text: string; light: string }> = {
  Development: { bg: "bg-blue-500", text: "text-blue-500", light: "bg-blue-50" },
  Data: { bg: "bg-purple-500", text: "text-purple-500", light: "bg-purple-50" },
  Design: { bg: "bg-pink-500", text: "text-pink-500", light: "bg-pink-50" },
  Infrastructure: { bg: "bg-amber-500", text: "text-amber-500", light: "bg-amber-50" },
  Security: { bg: "bg-red-500", text: "text-red-500", light: "bg-red-50" },
}

// Fonction pour formater la description en liste
const formatDescription = (description: string | null) => {
  if (!description) return []
  return description.split('\n').filter(line => line.trim() !== '')
}

export default function FormationsAdminPage() {
  const [formations, setFormations] = useState<Formation[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Formation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null)
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<FormData>({ 
    name: "", 
    category_id: "", 
    duration: "", 
    description: "",
    status: "Draft"
  })

  // Charger les formations et catégories
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch formations
      const formationsRes = await fetch('/api/formations')
      const formationsResult = await formationsRes.json()
      
      // Fetch categories
      const categoriesRes = await fetch('/api/categories')
      const categoriesResult = await categoriesRes.json()
      
      if (formationsResult.success) {
        // Récupérer les étudiants pour compter les inscriptions
        const studentsRes = await fetch('/api/students')
        const studentsResult = await studentsRes.json()
        
        let formationsWithCount = formationsResult.data || []
        
        if (studentsResult.success) {
          // Compter les étudiants par formation
          const studentCounts: Record<string, number> = {}
          studentsResult.data.forEach((student: any) => {
            if (student.formation_id) {
              studentCounts[student.formation_id] = (studentCounts[student.formation_id] || 0) + 1
            }
          })
          
          // Ajouter le compte à chaque formation
          formationsWithCount = formationsResult.data.map((f: Formation) => ({
            ...f,
            student_count: studentCounts[f.id] || 0
          }))
        }
        
        setFormations(formationsWithCount)
      }
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Reset form
  useEffect(() => {
    if (!formOpen) {
      setEditTarget(null)
      setFormData({ 
        name: "", 
        category_id: categories[0]?.id || "", 
        duration: "", 
        description: "",
        status: "Draft"
      })
    }
  }, [formOpen, categories])

  // Load edit data
  useEffect(() => {
    if (editTarget) {
      setFormData({
        name: editTarget.name,
        category_id: editTarget.category_id || categories[0]?.id || "",
        duration: editTarget.duration,
        description: editTarget.description || "",
        status: editTarget.status === "Active" ? "Active" : "Draft"
      })
      setFormOpen(true)
    }
  }, [editTarget, categories])

  const handleCreateOrUpdateFormation = async () => {
    if (!formData.name || !formData.category_id || !formData.duration) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      const url = '/api/formations'
      const method = editTarget ? 'PUT' : 'POST'
      
      const payload = editTarget 
        ? { id: editTarget.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setFormOpen(false)
        setEditTarget(null)
        fetchData()
        toast({
          title: "Succès",
          description: editTarget ? "Formation modifiée avec succès" : "Formation créée avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de sauvegarder la formation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving formation:', error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFormation = async () => {
    if (!deleteTarget) return
    
    try {
      const response = await fetch('/api/formations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setDeleteTarget(null)
        fetchData()
        toast({
          title: "Succès",
          description: "Formation supprimée avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de supprimer la formation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting formation:', error)
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Formations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez votre catalogue de formations
          </p>
        </div>
        <button
          onClick={() => {
            setEditTarget(null)
            setFormOpen(true)
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Nouvelle formation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{formations.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Actives</p>
              <p className="text-xl font-bold">
                {formations.filter(f => f.status === "Active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Brouillons</p>
              <p className="text-xl font-bold">
                {formations.filter(f => f.status === "Draft").length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-chart-2/10 p-2">
              <Users className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Étudiants</p>
              <p className="text-xl font-bold">
                {formations.reduce((acc, f) => acc + (f.student_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">Chargement des formations…</p>
          </div>
        </div>
      ) : formations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <BookOpen className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">Aucune formation</p>
          <p className="mt-1 text-sm text-muted-foreground">Créez votre première formation pour commencer</p>
          <button
            onClick={() => setFormOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Créer une formation
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {formations.map((formation) => {
            const StatusIcon = statusConfig[formation.status].icon
            const categoryName = formation.categories?.name || "Non catégorisé"
            const categoryColor = categoryColors[categoryName] || { light: "bg-gray-50", text: "text-gray-500" }
            const descriptionLines = formatDescription(formation.description)
            
            return (
              <div
                key={formation.id}
                onClick={() => setSelectedFormation(formation)}
                className="group relative flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden cursor-pointer"
              >
                {/* En-tête avec statut */}
                <div className="absolute right-4 top-4 z-10">
                  <Badge variant="outline" className={cn("gap-1 px-2 py-1", statusConfig[formation.status].color)}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[formation.status].label}
                  </Badge>
                </div>

                {/* Bannière catégorie */}
                <div className={cn("h-2 w-full", categoryColor.light)} />

                {/* Contenu principal */}
                <div className="flex flex-col p-6">
                  {/* Catégorie et icône */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", categoryColor.light)}>
                      <BookOpen className={cn("h-6 w-6", categoryColor.text)} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Catégorie</p>
                      <p className="text-sm font-semibold text-foreground">{categoryName}</p>
                    </div>
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg font-bold text-foreground mb-3">{formation.name}</h3>

                  {/* Aperçu description */}
                  {descriptionLines.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Points clés :</p>
                      <ul className="space-y-1.5">
                        {descriptionLines.slice(0, 2).map((line, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                            <span className="text-muted-foreground line-clamp-1">{line}</span>
                          </li>
                        ))}
                      </ul>
                      {descriptionLines.length > 2 && (
                        <p className="mt-2 text-xs font-medium text-primary">
                          + {descriptionLines.length - 2} autres points...
                        </p>
                      )}
                    </div>
                  )}

                  {/* Métriques */}
                  <div className="mt-auto grid grid-cols-2 gap-3 rounded-lg bg-secondary/30 p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">Durée</p>
                        <p className="text-xs font-semibold text-foreground">{formation.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">Étudiants</p>
                        <p className="text-xs font-semibold text-foreground">
                          {formation.student_count || 0} inscrit{formation.student_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 border-t border-border bg-secondary/20 px-4 py-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditTarget(formation)
                    }}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteTarget(formation)
                    }}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de détails */}
      <Dialog open={!!selectedFormation} onOpenChange={() => setSelectedFormation(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedFormation && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold">{selectedFormation.name}</DialogTitle>
                    <DialogDescription className="mt-2">
                      {selectedFormation.categories?.name || "Formation"}
                    </DialogDescription>
                  </div>
                  <Badge variant="outline" className={cn(statusConfig[selectedFormation.status].color)}>
                    {statusConfig[selectedFormation.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Métriques détaillées */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Durée</p>
                    <p className="text-sm font-semibold">{selectedFormation.duration}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Étudiants</p>
                    <p className="text-sm font-semibold">{selectedFormation.student_count || 0}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Créée le</p>
                    <p className="text-sm font-semibold">
                      {new Date(selectedFormation.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Description complète */}
                {selectedFormation.description && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Programme détaillé</h4>
                    <div className="rounded-lg bg-secondary/20 p-4">
                      <ul className="space-y-3">
                        {formatDescription(selectedFormation.description).map((line, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-muted-foreground flex-1">{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Informations supplémentaires */}
                <div className="rounded-lg border border-border bg-secondary/20 p-4">
                  <h4 className="font-semibold text-foreground mb-3">Informations</h4>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID</span>
                      <span className="font-medium font-mono text-xs">{selectedFormation.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Catégorie</span>
                      <span className="font-medium">{selectedFormation.categories?.name || "Non catégorisé"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dernière mise à jour</span>
                      <span className="font-medium">
                        {new Date(selectedFormation.updated_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setEditTarget(selectedFormation)
                      setSelectedFormation(null)
                    }}
                    className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setDeleteTarget(selectedFormation)
                      setSelectedFormation(null)
                    }}
                    className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Formation Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Modifier" : "Créer"} une formation</DialogTitle>
            <DialogDescription>
              {editTarget ? "Modifiez les informations" : "Ajoutez une nouvelle formation"} à votre catalogue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Nom de la formation *</label>
              <input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                placeholder="Ex : Formation technique" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Catégorie *</label>
                <select 
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Durée *</label>
                <input 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="Ex : 3 jours / 6 mois" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Statut</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as "Active" | "Draft"})}
                className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Draft">Brouillon</option>
                <option value="Active">Actif</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <p className="text-xs text-muted-foreground mb-2">
                Séparez chaque point par un retour à la ligne pour créer une liste
              </p>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1.5 min-h-32 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono" 
                placeholder="Point 1&#10;Point 2&#10;Point 3" 
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button 
                onClick={handleCreateOrUpdateFormation}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                {editTarget ? "Mettre à jour" : "Créer"}
              </button>
              <button 
                onClick={() => setFormOpen(false)} 
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Annuler
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer la formation</DialogTitle>
            <DialogDescription>
              Confirmez-vous la suppression de <span className="font-semibold text-foreground">{deleteTarget?.name}</span> ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => setDeleteTarget(null)} 
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Annuler
            </button>
            <button 
              onClick={handleDeleteFormation}
              className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-all hover:brightness-110"
            >
              Supprimer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}