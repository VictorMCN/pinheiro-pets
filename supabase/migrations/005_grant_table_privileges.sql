-- ============================================================
-- Pinheiro Pets
-- Table privileges for Supabase API roles
-- ============================================================

-- ------------------------------------------------------------
-- PUBLIC SCHEMA
-- ------------------------------------------------------------

grant usage on schema public to anon, authenticated;

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------

-- Profiles are private application data.
-- Authenticated users may read profiles according to RLS policies.
grant select
on public.profiles
to authenticated;

-- ------------------------------------------------------------
-- LOST PETS
-- ------------------------------------------------------------

-- Visitors may read approved lost pet posts according to RLS.
grant select
on public.lost_pets
to anon;

-- Authenticated users need CRUD privileges.
-- RLS decides which rows they are actually allowed to access.
grant select, insert, update, delete
on public.lost_pets
to authenticated;

-- ------------------------------------------------------------
-- ADOPTION PETS
-- ------------------------------------------------------------

grant select
on public.adoption_pets
to anon;

grant select, insert, update, delete
on public.adoption_pets
to authenticated;

-- ------------------------------------------------------------
-- NGOS
-- ------------------------------------------------------------

grant select
on public.ngos
to anon;

grant select, insert, update, delete
on public.ngos
to authenticated;

-- ------------------------------------------------------------
-- HELPER FUNCTIONS
-- ------------------------------------------------------------

grant execute
on function public.is_admin()
to authenticated;