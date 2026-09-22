create or replace function public.enforce_lost_pet_pending_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  pending_count integer;
begin
  -- Only pending publications count toward the limit.
  if new.status <> 'PENDING'::public.publication_status then
    return new;
  end if;

  -- Serialize checks for publications from the same author.
  perform pg_advisory_xact_lock(
    hashtextextended(new.author_id::text, 0)
  );

  select count(*)
  into pending_count
  from public.lost_pets
  where author_id = new.author_id
    and status = 'PENDING'::public.publication_status;

  if pending_count > 2 then
    raise exception
      'A user can have at most 2 pending lost pet publications';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_lost_pet_pending_limit
on public.lost_pets;

create trigger enforce_lost_pet_pending_limit
after insert or update on public.lost_pets
for each row
execute function public.enforce_lost_pet_pending_limit();