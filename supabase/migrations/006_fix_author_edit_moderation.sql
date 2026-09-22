-- ============================================================
-- Pinheiro Pets
-- Author edit moderation fix
-- ============================================================

create or replace function public.reset_status_after_user_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid;
  publication_owner_id uuid;
  content_changed boolean;
begin

  current_user_id := auth.uid();

  -- Allow direct database administration through the SQL Editor.
  if current_user_id is null then
    return new;
  end if;

  -- Support both pet publications and NGO registrations.
  publication_owner_id := coalesce(
    (to_jsonb(old) ->> 'author_id')::uuid,
    (to_jsonb(old) ->> 'owner_id')::uuid
  );

  -- Publication ownership must remain unchanged.
  if
    (to_jsonb(new) ->> 'author_id')
      is distinct from
    (to_jsonb(old) ->> 'author_id')

    or

    (to_jsonb(new) ->> 'owner_id')
      is distinct from
    (to_jsonb(old) ->> 'owner_id')
  then
    raise exception 'Publication ownership cannot be changed';
  end if;

  -- Check whether publication content was modified.
  -- Status and update timestamp changes are not content edits.
  content_changed := (
    to_jsonb(new) - 'status' - 'updated_at'
  ) is distinct from (
    to_jsonb(old) - 'status' - 'updated_at'
  );

  if content_changed then

    -- Administrators cannot edit publications belonging
    -- to other users.
    if publication_owner_id is distinct from current_user_id then
      raise exception 'Only the author can edit publication content';
    end if;

    -- Every author edit requires a new administrative review,
    -- even when the author also has the ADMIN role.
    new.status := 'PENDING'::public.publication_status;

  elsif not public.is_admin() then

    -- Regular users cannot approve or reject publications.
    new.status := 'PENDING'::public.publication_status;

  end if;

  return new;

end;
$$;