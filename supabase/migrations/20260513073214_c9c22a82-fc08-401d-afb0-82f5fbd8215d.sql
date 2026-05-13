
-- Public storage bucket for event assets (logos, hero/cover, speakers, topics, hotels, news, sponsors, library, lottie animations…)
insert into storage.buckets (id, name, public)
values ('event-assets', 'event-assets', true)
on conflict (id) do update set public = true;

-- Public read
create policy "Public read event-assets"
on storage.objects for select
to public
using (bucket_id = 'event-assets');

-- Authenticated CMS users can write/update/delete (admins are gated by app-level RLS on events anyway)
create policy "Authenticated upload event-assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'event-assets');

create policy "Authenticated update event-assets"
on storage.objects for update
to authenticated
using (bucket_id = 'event-assets');

create policy "Authenticated delete event-assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'event-assets');
