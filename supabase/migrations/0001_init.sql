-- Phase 1 schema: item catalog + outfit logging, owned by auth.users via RLS.
-- Phase 2 (AI-generated model wearing the outfit) gets nullable extension
-- columns/tables now so it never needs a destructive migration later.
-- Storage buckets are private — images are only reachable via short-lived
-- signed URLs, resolved by the client from the *_path columns below.

create extension if not exists pgcrypto;

-- ---------- enums ----------
create type item_category as enum (
  'top', 'bottom', 'dress', 'outerwear', 'footwear', 'bag', 'accessory', 'jewelry', 'other'
);

create type asset_status as enum ('none', 'pending', 'ready', 'failed');

create type tag_kind as enum ('event_type');

-- ---------- profiles (roadmap: real sign-up / multiple testers) ----------
-- Purely additive — nothing references this yet, but every future signed-up
-- user gets a profile row for free instead of needing a backfill migration
-- once sign-up ships.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_owner" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Phase 2 stub (created now so outfits.model_id can FK it) ----------
create table public.ai_models (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  source_image_path text,
  status asset_status not null default 'none',
  created_at timestamptz not null default now()
);
alter table public.ai_models enable row level security;

-- ---------- items (clothing catalog) ----------
create table public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category item_category not null,
  color text not null,
  -- Storage object path (private bucket), or a raw external URL when
  -- image_source = 'link' — resolved to a signed/renderable URL client-side.
  image_path text not null,
  image_source text not null default 'upload'
    check (image_source in ('upload', 'camera', 'link')),

  -- Phase 2 extension points (unused in Phase 1):
  cutout_image_path text,
  cutout_status asset_status not null default 'none',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index items_user_id_idx on public.items(user_id);
create index items_category_idx on public.items(category);
alter table public.items enable row level security;

-- ---------- outfits (outfit log) ----------
create table public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  photo_path text not null,
  worn_date date not null,

  -- Phase 2 extension points (unused in Phase 1):
  model_id uuid references public.ai_models(id) on delete set null,
  composite_image_path text,
  composite_status asset_status not null default 'none',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index outfits_user_id_idx on public.outfits(user_id);
create index outfits_worn_date_idx on public.outfits(worn_date);
alter table public.outfits enable row level security;

-- ---------- outfit_items (outfit <-> item, many-to-many) ----------
create table public.outfit_items (
  outfit_id uuid not null references public.outfits(id) on delete cascade,
  item_id   uuid not null references public.items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (outfit_id, item_id)
);
create index outfit_items_item_id_idx on public.outfit_items(item_id);
alter table public.outfit_items enable row level security;

-- ---------- tags (event type today, extensible kind later) ----------
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind tag_kind not null default 'event_type',
  label text not null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, label)
);
alter table public.tags enable row level security;

-- ---------- outfit_tags (outfit <-> tag, many-to-many) ----------
create table public.outfit_tags (
  outfit_id uuid not null references public.outfits(id) on delete cascade,
  tag_id    uuid not null references public.tags(id) on delete cascade,
  primary key (outfit_id, tag_id)
);
alter table public.outfit_tags enable row level security;

-- ---------- RLS policies (single owner-column pattern) ----------
create policy "items_owner" on public.items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "outfits_owner" on public.outfits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tags_owner" on public.tags
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_models_owner" on public.ai_models
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- join tables have no user_id column; gate via parent outfit ownership
create policy "outfit_items_owner" on public.outfit_items
  for all using (exists (
    select 1 from public.outfits o where o.id = outfit_id and o.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.outfits o where o.id = outfit_id and o.user_id = auth.uid()
  ));

create policy "outfit_tags_owner" on public.outfit_tags
  for all using (exists (
    select 1 from public.outfits o where o.id = outfit_id and o.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.outfits o where o.id = outfit_id and o.user_id = auth.uid()
  ));

-- ---------- updated_at bookkeeping ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger items_set_updated_at before update on public.items
  for each row execute function public.set_updated_at();
create trigger outfits_set_updated_at before update on public.outfits
  for each row execute function public.set_updated_at();

-- ---------- storage buckets (private — signed URLs only) ----------
insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('outfit-photos', 'outfit-photos', false)
on conflict (id) do nothing;

-- createSignedUrl() still evaluates the select policy at request time, so
-- read access needs an explicit owner-scoped policy even for private buckets.
create policy "item_images_owner_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "item_images_owner_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "item_images_owner_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "item_images_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "outfit_photos_owner_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'outfit-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "outfit_photos_owner_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'outfit-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "outfit_photos_owner_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'outfit-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "outfit_photos_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'outfit-photos' and (storage.foldername(name))[1] = auth.uid()::text);
