import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import GalleryClient from "@/components/features/gallery/GalleryClient"
import type { GalleryPhoto } from "@/types"

export const metadata: Metadata = {
  title: "Gallery | EGA Mentorship International",
  description: "Photos from EGA events, programs, and community impact initiatives across 6 countries.",
}

export default async function GalleryPage() {
  let photos: GalleryPhoto[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
    if (data) photos = data as GalleryPhoto[]
  } catch {}

  return (
    <div>
      <section className="bg-brand-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">Photo Gallery</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            Moments from EGA events, summits, training programs, and community projects across 6 countries.
          </p>
        </div>
      </section>
      <GalleryClient photos={photos} />
    </div>
  )
}
