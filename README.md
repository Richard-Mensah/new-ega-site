# EGA Mentorship International — Full-Stack Web Platform

A production-grade web platform built for **EGA Mentorship International**, a global youth leadership NGO operating across 6 countries and aligned with all 17 UN Sustainable Development Goals. This project replaced a static HTML site with a fully dynamic, authenticated application — designed, architected, and built from the ground up.

**Stack:** Next.js 16 · Supabase · TypeScript · Tailwind CSS v4

---

## What This Project Is

EGA Mentorship International runs a two-year leadership program for young people aged 18–30, matching them with mentors and guiding them through SDG-aligned community projects. The old site was plain HTML with no interactivity.

This platform gives every stakeholder a proper digital home:

- **Participants** get a private dashboard to track their learning path, manage community projects, view their SDG progress, and build a professional portfolio
- **Mentors** get an analytics dashboard to monitor mentee growth, log sessions, and see cohort-level insights
- **The public** gets a full NGO website — about page, programs, services, 17 SDG pages, team profiles, blog, gallery, and educational consultancy service

---

## Technical Highlights

### Architecture

The app is built on the **Next.js 16 App Router** using React Server Components as the default. Pages fetch data directly on the server — no loading spinners, no client-side waterfalls. `"use client"` is only used where genuinely needed: forms, charts, interactive sidebars.

Route protection lives in `middleware.ts`, which creates a Supabase server client from request cookies and redirects unauthenticated users before any page renders.

### Authentication & Data

Supabase handles auth (email + password), PostgreSQL, and file storage. A database trigger automatically creates a `profiles` row whenever a new user signs up, so registration is a single Supabase call with no separate API round-trip.

Row-Level Security policies enforce data ownership at the database level — participants can only see their own data, mentors can read their mentees' data, and public content is readable by anyone.

### Mentor Analytics

The analytics dashboard features a live **Recharts line chart** that tracks each mentee's skill score over 1, 3, or 6 months. The top performer's line is highlighted in gold automatically. Data is fetched client-side via a custom `useMenteeGrowth` hook that groups milestones by calendar week.

### Type Safety

One of the more interesting debugging challenges: `@supabase/supabase-js` v2.103.0 introduced a `Relationships` field requirement on the `GenericTable` type. Without it, every query's return type collapses to `never`, making the entire Supabase client unusable. Diagnosing this required reading the compiled `.d.mts` declaration files directly to trace the broken `extends GenericSchema` constraint — nothing in the changelog or docs mentioned it.

### SDG Pages

All 17 UN Sustainable Development Goal pages are statically generated at build time using `generateStaticParams()`. Each page includes EGA's specific approach to that SDG, a visual rainbow bar, and prev/next navigation through the goals.

---

## Pages & Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static | Hero, animated stats counter, services grid, team teaser, CTA |
| `/about` | Static | Mission, vision, 8 pillars of impact, global presence |
| `/services` | Static | 6 service areas with descriptions |
| `/edu-consult` | Static | Educational consultancy — 4-step process, features |
| `/sdgs` | Static | Grid of all 17 SDGs with official UN color coding |
| `/sdgs/[slug]` | SSG (17 paths) | Individual SDG pages with EGA's approach |
| `/programs` | Static | Year 1 & Year 2 curriculum breakdown |
| `/team` | Static | 6 team member profiles |
| `/blog` | Dynamic | Supabase-backed blog posts with sample fallback |
| `/blog/[slug]` | Dynamic | Full article view |
| `/gallery` | Dynamic | Filterable photo gallery by category |
| `/contact` | Static | Contact form with Zod validation |
| `/register` | Static | 3-step registration (role → profile → SDG interests) |
| `/login` | Static | Email/password login with role-based redirect |
| `/dashboard` | Dynamic (auth) | Participant home — metrics, SDG bar, activity feed, mentor panel |
| `/dashboard/learning` | Dynamic (auth) | 10-module curriculum with progress tracking |
| `/dashboard/projects` | Dynamic (auth) | 4-stage project pipeline |
| `/dashboard/mentor` | Dynamic (auth) | Assigned mentor profile + session history |
| `/dashboard/portfolio` | Dynamic (auth) | Portfolio items — articles, projects, certificates, videos |
| `/dashboard/settings` | Dynamic (auth) | Profile editing with live save |
| `/mentor` | Dynamic (auth) | Mentor overview — stats and mentee list |
| `/mentor/analytics` | Dynamic (auth) | KPIs, Recharts growth chart, mentee performance cards |
| `/mentor/mentees` | Dynamic (auth) | Full mentee profiles with country and bio |
| `/mentor/sessions` | Dynamic (auth) | Session history split into upcoming and past |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 (CSS-native config via `@theme`) |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Query Layer | Supabase JS v2 with full typed `Database` generic |
| Forms | react-hook-form + Zod |
| Charts | Recharts (LineChart with dynamic mentee lines) |
| Animation | Framer Motion (scroll-triggered count-up on stats) |
| Icons | lucide-react |
| Utilities | clsx + tailwind-merge |
| Deployment | Vercel |

---

## Project Structure

```
new-ega-site/
├── app/                    # All routes (App Router)
│   ├── dashboard/          # Participant dashboard (auth-protected)
│   ├── mentor/             # Mentor dashboard (auth-protected)
│   ├── sdgs/[slug]/        # 17 statically generated SDG pages
│   └── api/                # API routes (auth callback, contact form)
├── components/
│   ├── ui/                 # Reusable atoms: Card, Badge, Button, Modal, SdgRainbowBar
│   ├── layout/             # Navbar, Footer, DashboardSidebar, MentorSidebar
│   └── features/           # Page-specific feature components
├── lib/
│   ├── supabase/           # Server and browser Supabase clients
│   ├── constants/          # SDG list (17 entries), team members, countries
│   └── validations.ts      # Zod schemas for all forms
├── hooks/                  # useMenteeGrowth, useUser
├── types/                  # Full Database type with Relationships, helper Tables<T>
├── middleware.ts            # Route protection
└── docs/
    └── database-schema.sql # Complete Supabase SQL — tables, RLS, trigger, indexes
```

---

## Running Locally

```bash
git clone https://github.com/yourusername/ega-mentorship-web
cd ega-mentorship-web/new-ega-site
npm install
```

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Run the SQL in `docs/database-schema.sql` in the Supabase SQL Editor, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

9 tables with full Row-Level Security:

| Table | Purpose |
|---|---|
| `profiles` | Extends `auth.users` — role, country, SDG focus, bio, avatar |
| `mentorship_pairs` | Links mentor ↔ participant with status tracking |
| `sessions` | Scheduled and completed mentorship sessions |
| `projects` | SDG-aligned community projects (4-stage pipeline) |
| `milestones` | Skill scores over time (leadership, SDG engagement, overall…) |
| `sdg_progress` | Which SDGs each participant has engaged with |
| `portfolio_items` | Articles, certificates, videos, project writeups |
| `blog_posts` | Published articles with slug-based routing |
| `gallery_photos` | Program and event photography organized by category |

A Postgres trigger (`on_auth_user_created`) auto-inserts a `profiles` row on every new signup, seeding `role`, `full_name`, and `country` from the auth metadata — no separate profile creation API call needed.

---

## Design System

Brand colors defined in `globals.css` via Tailwind v4's `@theme` block:

- **Navy** `#0D1B4B` — headings, sidebars, navbar, hero backgrounds
- **Gold** `#C9A84C` — CTAs, active states, highlights, top-performer chart line
- **Page BG** `#F0F2F5` — dashboard page background
- **Warm BG** `#F8F6F0` — alternate public section backgrounds
- **17 SDG colors** — all official UN palette colors available as `bg-sdg-1` through `bg-sdg-17`

---

## Interesting Problems I Solved

**The `never` type mystery.** All Supabase queries were returning `never` despite the `Database` type looking correct. After going through the compiled `.d.mts` files, I found that `@supabase/supabase-js` v2.103.0 added a `Relationships` field to `GenericTable`. Without it on every table definition, TypeScript's `extends GenericSchema` check fails silently and collapses the entire schema type to `never`. One field, 9 tables, hours of debugging.

**Tailwind v4.** Switched from `tailwind.config.ts` to a CSS-native `@theme` block in `globals.css`. All brand colors and SDG colors live there as custom properties (`--color-brand-navy`) which Tailwind auto-generates utilities for (`bg-brand-navy`, `text-brand-navy`). Cleaner than a JS config file.

**Dashboard layout without route groups.** I could have restructured 44 files into `(public)/` and `(dashboard)/` route groups — but that's high-risk file surgery mid-project. Instead I wrote a `ConditionalLayout` client component that reads `usePathname()` and conditionally renders Navbar/Footer only on public routes. Same outcome, zero file moves.

**Server pages, client charts.** The mentor analytics page is a server component that runs authenticated Supabase queries and computes KPIs. The Recharts chart inside it is a separate client component with its own `useMenteeGrowth` hook. They compose cleanly — the server page handles auth and aggregates, the client component handles interactivity and rendering.

---

## License

Built for EGA Mentorship International. All rights reserved.
