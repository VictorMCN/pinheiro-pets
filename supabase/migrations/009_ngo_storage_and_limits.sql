-- Store the original Storage path of the NGO logo.
alter table public.ngos
add column if not exists logo_path text;


-- Create the public bucket used by NGO logos.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'ngo-logos',
  'ngo-logos',
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


-- Upload only inside the authenticated user's folder.
drop policy if exists
  "Users can upload their NGO logos"
on storage.objects;

create policy
  "Users can upload their NGO logos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'ngo-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- Update logos inside the user's own folder.
drop policy if exists
  "Users can update their NGO logos"
on storage.objects;

create policy
  "Users can update their NGO logos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'ngo-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'ngo-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- Delete logos inside the user's own folder.
drop policy if exists
  "Users can delete their NGO logos"
on storage.objects;

create policy
  "Users can delete their NGO logos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'ngo-logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- Prevent users from filling the moderation queue.
create or replace function public.enforce_ngo_pending_limit()
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
    hashtextextended(new.owner_id::text, 0)
  );

  select count(*)
  into pending_count
  from public.ngos
  where owner_id = new.owner_id
    and status = 'PENDING'::public.publication_status;

  if pending_count > 2 then
    raise exception
      'A user can have at most 2 pending NGO publications';
  end if;

  return new;
end;
$$;


drop trigger if exists enforce_ngo_pending_limit
on public.ngos;

create trigger enforce_ngo_pending_limit
after insert or update on public.ngos
for each row
execute function public.enforce_ngo_pending_limit();


notify pgrst, 'reload schema';