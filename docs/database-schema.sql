-- ============================================================
-- EGA Mentorship International — Supabase Database Schema
-- Run this in the Supabase SQL Editor (in order)
-- ============================================================

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('participant', 'mentor')),
  full_name text not null,
  country text,
  avatar_url text,
  sdg_focus int[] default '{}',
  bio text,
  created_at timestamptz default now()
);

-- Mentorship Pairs
create table if not exists mentorship_pairs (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references profiles(id) on delete cascade,
  participant_id uuid references profiles(id) on delete cascade,
  matched_at timestamptz default now(),
  status text default 'active' check (status in ('active', 'completed', 'paused'))
);

-- Sessions
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references profiles(id) on delete cascade,
  participant_id uuid references profiles(id) on delete cascade,
  scheduled_at timestamptz,
  notes text,
  status text default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- Projects (4-stage cycle)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references profiles(id) on delete cascade,
  title text not null,
  sdg_number int check (sdg_number between 1 and 17),
  stage int default 1 check (stage between 1 and 4),
  status text default 'active' check (status in ('active', 'completed', 'paused')),
  description text,
  created_at timestamptz default now()
);

-- Milestones (skill scores over time)
create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references profiles(id) on delete cascade,
  type text not null check (type in ('leadership', 'sdg_engagement', 'communication', 'projects', 'overall')),
  score int check (score between 0 and 100),
  recorded_at timestamptz default now()
);

-- SDG Progress
create table if not exists sdg_progress (
  participant_id uuid references profiles(id) on delete cascade,
  sdg_number int check (sdg_number between 1 and 17),
  engaged_at timestamptz default now(),
  level text default 'aware' check (level in ('aware', 'learning', 'acting', 'leading')),
  primary key (participant_id, sdg_number)
);

-- Portfolio Items
create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references profiles(id) on delete cascade,
  type text not null check (type in ('article', 'project', 'certificate', 'video')),
  title text not null,
  content_url text,
  published boolean default false,
  created_at timestamptz default now()
);

-- Blog Posts
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete set null,
  title text not null,
  slug text unique not null,
  content text,
  published boolean default false,
  created_at timestamptz default now()
);

-- Gallery Photos
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references profiles(id) on delete set null,
  title text,
  category text default 'events' check (category in ('events', 'programs', 'sdg', 'team', 'conferences')),
  image_url text not null,
  published boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table mentorship_pairs enable row level security;
alter table sessions enable row level security;
alter table projects enable row level security;
alter table milestones enable row level security;
alter table sdg_progress enable row level security;
alter table portfolio_items enable row level security;
alter table blog_posts enable row level security;
alter table gallery_photos enable row level security;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Profiles
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_mentor_reads_mentees"
  on profiles for select
  using (
    exists (
      select 1 from mentorship_pairs
      where mentor_id = auth.uid() and participant_id = profiles.id
    )
  );

create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

-- Mentorship Pairs
create policy "pairs_read"
  on mentorship_pairs for select
  using (auth.uid() = mentor_id or auth.uid() = participant_id);

create policy "pairs_insert_mentor"
  on mentorship_pairs for insert
  with check (auth.uid() = mentor_id);

-- Sessions: both parties can read/write
create policy "sessions_rw"
  on sessions for all
  using (auth.uid() = mentor_id or auth.uid() = participant_id);

-- Projects: participant manages own; mentor reads mentees'
create policy "projects_own"
  on projects for all
  using (auth.uid() = participant_id);

create policy "projects_mentor_read"
  on projects for select
  using (
    exists (
      select 1 from mentorship_pairs
      where mentor_id = auth.uid() and participant_id = projects.participant_id
    )
  );

-- Milestones
create policy "milestones_insert_own"
  on milestones for insert
  with check (auth.uid() = participant_id);

create policy "milestones_read"
  on milestones for select
  using (
    auth.uid() = participant_id or
    exists (
      select 1 from mentorship_pairs
      where mentor_id = auth.uid() and participant_id = milestones.participant_id
    )
  );

-- SDG Progress: participant manages own
create policy "sdg_progress_own"
  on sdg_progress for all
  using (auth.uid() = participant_id);

create policy "sdg_progress_mentor_read"
  on sdg_progress for select
  using (
    exists (
      select 1 from mentorship_pairs
      where mentor_id = auth.uid() and participant_id = sdg_progress.participant_id
    )
  );

-- Portfolio: owner manages; published items publicly readable
create policy "portfolio_owner"
  on portfolio_items for all
  using (auth.uid() = participant_id);

create policy "portfolio_public_read"
  on portfolio_items for select
  using (published = true);

-- Blog: published posts publicly readable; author manages own
create policy "blog_public_read"
  on blog_posts for select
  using (published = true);

create policy "blog_author"
  on blog_posts for all
  using (auth.uid() = author_id);

-- Gallery: published photos publicly readable; uploader manages own
create policy "gallery_public_read"
  on gallery_photos for select
  using (published = true);

create policy "gallery_uploader"
  on gallery_photos for all
  using (auth.uid() = uploaded_by);

-- ============================================================
-- AUTH TRIGGER — auto-create profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, country)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'participant'),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'country'
  );
  return new;
end;
$$;

-- Drop trigger if it already exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE BUCKETS
-- Create these in Supabase Dashboard → Storage → New bucket
-- ============================================================
-- Bucket: avatars  (public)
-- Bucket: gallery  (public)

-- ============================================================
-- INDEXES (performance)
-- ============================================================

create index if not exists idx_sessions_mentor on sessions(mentor_id);
create index if not exists idx_sessions_participant on sessions(participant_id);
create index if not exists idx_milestones_participant on milestones(participant_id);
create index if not exists idx_milestones_recorded_at on milestones(recorded_at desc);
create index if not exists idx_projects_participant on projects(participant_id);
create index if not exists idx_pairs_mentor on mentorship_pairs(mentor_id);
create index if not exists idx_pairs_participant on mentorship_pairs(participant_id);
create index if not exists idx_sdg_progress_participant on sdg_progress(participant_id);
create index if not exists idx_blog_posts_slug on blog_posts(slug);
create index if not exists idx_blog_posts_published on blog_posts(published, created_at desc);
create index if not exists idx_gallery_category on gallery_photos(category, published);
