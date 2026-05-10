insert into storage.buckets (id, name, public)
values
  ('ticket-attachments', 'ticket-attachments', false),
  ('quotation-files', 'quotation-files', false),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "authenticated upload ticket attachments" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'ticket-attachments');

create policy "authenticated read ticket attachments" on storage.objects
  for select to authenticated
  using (bucket_id = 'ticket-attachments');

create policy "sales upload quotation files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'quotation-files');

create policy "authenticated read quotation files" on storage.objects
  for select to authenticated
  using (bucket_id = 'quotation-files');

create policy "public read avatars" on storage.objects
  for select
  using (bucket_id = 'avatars');
