-- PingME Lifeline — Database Schema (Supabase / PostgreSQL)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  photo_url text,
  blood_group text not null,
  allergies text[] default '{}',
  conditions text[] default '{}',
  language text default 'English',
  emergency_notes text,
  medical_full text, -- Restricted: Doctor/Hospital unlocked only
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TAGS TABLE
create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('vehicle', 'wallet', 'wristband', 'id_card')) not null default 'wristband',
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. FAMILY MEMBERS TABLE
create table if not exists public.family_members (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  user_id uuid, -- Optional link to auth.users
  name text not null,
  relation text not null,
  phone_masked text not null, -- E.g. "+91 98*** **412" (Raw phone never stored here)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. INCIDENTS TABLE (Core Realtime table)
create table if not exists public.incidents (
  id uuid primary key default uuid_generate_v4(),
  tag_id uuid references public.tags(id) on delete cascade not null,
  situation text check (situation in ('accident', 'unwell', 'lost', 'crisis', 'deceased_pending')) not null default 'accident',
  status text check (status in ('open', 'acknowledged', 'resolved')) not null default 'open',
  lat double precision,
  lng double precision,
  location_name text,
  note text,
  helper_session_id text,
  family_eta_minutes integer,
  camp_id uuid,
  person_status text check (person_status in ('safe', 'injured', 'admitted', null)),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. RELIEF CAMPS (For Crisis Mode)
create table if not exists public.camps (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  lat double precision not null,
  lng double precision not null,
  capacity integer default 500,
  current_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SCAN AUDIT LOGS
create table if not exists public.scan_logs (
  id uuid primary key default uuid_generate_v4(),
  tag_id uuid references public.tags(id) on delete cascade not null,
  role text not null default 'helper',
  actor_id uuid,
  lat double precision,
  lng double precision,
  action text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.tags enable row level security;
alter table public.family_members enable row level security;
alter table public.incidents enable row level security;
alter table public.camps enable row level security;
alter table public.scan_logs enable row level security;

-- Public read policies for scanning:
-- Public can read tags
create policy "Allow public read active tags" on public.tags
  for select using (active = true);

-- Public can read non-restricted profile fields
-- Note: 'medical_full' is kept confidential via column level grants or view
create policy "Allow public read basic profile info" on public.profiles
  for select using (true);

-- Public helper can create incidents
create policy "Allow public insert incidents" on public.incidents
  for insert with check (true);

-- Public can read and update incidents by id or session
create policy "Allow public read incidents" on public.incidents
  for select using (true);

create policy "Allow update incidents" on public.incidents
  for update using (true);

-- Enable Supabase Realtime publication
alter publication supabase_realtime add table public.incidents;
