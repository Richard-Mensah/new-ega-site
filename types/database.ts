export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// Helper to extract table Row types: Tables<"sessions"> gives the sessions row type
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: "participant" | "mentor"
          full_name: string
          country: string | null
          avatar_url: string | null
          sdg_focus: number[]
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          role: "participant" | "mentor"
          full_name: string
          country?: string | null
          avatar_url?: string | null
          sdg_focus?: number[]
          bio?: string | null
          created_at?: string
        }
        Update: {
          role?: "participant" | "mentor"
          full_name?: string
          country?: string | null
          avatar_url?: string | null
          sdg_focus?: number[]
          bio?: string | null
        }
        Relationships: []
      }
      mentorship_pairs: {
        Row: {
          id: string
          mentor_id: string
          participant_id: string
          matched_at: string
          status: string
        }
        Insert: {
          id?: string
          mentor_id: string
          participant_id: string
          matched_at?: string
          status?: string
        }
        Update: { status?: string }
        Relationships: []
      }
      sessions: {
        Row: {
          id: string
          mentor_id: string
          participant_id: string
          scheduled_at: string | null
          notes: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          mentor_id: string
          participant_id: string
          scheduled_at?: string | null
          notes?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          scheduled_at?: string | null
          notes?: string | null
          status?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          participant_id: string
          title: string
          sdg_number: number | null
          stage: number
          status: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          title: string
          sdg_number?: number | null
          stage?: number
          status?: string
          description?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          sdg_number?: number | null
          stage?: number
          status?: string
          description?: string | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          id: string
          participant_id: string
          type: string
          score: number
          recorded_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          type: string
          score: number
          recorded_at?: string
        }
        Update: { score?: number }
        Relationships: []
      }
      sdg_progress: {
        Row: {
          participant_id: string
          sdg_number: number
          engaged_at: string
          level: string
        }
        Insert: {
          participant_id: string
          sdg_number: number
          engaged_at?: string
          level?: string
        }
        Update: { level?: string }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          id: string
          participant_id: string
          type: string
          title: string
          content_url: string | null
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          type: string
          title: string
          content_url?: string | null
          published?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          content_url?: string | null
          published?: boolean
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          content: string | null
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          slug: string
          content?: string | null
          published?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          content?: string | null
          published?: boolean
        }
        Relationships: []
      }
      profile_likes: {
        Row: {
          id: string
          liker_id: string
          liked_id: string
          created_at: string
        }
        Insert: {
          liker_id: string
          liked_id: string
          id?: string
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      gallery_photos: {
        Row: {
          id: string
          uploaded_by: string
          title: string | null
          category: string
          image_url: string
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          uploaded_by: string
          title?: string | null
          category: string
          image_url: string
          published?: boolean
          created_at?: string
        }
        Update: {
          title?: string | null
          category?: string
          published?: boolean
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          name?: string
          email?: string
          subject?: string
          message?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
