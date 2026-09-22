-- ============================================================
-- Pinheiro Pets
-- Initial database schema
-- Educational university extension project
-- ============================================================

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------

create type public.user_role as enum (
  'USER',
  'ADMIN'
);

create type public.publication_status as enum (
  'PENDING',
  'APPROVED',
  'REJECTED'
);

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role public.user_role not null default 'USER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- LOST PETS
-- ------------------------------------------------------------

create table public.lost_pets (
  id uuid primary key default gen_random_uuid(),

  author_id uuid not null
    references public.profiles(id)
    on delete cascade,

  name text not null,
  species text not null,
  breed text,
  sex text,
  color text,
  size text,

  description text,

  administrative_region text not null,
  last_seen_location text not null,
  disappeared_at date not null,

  contact_name text not null,
  contact_phone text not null,

  image_url text,

  status public.publication_status not null default 'PENDING',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ADOPTION PETS
-- ------------------------------------------------------------

create table public.adoption_pets (
  id uuid primary key default gen_random_uuid(),

  author_id uuid not null
    references public.profiles(id)
    on delete cascade,

  name text not null,
  species text not null,
  breed text,
  age text,
  sex text,
  size text,

  vaccinated boolean not null default false,
  neutered boolean not null default false,

  description text not null,

  administrative_region text not null,

  contact_name text not null,
  contact_phone text not null,

  image_url text,

  status public.publication_status not null default 'PENDING',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- NGOS
-- ------------------------------------------------------------

create table public.ngos (
  id uuid primary key default gen_random_uuid(),

  owner_id uuid not null
    references public.profiles(id)
    on delete cascade,

  name text not null,
  description text not null,

  administrative_region text not null,
  address text,

  phone text not null,
  email text,
  instagram text,

  pix_key text,

  logo_url text,

  status public.publication_status not null default 'PENDING',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- AUTOMATIC PROFILE CREATION
-- ------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    name
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'Usuário')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ------------------------------------------------------------
-- BACKFILL EXISTING USERS
-- ------------------------------------------------------------

insert into public.profiles (
  id,
  name
)
select
  id,
  coalesce(raw_user_meta_data ->> 'name', 'Usuário')
from auth.users
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- UPDATED_AT
-- ------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();

  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger lost_pets_set_updated_at
before update on public.lost_pets
for each row
execute function public.set_updated_at();

create trigger adoption_pets_set_updated_at
before update on public.adoption_pets
for each row
execute function public.set_updated_at();

create trigger ngos_set_updated_at
before update on public.ngos
for each row
execute function public.set_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.lost_pets enable row level security;
alter table public.adoption_pets enable row level security;
alter table public.ngos enable row level security;