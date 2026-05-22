# EGA Community & Participant Profiles — Design Spec

**Date:** 2026-05-22  
**Status:** Approved  
**Author:** Brainstorming session with Richard Mensah

---

## Context

The EGA platform has a `/dashboard/community` page that shows a basic grid of participant cards with a like button. Participants want to view each other's full profiles (like LinkedIn but lightweight) and appreciate peers' work. The page currently has no individual profile pages, no search or filtering, and the cards are minimal. This spec upgrades the community section into a rich, professional discovery and appreciation experience while protecting participant privacy.

---

## Goals

1. **Discovery** — Participants can search and filter peers by name, country, or SDG focus
2. **Individual profiles** — Each participant has their own profile page showcasing their work
3. **Appreciation** — Toggle-style heart button (already built); shown prominently on both grid and profile
4. **Privacy** — Email, date of birth, and internal system details are never exposed
5. **Lightweight** — Server-rendered pages with minimal client JS; no real-time feeds

---

## Routes

| Route | Type | Description |
|---|---|---|
| `/dashboard/community` | Server Component | Upgraded grid — search, filters, rich cards |
| `/dashboard/community/[participantId]` | Server Component | Individual participant profile page |

Both routes are auth-gated: redirect to `/login` if no session.

---

## 1. Community Grid Page (`/dashboard/community`)

### Layout
- Page header: title "Community" + participant count
- Search input (client-side filter by name, organisation, country)
- SDG filter chips (All + individual SDG chips coloured by SDG colour) + Country filter
- Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Empty state preserved from current implementation

### Card Design — Rich Portrait Card
Each card contains:

```
┌─────────────────────────────────────┐
│  [navy gradient banner, 52px]       │  ← SDG colour dots bottom-left
│  [SDG dot][SDG dot][SDG dot]        │
├──[Avatar overlapping banner]────────┤
│  Name (bold, navy)                  │
│  Organisation (gold, small)         │
│  Country flag + name                │
│                                     │
│  Bio text (2-line clamp)            │
│                                     │
├─────────────────────────────────────┤
│  ♥ 12          View Profile →      │
└─────────────────────────────────────┘
```

- Avatar: rounded square (10px radius), overlaps banner by ~20px, gold border
- SDG dots: coloured squares at bottom-left of banner, one per focus SDG (up to 3)
- "View Profile →" navigates to `/dashboard/community/[participantId]`
- `♥ N` uses the existing `LikeButton` component
- Hover: `translateY(-2px)` + deeper shadow + "View Profile →" text inverts to navy/white

### Search & Filter (Client Component wrapper)
- Search box filters by `full_name`, `organization`, `country` (client-side, no extra DB call)
- SDG filter chips filter cards to those whose `sdg_focus` includes the selected SDG number
- Country filter: dropdown or chip, populated from unique countries in the fetched list
- Active filter chip: `bg-brand-navy text-white`; inactive: `border border-gray-200 text-gray-600`
- "All" chip resets filters

### Data Fetching
```ts
// Parallel fetch — same pattern as existing community page
const [participants, likes] = await Promise.all([
  supabase.from("profiles")
    .select("id, full_name, country, organization, bio, avatar_url, sdg_focus, created_at")
    .eq("role", "participant")
    .neq("id", user.id)
    .order("created_at", { ascending: false }),
  supabase.from("profile_likes").select("liker_id, liked_id")
])
```

**Privacy:** Only safe columns are selected — no `email` (lives in `auth.users` anyway), no `last_seen_at`, no `linkedin_url` (not needed on grid).

---

## 2. Individual Profile Page (`/dashboard/community/[participantId]`)

### Layout
Two-column at `lg+`, single column on mobile:
- **Left column** (main): Hero card → About → SDG Focus → Portfolio → SDG Progress → Projects → Awards
- **Right sidebar**: Stats snapshot (appreciations / portfolio count / awards count) → LinkedIn link → Privacy note

### Hero Card
- Navy gradient background (`#0D1B4B → #1a3280`)
- Large rounded-square avatar (72px), gold gradient background if no photo
- Name (20px bold white), organisation (gold), country + cohort join date in muted white
- **Appreciate button** (top-right of hero): large gold pill with heart icon, appreciation count, "Appreciations" label — filled gold when already appreciated, transparent gold border when not. This is a **larger visual variant** than the small grid card button. Implement as `AppreciateButton` (new component) that shares the same toggle logic (POST/DELETE to `/api/likes/[profileId]`) but renders a different layout.

### Sections (left column, in order)

| Section | Data source | Notes |
|---|---|---|
| About | `profiles.bio` | Shown only if bio exists |
| SDG Focus Areas | `profiles.sdg_focus` | Full SDG chips with colour + name |
| Portfolio | `portfolio_items` where `published = true` | 2-col grid; shows type badge, title, tags, external link if `content_url` set |
| SDG Engagement Progress | `sdg_progress` | Progress bar per SDG; levels: Aware 25% / Learning 50% / Acting 75% / Leading 100% |
| Active Projects | `projects` | Title, SDG badge, stage pill; only shows `stage` and `title` |
| EGA Awards | `mentor_awards` | Colour-coded by category (leadership/sdg_engagement/communication/projects/overall) |
| LinkedIn | `profiles.linkedin_url` | In sidebar; rendered only if value exists |

**Conditional rendering rules:** Each section is omitted entirely if its data is empty — no empty-state placeholders within section cards. Exception: Portfolio shows "No published items yet" if participant has items in draft but none published (to distinguish from "hasn't added anything"). If all optional sections are empty, the profile still renders correctly with just Hero + About + SDG Focus.

### Privacy Rules — What is Hidden
| Field | Reason |
|---|---|
| `email` | In `auth.users`, never in profiles query |
| Date of birth | Not stored in schema; never shown |
| `last_seen_at` | Reveals real-time activity; omitted from select |
| Raw UUIDs in body text | Profile ID is in the URL (unavoidable) but never displayed as text |
| Draft portfolio items | Only `published = true` items fetched |

### Data Fetching
```ts
// All parallel — one round trip
const [profile, portfolio, sdgProgress, projects, awards, likeData] = await Promise.all([
  supabase.from("profiles")
    .select("id, full_name, country, organization, bio, avatar_url, sdg_focus, linkedin_url, created_at")
    .eq("id", participantId).eq("role", "participant").single(),

  supabase.from("portfolio_items")
    .select("id, type, title, description, tags, content_url")
    .eq("participant_id", participantId).eq("published", true)
    .order("created_at", { ascending: false }),

  supabase.from("sdg_progress")
    .select("sdg_number, level")
    .eq("participant_id", participantId),

  supabase.from("projects")
    .select("id, title, sdg_number, stage, status")
    .eq("participant_id", participantId)
    .order("created_at", { ascending: false }),

  supabase.from("mentor_awards")
    .select("id, category, title, notes, awarded_at")
    .eq("participant_id", participantId)
    .order("awarded_at", { ascending: false }),

  supabase.from("profile_likes")
    .select("liker_id", { count: "exact" })
    .eq("liked_id", participantId),
])
```

If `profile` is null or `role !== "participant"` → `notFound()` (404).

---

## 3. Reused Infrastructure

| What | File | Usage |
|---|---|---|
| `LikeButton` | `components/features/community/LikeButton.tsx` | Reused as-is on both grid and profile hero |
| Likes API | `app/api/likes/[profileId]/route.ts` | Reused as-is (POST to like, DELETE to unlike) |
| `ProfileAvatar` | `components/ui/ProfileAvatar.tsx` | Avatar with initials fallback |
| `SDG_LIST` | `lib/constants/sdgs.ts` | SDG colours, names, numbers |
| Supabase server client | `lib/supabase/server.ts` | All server-side fetching |

---

## 4. New Files

| File | Purpose |
|---|---|
| `app/dashboard/community/[participantId]/page.tsx` | Profile page server component |
| `components/features/community/CommunityGrid.tsx` | Client wrapper — search + filter state |
| `components/features/community/ParticipantCard.tsx` | Rich portrait card component |
| `components/features/community/ProfileHero.tsx` | Hero section of profile page |
| `components/features/community/ProfileSections.tsx` | Remaining section cards (About, SDG, Portfolio, etc.) |
| `components/features/community/AppreciateButton.tsx` | Large gold appreciate button for profile hero (same API as LikeButton, different UI) |

`app/dashboard/community/page.tsx` — rewritten to use `CommunityGrid`.

---

## 5. SQL Migration Required

Run in Supabase SQL Editor before deploying:

```sql
-- Allow authenticated participants to read other participants' public profile fields
-- (Required if current RLS only allows reading own profile)
CREATE POLICY IF NOT EXISTS "profiles_participants_read_others"
ON profiles FOR SELECT
USING (auth.uid() IS NOT NULL AND role = 'participant');

-- profile_likes: allow any authenticated user to see all likes (for counts)
-- (May already exist — check before running)
CREATE POLICY IF NOT EXISTS "profile_likes_read_all"
ON profile_likes FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "profile_likes_insert_own"
ON profile_likes FOR INSERT
WITH CHECK (auth.uid() = liker_id);

CREATE POLICY IF NOT EXISTS "profile_likes_delete_own"
ON profile_likes FOR DELETE
USING (auth.uid() = liker_id);
```

Also ensure the `profile_likes` table exists (from prior session — may already be migrated):
```sql
CREATE TABLE IF NOT EXISTS profile_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  liked_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (liker_id, liked_id)
);
ALTER TABLE profile_likes ENABLE ROW LEVEL SECURITY;
```

---

## 6. Verification

1. Open `/dashboard/community` — grid shows portrait cards with SDG colour dots in banner
2. Search "Amara" — cards filter live without page reload
3. Click an SDG filter chip — only participants with that SDG focus remain
4. Click "View Profile →" on a card — navigates to `/dashboard/community/[id]`
5. Profile page shows all 7 sections (About, SDG Focus, Portfolio, SDG Progress, Projects, Awards, LinkedIn if set)
6. Click Appreciate button — count increments, button fills gold; click again — count decrements, button returns to outline
7. Directly visit `/dashboard/community/[mentorId]` — returns 404 (mentors are not participant role)
8. Confirm no email address appears anywhere on the profile page
9. Portfolio section shows only `published = true` items

---

## Visual Reference

Full interactive mockup saved at:
`.superpowers/brainstorm/440-1779459352/content/full-profile-mockup.html`
