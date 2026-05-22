"use client"

import { useState } from "react"
import { FileText, Briefcase, Award, Video, ExternalLink, Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import type { PortfolioItem } from "@/types"
import PortfolioFormModal from "./PortfolioFormModal"

const TYPE_META: Record<string, { label: string; icon: React.ElementType; bg: string }> = {
  article: { label: "Article", icon: FileText, bg: "bg-blue-500" },
  project: { label: "Project", icon: Briefcase, bg: "bg-brand-navy" },
  certificate: { label: "Certificate", icon: Award, bg: "bg-brand-gold" },
  video: { label: "Video", icon: Video, bg: "bg-green-500" },
}

type Filter = "all" | "published" | "drafts"

export default function PortfolioManager({ initialItems }: { initialItems: PortfolioItem[] }) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems)
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>("all")

  const published = items.filter((i) => i.published)
  const drafts = items.filter((i) => !i.published)
  const filtered = filter === "published" ? published : filter === "drafts" ? drafts : items

  function handleAdd(item: PortfolioItem) {
    setItems((prev) => [item, ...prev])
  }

  function handleSaved(item: PortfolioItem) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)))
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" })
      setItems((prev) => prev.filter((i) => i.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  async function handleTogglePublish(id: string, newPublished: boolean) {
    const res = await fetch("/api/portfolio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published: newPublished }),
    })
    if (res.ok) {
      const { item } = await res.json()
      setItems((prev) => prev.map((i) => (i.id === id ? (item as PortfolioItem) : i)))
    }
  }

  return (
    <>
      {/* Filter + Add row */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          {(["all", "published", "drafts"] as Filter[]).map((f) => {
            const count = f === "all" ? items.length : f === "published" ? published.length : drafts.length
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  filter === f ? "bg-brand-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  filter === f ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Briefcase size={44} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium text-gray-500 text-sm">
            {filter === "all" ? "Your portfolio is empty" : `No ${filter} items yet`}
          </p>
          {filter === "all" && (
            <p className="text-xs text-gray-400 mt-1">
              Add articles, projects, certificates, and videos to showcase your EGA journey
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => {
            const meta = TYPE_META[item.type] ?? TYPE_META.article
            const Icon = meta.icon
            const isDeleting = deletingId === item.id

            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                {/* Type header band */}
                <div className={`${meta.bg} h-14 flex items-center justify-center shrink-0`}>
                  <Icon size={26} className="text-white" />
                </div>

                {/* Body */}
                <div className="p-4 flex-1 space-y-2">
                  <h3 className="font-bold text-brand-navy text-sm leading-snug line-clamp-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-50 flex items-center gap-2">
                  {/* Publish toggle */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(item.id, !item.published)}
                    className="flex items-center gap-1.5 min-w-0 shrink-0"
                    aria-label={item.published ? "Unpublish item" : "Publish item"}
                  >
                    <span className={`w-7 h-4 rounded-full transition-colors flex items-center px-0.5 ${item.published ? "bg-green-500" : "bg-gray-300"}`}>
                      <span className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${item.published ? "translate-x-3" : "translate-x-0"}`} />
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{item.published ? "Published" : "Draft"}</span>
                  </button>

                  <div className="flex-1" />

                  {item.content_url && (
                    <a
                      href={item.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-brand-gold font-semibold hover:underline"
                    >
                      View <ExternalLink size={11} />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setEditItem(item)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-navy transition-colors"
                    aria-label="Edit item"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    aria-label="Delete item"
                  >
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && (
        <PortfolioFormModal
          onClose={() => setShowAdd(false)}
          onDone={(item) => { handleAdd(item); setShowAdd(false) }}
        />
      )}

      {editItem && (
        <PortfolioFormModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onDone={(item) => { handleSaved(item); setEditItem(null) }}
        />
      )}
    </>
  )
}
