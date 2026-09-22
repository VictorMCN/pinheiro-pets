-- Add the Storage object path to adoption publications.
alter table public.adoption_pets
add column if not exists image_path text;


-- Create the public bucket used by adoption pet images.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'adoption-pets',
  'adoption-pets',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id)
do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- Allow authenticated users to upload images only
-- inside their own UUID folder.
drop policy if exists
  "Users can upload their adoption pet images"
on storage.objects;

create policy
  "Users can upload their adoption pet images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'adoption-pets'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- Allow users to update files located in their own folder.
drop policy if exists
  "Users can update their adoption pet images"
on storage.objects;

create policy
  "Users can update their adoption pet images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'adoption-pets'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'adoption-pets'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- Allow users to delete files located in their own folder.
drop policy if exists
  "Users can delete their adoption pet images"
on storage.objects;

create policy
  "Users can delete their adoption pet images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'adoption-pets'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- Prevent one user from filling the moderation queue
-- with unlimited pending adoption publications.
create or replace function public.enforce_adoption_pet_pending_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  pending_count integer;
begin
  if new.status <> 'PENDING'::public.publication_status then
    return new;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(new.author_id::text, 0)
  );

  select count(*)
  into pending_count
  from public.adoption_pets
  where author_id = new.author_id
    and status = 'PENDING'::public.publication_status;

  if pending_count > 2 then
    raise exception
      'A user can have at most 2 pending adoption pet publications';
  end if;

  return new;
end;
$$;


drop trigger if exists enforce_adoption_pet_pending_limit
on public.adoption_pets;

create trigger enforce_adoption_pet_pending_limit
after insert or update on public.adoption_pets
for each row
execute function public.enforce_adoption_pet_pending_limit();