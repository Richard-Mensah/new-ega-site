"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2, CheckCircle2, X } from "lucide-react"

interface Props {
  userId: string
  currentUrl: string | null
  fullName: string
  onUploaded: (url: string) => void
}

export default function AvatarUpload({ currentUrl, fullName, onUploaded }: Props) {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [imgFailed, setImgFailed] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(false)

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are supported.")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB.")
      return
    }

    setPreview(URL.createObjectURL(file))
    setImgFailed(false)
    setPendingFile(file)
  }

  function cancelSelection() {
    setPendingFile(null)
    setPreview(currentUrl)
    setImgFailed(false)
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  async function handleUpload() {
    if (!pendingFile) return

    setUploading(true)
    setError(null)

    try {
      const body = new FormData()
      body.append("file", pendingFile)

      const res = await fetch("/api/profile/avatar", { method: "POST", body })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? "Upload failed")
      }

      onUploaded(json.url)
      setPreview(json.url)
      setImgFailed(false)
      setPendingFile(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
      setPreview(currentUrl)
      setImgFailed(false)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar circle */}
      <div className="relative">
        {preview && !imgFailed ? (
          <img
            key={preview}
            src={preview}
            alt={fullName}
            onError={() => setImgFailed(true)}
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
        aria-label="Upload profile photo"
        className="hidden"
        onChange={handleFile}
      />

      <p className="text-xs text-gray-400">JPG, PNG or WebP · max 2 MB</p>

      {/* Pending file — show save / cancel */}
      {pendingFile && !uploading && (
        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
          <p className="text-xs text-gray-500 text-center">
            Ready to save: <span className="font-medium text-gray-700">{pendingFile.name}</span>
          </p>
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={cancelSelection}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className="flex-1 py-2 rounded-lg bg-brand-gold text-white text-sm font-semibold hover:bg-amber-500 transition-colors"
            >
              Save Photo
            </button>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
          <CheckCircle2 size={16} />
          Profile photo updated successfully!
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 text-center max-w-xs">{error}</p>
      )}
    </div>
  )
}
