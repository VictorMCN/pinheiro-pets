-- ============================================================
-- Pinheiro Pets
-- Row Level Security policies
-- ============================================================

-- ------------------------------------------------------------
-- ADMIN HELPER
-- ------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'ADMIN'::public.user_role
  );
$$;

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);

create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (
  public.is_admin()
);

-- Profiles are created automatically by the authentication trigger.
-- Regular users cannot insert, update, or delete profiles directly.

-- ------------------------------------------------------------
-- LOST PETS - SELECT
-- ------------------------------------------------------------

create policy "Public can view approved lost pets"
on public.lost_pets
for select
to anon, authenticated
using (
  status = 'APPROVED'
);

create policy "Authors can view their own lost pet posts"
on public.lost_pets
for select
to authenticated
using (
  author_id = auth.uid()
);

create policy "Admins can view all lost pet posts"
on public.lost_pets
for select
to authenticated
using (
  public.is_admin()
);

-- ------------------------------------------------------------
-- LOST PETS - INSERT
-- ------------------------------------------------------------

create policy "Users can create their own lost pet posts"
on public.lost_pets
for insert
to authenticated
with check (
  author_id = auth.uid()
  and status = 'PENDING'
);

-- ------------------------------------------------------------
-- LOST PETS - UPDATE
-- ------------------------------------------------------------

create policy "Authors and admins can update lost pet posts"
on public.lost_pets
for update
to authenticated
using (
  author_id = auth.uid()
  or public.is_admin()
)
with check (
  author_id = auth.uid()
  or public.is_admin()
);

-- ------------------------------------------------------------
-- LOST PETS - DELETE
-- ------------------------------------------------------------

create policy "Authors and admins can delete lost pet posts"
on public.lost_pets
for delete
to authenticated
using (
  author_id = auth.uid()
  or public.is_admin()
);

-- ------------------------------------------------------------
-- ADOPTION PETS - SELECT
-- ------------------------------------------------------------

create policy "Public can view approved adoption pets"
on public.adoption_pets
for select
to anon, authenticated
using (
  status = 'APPROVED'
);

create policy "Authors can view their own adoption posts"
on public.adoption_pets
for select
to authenticated
using (
  author_id = auth.uid()
);

create policy "Admins can view all adoption posts"
on public.adoption_pets
for select
to authenticated
using (
  public.is_admin()
);

-- ------------------------------------------------------------
-- ADOPTION PETS - INSERT
-- ------------------------------------------------------------

create policy "Users can create their own adoption posts"
on public.adoption_pets
for insert
to authenticated
with check (
  author_id = auth.uid()
  and status = 'PENDING'
);

-- ------------------------------------------------------------
-- ADOPTION PETS - UPDATE
-- ------------------------------------------------------------

create policy "Authors and admins can update adoption posts"
on public.adoption_pets
for update
to authenticated
using (
  author_id = auth.uid()
  or public.is_admin()
)
with check (
  author_id = auth.uid()
  or public.is_admin()
);

-- ------------------------------------------------------------
-- ADOPTION PETS - DELETE
-- ------------------------------------------------------------

create policy "Authors and admins can delete adoption posts"
on public.adoption_pets
for delete
to authenticated
using (
  author_id = auth.uid()
  or public.is_admin()
);

-- ------------------------------------------------------------
-- NGOS - SELECT
-- ------------------------------------------------------------

create policy "Public can view approved NGOs"
on public.ngos
for select
to anon, authenticated
using (
  status = 'APPROVED'
);

create policy "Owners can view their own NGOs"
on public.ngos
for select
to authenticated
using (
  owner_id = auth.uid()
);

create policy "Admins can view all NGOs"
on public.ngos
for select
to authenticated
using (
  public.is_admin()
);

-- ------------------------------------------------------------
-- NGOS - INSERT
-- ------------------------------------------------------------

create policy "Users can create their own NGO registrations"
on public.ngos
for insert
to authenticated
with check (
  owner_id = auth.uid()
  and status = 'PENDING'
);

-- ------------------------------------------------------------
-- NGOS - UPDATE
-- ------------------------------------------------------------

create policy "Owners and admins can update NGOs"
on public.ngos
for update
to authenticated
using (
  owner_id = auth.uid()
  or public.is_admin()
)
with check (
  owner_id = auth.uid()
  or public.is_admin()
);

-- ------------------------------------------------------------
-- NGOS - DELETE
-- ------------------------------------------------------------

create policy "Owners and admins can delete NGOs"
on public.ngos
for delete
to authenticated
using (
  owner_id = auth.uid()
  or public.is_admin()
);

-- ------------------------------------------------------------
-- MODERATION SAFETY
-- ------------------------------------------------------------

create or replace function public.reset_status_after_user_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    new.status = 'PENDING'::public.publication_status;
  end if;

  return new;
end;
$$;

create trigger lost_pets_reset_status_after_update
before update on public.lost_pets
for each row
execute function public.reset_status_after_user_update();

create trigger adoption_pets_reset_status_after_update
before update on public.adoption_pets
for each row
execute function public.reset_status_after_user_update();

create trigger ngos_reset_status_after_update
before update on public.ngos
for each row
execute function public.reset_status_after_user_update();