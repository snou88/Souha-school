"use client"

import { useState } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Clock,
  DollarSign,
  X,
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
  id: number
  name: string
  category: string
  students: number
  duration: string
  status: "Active" | "Draft" | "Archived"
  description: string
}

const formations: Formation[] = [
  { id: 1, name: "Full-Stack Web Development", category: "Development", students: 420, duration: "6 months", status: "Active", description: "Master modern web technologies including React, Node.js, and cloud deployment." },
  { id: 2, name: "Data Science & Machine Learning", category: "Data", students: 380, duration: "8 months", status: "Active", description: "Learn Python, statistics, ML algorithms, and deep learning frameworks." },
  { id: 3, name: "UI/UX Design Mastery", category: "Design", students: 340, duration: "4 months", status: "Active", description: "Design thinking, Figma, prototyping, and user research methodologies." },
  { id: 4, name: "Mobile App Development", category: "Development", students: 290, duration: "5 months", status: "Active", description: "Build native and cross-platform mobile apps with React Native and Flutter." },
  { id: 5, name: "Cloud & DevOps Engineering", category: "Infrastructure", students: 260, duration: "6 months", status: "Active", description: "AWS, Docker, Kubernetes, CI/CD pipelines, and infrastructure as code." },
  { id: 6, name: "Cybersecurity Fundamentals", category: "Security", students: 220, duration: "5 months", status: "Active", description: "Network security, ethical hacking, vulnerability assessment, and compliance." },
  { id: 7, name: "AI & Natural Language Processing", category: "Data", students: 0, duration: "7 months", status: "Draft", description: "Advanced NLP techniques, transformers, and generative AI applications." },
  { id: 8, name: "Blockchain Development", category: "Development", students: 45, duration: "4 months", status: "Archived", description: "Smart contracts, Solidity, DeFi protocols, and Web3 development." },
]

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
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Formation | null>(null)

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

            <div className="mt-auto grid grid-cols-2 gap-px border-t border-border bg-border mt-4">
              <div className="flex flex-col items-center gap-0.5 bg-card px-3 py-3">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{f.students}</span>
                <span className="text-[10px] text-muted-foreground">Students</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 bg-card px-3 py-3">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{f.duration}</span>
                <span className="text-[10px] text-muted-foreground">Duration</span>
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
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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
              <input className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Advanced Python Programming" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <select className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Development</option>
                  <option>Data</option>
                  <option>Design</option>
                  <option>Infrastructure</option>
                  <option>Security</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Duration</label>
                <input className="mt-1.5 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 6 months" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea className="mt-1.5 min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Brief description of the program..." />
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
                Create Formation
              </button>
              <button onClick={() => setFormOpen(false)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
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
            <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Cancel
            </button>
            <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-all hover:brightness-110">
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
