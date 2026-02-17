"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Clock,
  BookOpen,
  MoreHorizontal,
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

interface Formation {
  id: string
  name: string
  category: string
  duration: string
  status: "Active" | "Draft" | "Archived"
  description: string
}

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Draft: "bg-warning/10 text-warning border-warning/20",
  Archived: "bg-muted text-muted-foreground border-border",
}

const categoryColors: Record<string, string> = {
  Development: "bg-primary/10 text-primary",
  Data: "bg-chart-2/10 text-chart-2",
  Design: "bg-chart-5/10 text-chart-5",
  Infrastructure: "bg-chart-4/10 text-chart-4",
  Security: "bg-destructive/10 text-destructive",
}

export default function FormationsAdminPage() {
  const [formations, setFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null)
  const [formData, setFormData] = useState({ name: "", category: "Development", duration: "", description: "" })

  // Fetch formations from Supabase
  const fetchFormations = async () => {
    try {
      const response = await fetch('/api/formations')
      const result = await response.json()
      if (result.success) {
        setFormations(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching formations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFormations()
  }, [])

  const handleCreateFormation = async () => {
    if (!formData.name || !formData.category || !formData.duration) {
      alert('Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/formations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        setFormOpen(false)
        setFormData({ name: "", category: "Development", duration: "", description: "" })
        fetchFormations()
      } else {
        alert(result.message || 'Failed to create formation')
      }
    } catch (error) {
      console.error('Error creating formation:', error)
      alert('Error creating formation')
    }
  }

  const handleDeleteFormation = async () => {
    if (!deleteTarget) return
    
    try {
      const response = await fetch(`/api/formations?id=${deleteTarget.id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        setDeleteTarget(null)
        fetchFormations()
      } else {
        alert(result.message || 'Failed to delete formation')
      }
    } catch (error) {
      console.error('Error deleting formation:', error)
      alert('Error deleting formation')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Formations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage training programs and courses ({formations.length} total)
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          New Formation
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading formations...</p>
        </div>
      ) : formations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <BookOpen className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">No formations yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {formations.map((f) => (
            <div
              key={f.id}
              className="group relative flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between p-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", categoryColors[f.category] || "bg-secondary text-foreground")}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground leading-snug">{f.name}</h3>
                    <span className="text-[11px] text-muted-foreground">{f.category}</span>
                  </div>
                </div>
                <Badge variant="outline" className={cn("shrink-0 text-[10px] font-semibold", statusStyles[f.status])}>{f.status}</Badge>
              </div>

              <p className="px-5 text-xs leading-relaxed text-muted-foreground line-clamp-2">{f.description}</p>

              <div className="mt-auto flex flex-col border-t border-border bg-secondary/30 px-5 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{f.duration}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1 border-t border-border px-4 py-2.5">
                <button className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button 
                  onClick={() => setDeleteTarget(f)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Formation Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Formation</DialogTitle>
            <DialogDescription>Add a new training program to your catalog.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Formation Name</label>
              <input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                placeholder="e.g. Advanced Python Programming" 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Development</option>
                  <option>Data</option>
                  <option>Design</option>
                  <option>Infrastructure</option>
                  <option>Security</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Duration</label>
                <input 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="e.g. 6 months" 
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1.5 min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                placeholder="Brief description of the program..." 
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button 
                onClick={handleCreateFormation}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
                Create Formation
              </button>
              <button 
                onClick={() => setFormOpen(false)} 
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
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
            <DialogTitle>Delete Formation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? This will remove it and all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => setDeleteTarget(null)} 
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Cancel
            </button>
            <button 
              onClick={handleDeleteFormation}
              className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-all hover:brightness-110">
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
