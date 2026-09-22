-- ============================================================
-- Pinheiro Pets
-- Moderation trigger fix
-- ============================================================

create or replace function public.reset_status_after_user_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Authenticated regular users must submit edited content
  -- for administrative review again.
  --
  -- Administrative/database operations without an authenticated
  -- application user are allowed to preserve the requested status.
  if auth.uid() is not null and not public.is_admin() then
    new.status = 'PENDING'::public.publication_status;
  end if;

  return new;
end;
$$;