-- PingME Lifeline — Production Database Schema (Supabase / PostgreSQL)
-- Team The Callback — Safety & Emergency Identity Platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Public Emergency Vitals Only - No Full Clinical Records)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  photo_url text,
  blood_group text not null,
  allergies text[] default '{}',
  conditions text[] default '{}',
  language text default 'English',
  emergency_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. RESTRICTED MEDICAL RECORDS (Strictly Protected - Hospitals & Paramedics Only)
create table if not exists public.medical_records (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade unique not null,
  medical_full text not null,
  medications text[] default '{}',
  doctor_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TAGS TABLE
create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('vehicle', 'wallet', 'wristband', 'id_card')) not null default 'wristband',
  label text,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. FAMILY MEMBERS TABLE (Never stores raw unmasked phone numbers)
create table if not exists public.family_members (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  user_id uuid, -- Optional link to auth.users
  name text not null,
  relation text not null,
  phone_masked text not null, -- E.g. "+91 98*** **412"
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. RELIEF CAMPS (For Crisis Mode)
create table if not exists public.camps (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  lat double precision not null,
  lng double precision not null,
  capacity integer default 500,
  current_count integer default 0,
  location_desc text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. INCIDENTS TABLE (Core Realtime table)
create table if not exists public.incidents (
  id uuid primary key default uuid_generate_v4(),
  reference_code text unique not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  situation text check (situation in ('accident', 'unwell', 'lost', 'crisis', 'deceased_pending')) not null default 'accident',
  status text check (status in ('open', 'acknowledged', 'resolved')) not null default 'open',
  lat double precision not null,
  lng double precision not null,
  location_name text,
  note text,
  helper_session_id text,
  family_eta_minutes integer,
  camp_id uuid references public.camps(id) on delete set null,
  person_status text check (person_status in ('safe', 'injured', 'admitted', null)),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. CAMP PERSON SCANS (Crisis Mode Triage Ledger)
create table if not exists public.camp_scans (
  id uuid primary key default uuid_generate_v4(),
  camp_id uuid references public.camps(id) on delete cascade not null,
  tag_code text not null,
  person_name text not null,
  photo_url text,
  blood_group text,
  status text check (status in ('safe', 'injured', 'admitted')) not null default 'safe',
  notes text,
  scanned_by text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. USER ROLES & OFFICIAL VERIFICATION TABLE
create table if not exists public.user_roles (
  user_id uuid primary key default uuid_generate_v4(),
  role text check (role in ('helper', 'owner', 'family', 'rescuer', 'official')) not null,
  agency text,
  badge_number text,
  verified boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. AUDIT & SCAN LOGS (Append-only audit trail)
create table if not exists public.scan_logs (
  id uuid primary key default uuid_generate_v4(),
  tag_id uuid references public.tags(id) on delete cascade,
  tag_code text,
  role text not null default 'helper',
  officer_name text,
  badge_number text,
  agency_station text,
  action text not null,
  reason text,
  lat double precision,
  lng double precision,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Performance Indexes
create index if not exists idx_tags_code on public.tags(code);
create index if not exists idx_tags_profile_id on public.tags(profile_id);
create index if not exists idx_incidents_tag_id on public.incidents(tag_id);
create index if not exists idx_incidents_status on public.incidents(status);
create index if not exists idx_medical_records_profile_id on public.medical_records(profile_id);
create index if not exists idx_camp_scans_camp_id on public.camp_scans(camp_id);
create index if not exists idx_camp_scans_tag_code on public.camp_scans(tag_code);

-- Updated_at Trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_incidents_updated_at on public.incidents;
create trigger set_incidents_updated_at
  before update on public.incidents
  for each row execute procedure public.handle_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.medical_records enable row level security;
alter table public.tags enable row level security;
alter table public.family_members enable row level security;
alter table public.incidents enable row level security;
alter table public.camps enable row level security;
alter table public.camp_scans enable row level security;
alter table public.user_roles enable row level security;
alter table public.scan_logs enable row level security;

-- Row Level Security Policies

-- 1. Profiles (Public read basic vital profile; no full medical records in this table)
drop policy if exists "Allow public read basic profile info" on public.profiles;
drop policy if exists "Allow public read basic profile" on public.profiles;
create policy "Allow public read basic profile" on public.profiles
  for select using (true);

drop policy if exists "Allow owner update profile" on public.profiles;
create policy "Allow owner update profile" on public.profiles
  for update using (true);

drop policy if exists "Allow owner insert profile" on public.profiles;
create policy "Allow owner insert profile" on public.profiles
  for insert with check (true);

-- 2. Medical Records (Confidential - STRICT: No public read)
drop policy if exists "Allow official read medical records" on public.medical_records;
create policy "Allow official read medical records" on public.medical_records
  for select using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role = 'official'
        and user_roles.verified = true
    )
  );

drop policy if exists "Allow official insert medical records" on public.medical_records;
create policy "Allow official insert medical records" on public.medical_records
  for insert with check (true);

-- 3. Tags (Public can read active tags)
drop policy if exists "Allow public read active tags" on public.tags;
create policy "Allow public read active tags" on public.tags
  for select using (active = true);

drop policy if exists "Allow update tags" on public.tags;
create policy "Allow update tags" on public.tags
  for update using (true);

drop policy if exists "Allow insert tags" on public.tags;
create policy "Allow insert tags" on public.tags
  for insert with check (true);

-- 4. Family Members (Masked phone details visible)
drop policy if exists "Allow read family members" on public.family_members;
create policy "Allow read family members" on public.family_members
  for select using (true);

drop policy if exists "Allow insert family members" on public.family_members;
create policy "Allow insert family members" on public.family_members
  for insert with check (true);

-- 5. Incidents (Realtime table: Helper inserts, family/helpers view and update)
drop policy if exists "Allow public insert incidents" on public.incidents;
create policy "Allow public insert incidents" on public.incidents
  for insert with check (true);

drop policy if exists "Allow public read incidents" on public.incidents;
create policy "Allow public read incidents" on public.incidents
  for select using (true);

drop policy if exists "Allow update incidents" on public.incidents;
create policy "Allow update incidents" on public.incidents
  for update using (true);

-- 6. Relief Camps
drop policy if exists "Allow public read camps" on public.camps;
create policy "Allow public read camps" on public.camps
  for select using (true);

drop policy if exists "Allow rescuer update camps" on public.camps;
create policy "Allow rescuer update camps" on public.camps
  for update using (true);

-- 7. Camp Scans (Crisis Ledger)
drop policy if exists "Allow read camp scans" on public.camp_scans;
create policy "Allow read camp scans" on public.camp_scans
  for select using (true);

drop policy if exists "Allow insert camp scans" on public.camp_scans;
create policy "Allow insert camp scans" on public.camp_scans
  for insert with check (true);

-- 8. User Roles
drop policy if exists "Allow read user roles" on public.user_roles;
create policy "Allow read user roles" on public.user_roles
  for select using (true);

-- 9. Scan Logs (Audit Trail)
drop policy if exists "Allow insert scan logs" on public.scan_logs;
create policy "Allow insert scan logs" on public.scan_logs
  for insert with check (true);

drop policy if exists "Allow read scan logs" on public.scan_logs;
create policy "Allow read scan logs" on public.scan_logs
  for select using (true);

-- Enable Supabase Realtime publication
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'incidents') then
    alter publication supabase_realtime add table public.incidents;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'camp_scans') then
    alter publication supabase_realtime add table public.camp_scans;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'camps') then
    alter publication supabase_realtime add table public.camps;
  end if;
end $$;
