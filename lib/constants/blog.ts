import type { BlogPost } from "@/types"

export type SampleBlogPost = BlogPost & {
  excerpt: string
}

export const SAMPLE_BLOG_POSTS: SampleBlogPost[] = [
  {
    id: "1",
    title: "How EGA Mentorship Changed My Career Trajectory",
    slug: "ega-mentorship-career-story",
    content:
      "<p>A participant story from Ghana about finding direction, building confidence, and growing into a recognized youth leader across West Africa.</p>",
    published: true,
    created_at: "2025-06-01",
    author_id: "1",
    excerpt: "One participant's journey from uncertainty to becoming a recognized youth leader across West Africa.",
  },
  {
    id: "2",
    title: "EGA's Approach to SDG 4: Quality Education in Practice",
    slug: "sdg-4-quality-education",
    content:
      "<p>EGA integrates SDG 4 into mentorship, skills development, and educational consultancy by helping young people connect learning with practical leadership action.</p>",
    published: true,
    created_at: "2025-07-15",
    author_id: "1",
    excerpt: "How EGA integrates SDG 4 into every aspect of our mentorship and educational consultancy programs.",
  },
  {
    id: "3",
    title: "2025 EGA Annual Summit Recap",
    slug: "2025-annual-summit-recap",
    content:
      "<p>Highlights from EGA's annual gathering, including cross-continental collaboration, participant showcases, and new program announcements.</p>",
    published: true,
    created_at: "2025-09-01",
    author_id: "1",
    excerpt: "Key highlights, breakthroughs, and announcements from our cross-continental annual gathering.",
  },
]
