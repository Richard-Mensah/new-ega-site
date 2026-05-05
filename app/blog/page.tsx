import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SAMPLE_BLOG_POSTS, type SampleBlogPost } from "@/lib/constants/blog"
import type { BlogPost } from "@/types"

export const metadata: Metadata = {
  title: "Blog & News | EGA Mentorship International",
  description: "Stay updated with EGA's latest news, participant stories, SDG insights, and leadership articles.",
}

export default async function BlogPage() {
  let posts: (BlogPost | SampleBlogPost)[] = SAMPLE_BLOG_POSTS

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(12)
    if (data && data.length > 0) posts = data as BlogPost[]
  } catch {}

  return (
    <div>
      <section className="bg-brand-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">Blog & News</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            Stories, insights, and updates from EGA participants, mentors, and partners around the world.
          </p>
        </div>
      </section>

      <section className="py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-40 bg-brand-navy/5 flex items-center justify-center">
                  <span className="text-brand-navy/20 text-6xl font-extrabold">EGA</span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-brand-gold font-semibold mb-2">
                    {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <h2 className="font-bold text-brand-navy text-lg leading-tight group-hover:text-brand-gold transition-colors mb-2">
                    {post.title}
                  </h2>
                  {"excerpt" in post && post.excerpt && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-block text-brand-gold text-sm font-semibold group-hover:underline">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
