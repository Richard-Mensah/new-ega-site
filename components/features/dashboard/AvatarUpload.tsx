"use client"

import { useRef, useState } from "react"
import { Camera, Loader2 } from "lucide-react"

interface Props {
  userId: string
  currentUrl: string | null
  fullName: string
  onUploaded: (url: string) => void
}

export default function AvatarUpload({ currentUrl, fullName, onUploaded }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are supported.")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB.")
      return
    }

    // Show local preview immediately
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const body = new FormData()
      body.append("file", file)

      const res = await fetch("/api/profile/avatar", { method: "POST", body })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? "Upload failed")
      }

      onUploaded(json.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
      setPreview(currentUrl)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {preview ? (
          <img
            src={preview}
            alt={fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-brand-navy flex items-center justify-center border-4 border-white shadow-md">
            <span className="text-white text-2xl font-bold">{initials}</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 size={20} className="text-white animate-spin" />
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center shadow-sm hover:bg-amber-500 transition-colors disabled:opacity-60"
          aria-label="Change photo"
        >
          <Camera size={14} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />

      {error && <p className="text-xs text-red-500 text-center max-w-48">{error}</p>}

      <p className="text-xs text-gray-400">JPG, PNG or WebP · max 2 MB</p>
    </div>
  )
}
