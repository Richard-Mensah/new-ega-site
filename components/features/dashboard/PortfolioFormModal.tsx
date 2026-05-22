"use client"

import { useState } from "react"
import Modal from "@/components/ui/Modal"
import { FileText, Briefcase, Award, Video, X as XIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { PortfolioItem } from "@/types"

const TYPES = [
  { key: "article" as const, label: "Article", icon: FileText, activeBg: "bg-blue-500", activeText: "text-white" },
  { key: "project" as const, label: "Project", icon: Briefcase, activeBg: "bg-brand-navy", activeText: "text-white" },
  { key: "certificate" as const, label: "Certificate", icon: Award, activeBg: "bg-brand-gold", activeText: "text-white" },
  { key: "video" as const, label: "Video", icon: Video, activeBg: "bg-green-500", activeText: "text-white" },
]

type Props = {
  item?: PortfolioItem
  onClose: () => void
  onDone: (item: PortfolioItem) => void
}

export default function PortfolioFormModal({ item, onClose, onDone }: Props) {
  const isEdit = !!item
  const [type, setType] = useState<PortfolioItem["type"]>((item?.type as PortfolioItem["type"]) ?? "article")
  const [title, setTitle] = useState(item?.title ?? "")
  const [description, setDescription] = useState(item?.description ?? "")
  const [tags, setTags] = useState<string[]>(item?.tags ?? [])
  const [tagInput, setTagInput] = useState("")
  const [url, setUrl] = useState(item?.content_url ?? "")
  const [published, setPublished] = useState(item?.published ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function addTag(value: string) {
    const trimmed = value.trim().replace(/,+$/, "").trim()
    if (trimmed && !tags.includes(trimmed)) setTags((prev) => [...prev, trimmed])
    setTagInput("")
  }

  function handleTagKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError("Title is required"); return }
    setError("")
    setLoading(true)
    const finalTags = tagInput.trim() ? [...tags, tagInput.trim()] : tags
    try {
      if (isEdit) {
        const res = await fetch("/api/portfolio", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: item.id,
            type,
            title: title.trim(),
            description: description.trim() || null,
            tags: finalTags,
            content_url: url.trim() || null,
            published,
          }),
        })
        const json = await res.json()
        if (!res.ok) { setError(json.error || "Failed to save"); return }
        onDone(json.item as PortfolioItem)
      } else {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")
        const { data, error: dbError } = await supabase
          .from("portfolio_items")
          .insert({
            participant_id: user.id,
            type,
            title: title.trim(),
            description: description.trim() || null,
            tags: finalTags,
            content_url: url.trim() || null,
            published,
          })
          .select()
          .single()
        if (dbError) throw new Error(dbError.message)
        onDone(data as PortfolioItem)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg.includes("row-level") ? "Permission denied. Please contact support." : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen onClose={onClose} title={isEdit ? "Edit Portfolio Item" : "Add Portfolio Item"}>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Type selector */}
        <div>
          <p className="text-sm font-semibold text-brand-navy mb-2">Type</p>
          <div className="grid grid-cols-4 gap-2">
            {TYPES.map(({ key, label, icon: Icon, activeBg, activeText }) => {
              const isSelected = type === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? `${activeBg} border-transparent ${activeText}`
                      : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My SDG Climate Research Project"
            maxLength={120}
            required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold text-brand-navy">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <span className="text-xs text-gray-400">{description.length}/300</span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 300))}
            rows={3}
            placeholder="Briefly describe what this is about, what you achieved, or why it matters..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">
            Skills & Tags <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-brand-gold min-h-[44px]">
            <div className="flex flex-wrap gap-1.5 mb-1">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-brand-navy/5 text-brand-navy text-xs px-2.5 py-1 rounded-full font-medium">
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    className="opacity-50 hover:opacity-100 transition-opacity"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <XIcon size={10} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              onBlur={() => tagInput.trim() && addTag(tagInput)}
              placeholder={tags.length === 0 ? "Type a skill and press Enter..." : "Add another skill..."}
              className="w-full text-sm outline-none bg-transparent placeholder:text-gray-400"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Press Enter or comma after each skill (e.g. JavaScript, Leadership)</p>
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-1">
            Link <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        {/* Publish toggle */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3.5">
          <div>
            <p className="text-sm font-semibold text-brand-navy">Publish now</p>
            <p className="text-xs text-gray-400 mt-0.5">Make this visible on your portfolio</p>
          </div>
          <button
            type="button"
            onClick={() => setPublished((prev) => !prev)}
            className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${published ? "bg-green-500" : "bg-gray-300"}`}
            aria-label="Toggle publish"
          >
            <span className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${published ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-gold text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Add to Portfolio"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
