-- ============================================================
-- Pinheiro Pets
-- Lost pet image storage
-- ============================================================

-- ------------------------------------------------------------
-- LOST PET IMAGE PATH
-- ------------------------------------------------------------

alter table public.lost_pets
add column image_path text;

-- ------------------------------------------------------------
-- STORAGE BUCKET
-- ------------------------------------------------------------

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'lost-pets',
  'lost-pets',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- STORAGE POLICIES
-- ------------------------------------------------------------

create policy "Public can view lost pet images"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'lost-pets'
);

create policy "Users can upload their own lost pet images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'lost-pets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own lost pet images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'lost-pets'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
)
with check (
  bucket_id = 'lost-pets'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

create policy "Users and admins can delete lost pet images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'lost-pets'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);