import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SAMPLE_BLOG_POSTS } from "@/lib/constants/blog"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

type Props = { params: Promise<{ slug: string }> }

type BlogPostDetail = {
  title: string
  content: string | null
  created_at: string
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, " ")} | EGA Blog`,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  let post: BlogPostDetail | null =
    SAMPLE_BLOG_POSTS.find((samplePost) => samplePost.slug === slug) ?? null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (data) post = data as BlogPostDetail
  } catch {}

  if (!post) return notFound()

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="text-brand-gold text-sm hover:underline mb-6 block">
            Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold">{post.title}</h1>
          <p className="mt-3 text-white/60 text-sm">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          <div dangerouslySetInnerHTML={{ __html: post.content ?? "" }} />
        </div>
      </section>
    </div>
  )
}
