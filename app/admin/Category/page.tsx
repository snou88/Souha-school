"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
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

interface Category {
  id: number
  name: string
  slug?: string
  status: "Active" | "Draft" | "Archived"
}

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Draft: "bg-warning/10 text-warning border-warning/20",
  Archived: "bg-muted text-muted-foreground border-border",
}

const ITEMS_PER_PAGE = 9

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  // Modal / form state
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const [formValues, setFormValues] = useState({
    name: "",
    slug: "",
    status: "Active",
  })

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories")
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error("Failed to load categories - HTTP", res.status, errorText)
        alert(`Failed to load categories: ${res.status} ${res.statusText}`)
        return
      }
      
      const json = await res.json()
      
      if (json.success) {
        setCategories(json.data || [])
      } else {
        console.error("Failed to load categories", json)
        const errorMsg = json.error || "Unknown error"
        alert(`Failed to load categories: ${errorMsg}`)
      }
    } catch (error) {
      console.error("Error loading categories", error)
      alert(`Error loading categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!formOpen) {
      setEditing(null)
      setFormValues({ name: "", slug: "", status: "Active" })
    }
  }, [formOpen])

  function openCreate() {
    setEditing(null)
    setFormValues({ name: "", slug: "", status: "Active" })
    setFormOpen(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setFormValues({ name: cat.name, slug: cat.slug || slugify(cat.name), status: cat.status })
    setFormOpen(true)
  }

  function handleChange<K extends keyof typeof formValues>(key: K, value: string) {
    setFormValues((s) => ({ ...s, [key]: value }))
  }

  function handleSave() {
    void saveCategory()
  }

  async function saveCategory() {
    const name = formValues.name.trim()
    const slug = (formValues.slug || slugify(name)).trim()
    const status = formValues.status as Category["status"]

    if (!name) {
      alert("Le nom de la catégorie est requis.")
      return
    }

    try {
      const method = editing ? "PUT" : "POST"
      const body = editing
        ? { id: editing.id, name, slug, status }
        : { name, slug, status }

      const res = await fetch("/api/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Failed to save category - HTTP", res.status, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          alert(errorJson.error || `Failed to save category: ${res.status} ${res.statusText}`)
        } catch {
          alert(`Failed to save category: ${res.status} ${res.statusText}`)
        }
        return
      }

      const json = await res.json()

      if (!json.success) {
        alert(json.error || "Une erreur s'est produite lors de l'enregistrement.")
        return
      }

      setFormOpen(false)
      await fetchCategories()
      setPage(1)
    } catch (error) {
      console.error("Error saving category", error)
      alert("Une erreur s'est produite lors de l'enregistrement.")
    }
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    void deleteCategory(deleteTarget.id)
  }

  async function deleteCategory(id: number) {
    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Failed to delete category - HTTP", res.status, errorText)
        try {
          const errorJson = JSON.parse(errorText)
          alert(errorJson.error || `Failed to delete category: ${res.status} ${res.statusText}`)
        } catch {
          alert(`Failed to delete category: ${res.status} ${res.statusText}`)
        }
        return
      }

      const json = await res.json()

      if (!json.success) {
        alert(json.error || "Une erreur s'est produite lors de la suppression.")
        return
      }

      await fetchCategories()
    } catch (error) {
      console.error("Error deleting category", error)
      alert(`Error deleting category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setDeleteTarget(null)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((c) => c.name.toLowerCase().includes(q) || (c.slug || "").toLowerCase().includes(q))
  }, [categories, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Catégories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gérer les catégories des formations</p>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Nouvelle catégorie
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="h-10 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Chargement des catégories...
          </div>
        )}

        {!loading && paginated.map((c) => (
          <article
            key={c.id}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-card/95 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* top row: icon + name + status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">/{c.slug || slugify(c.name)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-[11px] font-semibold", statusStyles[c.status])}>
                  {c.status}
                </Badge>
              </div>
            </div>

            {/* footer with edit & delete buttons (replacing previous info) */}
            <footer className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => openEdit(c)}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Éditer</span>
              </button>

              <button
                onClick={() => setDeleteTarget(c)}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
            </footer>
          </article>
        ))}

        {!loading && paginated.length === 0 && (
          <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Aucune catégorie trouvée.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Affichage {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  p === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
            <DialogDescription>
              {editing ? "Mettez à jour le nom et le slug." : "Créez une nouvelle catégorie de formation."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Nom</label>
              <input
                value={formValues.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ex : Informatique"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Slug (optionnel)</label>
              <input
                value={formValues.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="ex : informatique"
              />
              <p className="mt-1 text-xs text-muted-foreground">Si laissé vide, le slug sera généré automatiquement.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Statut</label>
              <select
                value={formValues.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground"
              >
                <option value="Active">Actif</option>
                <option value="Draft">Brouillon</option>
                <option value="Archived">Archivé</option>
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-white shadow"
              >
                {editing ? "Enregistrer" : "Créer"}
              </button>
              <button onClick={() => setFormOpen(false)} className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground">
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
            <DialogTitle>Supprimer la catégorie</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-foreground">{deleteTarget?.name}</span> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground">
              Annuler
            </button>
            <button onClick={handleDeleteConfirm} className="flex-1 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
              Supprimer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ---------- Helpers ---------- */

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_\s]/g, "")
    .replace(/\s+/g, "-")
}
