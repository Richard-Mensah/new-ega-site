export type UserRole = "participant" | "mentor"

export type Profile = {
  id: string
  role: UserRole
  full_name: string
  country: string | null
  avatar_url: string | null
  sdg_focus: number[]
  bio: string | null
  created_at: string
}

export type PublicProfile = {
  id: string
  full_name: string
  country: string | null
  organization: string | null
  bio: string | null
  avatar_url: string | null
  sdg_focus: number[]
  linkedin_url?: string | null
  created_at: string
}

export type MentorAward = {
  id: string
  mentor_id: string
  participant_id: string
  category: "leadership" | "sdg_engagement" | "communication" | "projects" | "overall"
  title: string
  notes: string | null
  awarded_at: string
}

export type MentorshipPair = {
  id: string
  mentor_id: string
  participant_id: string
  matched_at: string
  status: string
}

export type SessionRecord = {
  id: string
  mentor_id: string
  participant_id: string
  scheduled_at: string | null
  notes: string | null
  status: "scheduled" | "completed" | "cancelled"
  created_at: string
}

export type Project = {
  id: string
  participant_id: string
  title: string
  sdg_number: number | null
  stage: 1 | 2 | 3 | 4
  status: string
  description: string | null
  created_at: string
}

export type Milestone = {
  id: string
  participant_id: string
  type: "leadership" | "sdg_engagement" | "communication" | "projects" | "overall"
  score: number
  recorded_at: string
}

export type SdgProgress = {
  participant_id: string
  sdg_number: number
  engaged_at: string
  level: string
}

export type PortfolioItem = {
  id: string
  participant_id: string
  type: "article" | "project" | "certificate" | "video"
  title: string
  description: string | null
  tags: string[]
  content_url: string | null
  published: boolean
  created_at: string
}

export type BlogPost = {
  id: string
  author_id: string
  title: string
  slug: string
  content: string | null
  published: boolean
  created_at: string
}

export type GalleryPhoto = {
  id: string
  uploaded_by: string
  title: string | null
  category: "events" | "programs" | "sdg" | "team" | "conferences"
  image_url: string
  published: boolean
  created_at: string
}

export type MenteeGrowthData = {
  week: string
  scores: Record<string, number>
}

export type SdgItem = {
  number: number
  title: string
  description: string
  color: string
  slug: string
  egaApproach: string
}

export type TeamMember = {
  name: string
  role: string
  country: string
  bio: string
  avatar: string
}
