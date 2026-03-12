"use client"

import { useState, useRef, useEffect, ChangeEvent } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface Partner {
  id: string
  name: string
  logo_url?: string | null
  website?: string | null
  featured?: boolean
}

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null)

  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [logoBase64, setLogoBase64] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)
  const [removeLogo, setRemoveLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Fetch partners from API
  useEffect(() => {
    fetch("/api/partenaires")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPartners(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  function openNewPartnerForm() {
    setEditing(null)
    setName("")
    setWebsite("")
    setLogoBase64(null)
    setLogoPreview(undefined)
    setRemoveLogo(false)
    setDialogOpen(true)
  }

  function openEditPartner(p: Partner) {
    setEditing(p)
    setName(p.name)
    setWebsite(p.website || "")
    setLogoPreview(p.logo_url || undefined)
    setLogoBase64(null)
    setRemoveLogo(false)
    setDialogOpen(true)
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setLogoBase64(base64String)
      setLogoPreview(base64String)
      setRemoveLogo(false)
    }
    reader.readAsDataURL(file)
    
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleRemoveLogoPreview() {
    setLogoBase64(null)
    setLogoPreview(undefined)
    setRemoveLogo(true)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Create or Update partner
  async function handleSave() {
    const trimmedName = name.trim()
    if (!trimmedName) return alert("Veuillez saisir le nom du partenaire.")

    let response
    if (editing) {
      // Update
      response = await fetch("/api/partenaires", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          name: trimmedName,
          website: website.trim() || null,
          logoBase64: logoBase64,
          removeLogo: removeLogo,
        }),
      })
    } else {
      // Create
      response = await fetch("/api/partenaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          website: website.trim() || null,
          logoBase64: logoBase64,
        }),
      })
    }

    const result = await response.json()
    if (!result.success) {
      alert(result.error)
      return
    }

    if (editing) {
      setPartners((prev) =>
        prev.map((p) => (p.id === editing.id ? result.data : p))
      )
    } else {
      setPartners((prev) => [result.data, ...prev])
    }

    setDialogOpen(false)
    setEditing(null)
    setName("")
    setWebsite("")
    handleRemoveLogoPreview()
  }

  // Delete partner
  async function handleConfirmDelete() {
    if (!deleteTarget) return

    const response = await fetch("/api/partenaires", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
    })
    const result = await response.json()
    if (!result.success) {
      alert(result.error)
      return
    }

    setPartners((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        Chargement des partenaires…
      </div>
    )

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Partenaires</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérer les partenaires, logos et liens ({partners.length} au total)
          </p>
        </div>
        <button
          onClick={openNewPartnerForm}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Nouveau partenaire
        </button>
      </div>

      {/* Partners grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {partners.map((p) => (
          <div
            key={p.id}
            className="group relative flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between p-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {p.logo_url ? (
                    <img 
                      src={p.logo_url} 
                      alt={`${p.name} logo`} 
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-logo.png'
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-card-foreground truncate">{p.name}</h3>
                  {p.website ? (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] text-muted-foreground inline-flex items-center gap-1 truncate mt-1"
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      {p.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <span className="text-[12px] text-muted-foreground mt-1">Aucun site</span>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="text-[11px] font-semibold self-start">
                Partenaire
              </Badge>
            </div>

            <div className="flex items-center justify-end gap-1 border-t border-border px-3 py-2.5">
              <button onClick={() => openEditPartner(p)} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Pencil className="h-3.5 w-3.5" /> Modifier
              </button>
              <button onClick={() => setDeleteTarget(p)} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit modal */}
      <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) setEditing(null); setDialogOpen(v) }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le partenaire" : "Ajouter un partenaire"}</DialogTitle>
            <DialogDescription>
              {editing ? "Mettez à jour les informations du partenaire." : "Ajoutez un partenaire avec logo et site web (optionnel)."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Nom</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Nom du partenaire"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Site web (optionnel)</label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Logo (PNG, JPG, SVG)</label>
              <div className="mt-1 flex items-center gap-3">
                <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-border bg-card">
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo preview" className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    type="file" 
                    className="hidden" 
                    id="logo-upload" 
                  />
                  <label htmlFor="logo-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
                    Importer le logo
                  </label>

                  {(logoPreview || (editing && editing.logo_url)) && (
                    <button onClick={handleRemoveLogoPreview} className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" /> Retirer
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Le logo sera stocké directement dans la base de données (format Base64)
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
                {editing ? "Enregistrer" : "Ajouter"}
              </button>
              <button onClick={() => setDialogOpen(false)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
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
            <DialogTitle>Supprimer le partenaire</DialogTitle>
            <DialogDescription>
              Confirmez-vous la suppression de <span className="font-semibold text-foreground">{deleteTarget?.name}</span> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Annuler
            </button>
            <button onClick={handleConfirmDelete} className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-all hover:brightness-110">
              Supprimer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}