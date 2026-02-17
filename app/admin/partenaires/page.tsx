"use client"

import { useState, useRef, ChangeEvent } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
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

interface Partner {
  id: number
  name: string
  logoUrl?: string
  website?: string
  featured?: boolean
}

const initialPartners: Partner[] = [
  { id: 1, name: "Acme Corp", website: "https://acme.example" },
  { id: 2, name: "Atlas Partners", website: "https://atlas.example" },
  { id: 3, name: "Bright Labs", website: "https://bright.example" },
]

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null)

  // form state
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function openNewPartnerForm() {
    setEditing(null)
    setName("")
    setWebsite("")
    setLogoFile(null)
    setLogoPreview(undefined)
    setDialogOpen(true)
  }

  function openEditPartner(p: Partner) {
    setEditing(p)
    setName(p.name)
    setWebsite(p.website || "")
    setLogoPreview(p.logoUrl)
    setLogoFile(null)
    setDialogOpen(true)
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    setLogoFile(f)
    if (f) {
      const url = URL.createObjectURL(f)
      setLogoPreview(url)
    } else {
      setLogoPreview(undefined)
    }
  }

  function handleRemoveLogoPreview() {
    setLogoFile(null)
    setLogoPreview(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleSave() {
    const trimmedName = name.trim()
    if (!trimmedName) return alert("Please enter the partner name.")

    if (editing) {
      // update
      setPartners((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? { ...p, name: trimmedName, website: website.trim() || undefined, logoUrl: logoPreview }
            : p
        )
      )
    } else {
      // create
      const newPartner: Partner = {
        id: Date.now(),
        name: trimmedName,
        website: website.trim() || undefined,
        logoUrl: logoPreview,
      }
      setPartners((prev) => [newPartner, ...prev])
    }

    // cleanup
    setDialogOpen(false)
    setEditing(null)
    handleRemoveLogoPreview()
    setName("")
    setWebsite("")
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    setPartners((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Partenaires</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage partners, logos and links ({partners.length} total)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openNewPartnerForm}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            New Partner
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {partners.map((p) => (
          <div key={p.id} className="group relative flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-start justify-between p-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {p.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logoUrl} alt={`${p.name} logo`} className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-card-foreground truncate">{p.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    {p.website ? (
                      <a href={p.website} target="_blank" rel="noreferrer" className="text-[12px] text-muted-foreground inline-flex items-center gap-1 truncate">
                        <LinkIcon className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[10rem]">{p.website.replace(/^https?:\/\//, "")}</span>
                      </a>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">No website</span>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-[11px] font-semibold self-start">Partner</Badge>
            </div>

            <div className="mt-auto flex items-center justify-end gap-1 border-t border-border px-3 py-2.5">
              <button
                onClick={() => openEditPartner(p)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(p)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Partner Modal */}
      <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) setEditing(null); setDialogOpen(v) }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Partner" : "Add New Partner"}</DialogTitle>
            <DialogDescription>{editing ? "Update partner details." : "Add a new partner with logo and website."}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Acme Corp"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Website (optional)</label>
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoPreview} alt="logo preview" className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <input ref={fileInputRef} onChange={handleFileChange} accept="image/*" type="file" className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary">
                    Upload Logo
                  </label>

                  {logoPreview && (
                    <button onClick={handleRemoveLogoPreview} className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
                {editing ? "Save Changes" : "Add Partner"}
              </button>
              <button onClick={() => setDialogOpen(false)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Partner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Cancel
            </button>
            <button onClick={handleConfirmDelete} className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-all hover:brightness-110">
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
