create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.coupon_brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.coupon_types (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand_id uuid references public.coupon_brands(id) on delete set null,
  type_id uuid references public.coupon_types(id) on delete set null,
  code text not null default '',
  title text not null,
  value_notes text,
  expires_at date,
  is_used boolean not null default false,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists coupon_brands_user_id_idx on public.coupon_brands(user_id);
create index if not exists coupon_types_user_id_idx on public.coupon_types(user_id);
create index if not exists coupons_user_id_idx on public.coupons(user_id);
create index if not exists coupons_brand_id_idx on public.coupons(brand_id);
create index if not exists coupons_type_id_idx on public.coupons(type_id);
create index if not exists coupons_is_used_idx on public.coupons(is_used);
create index if not exists coupons_expires_at_idx on public.coupons(expires_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists coupons_set_updated_at on public.coupons;
create trigger coupons_set_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.coupon_brands enable row level security;
alter table public.coupon_types enable row level security;
alter table public.coupons enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert their profile" on public.profiles;
create policy "Users can insert their profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can read their brands" on public.coupon_brands;
create policy "Users can read their brands"
on public.coupon_brands for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their brands" on public.coupon_brands;
create policy "Users can insert their brands"
on public.coupon_brands for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their brands" on public.coupon_brands;
create policy "Users can update their brands"
on public.coupon_brands for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their brands" on public.coupon_brands;
create policy "Users can delete their brands"
on public.coupon_brands for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their types" on public.coupon_types;
create policy "Users can read their types"
on public.coupon_types for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their types" on public.coupon_types;
create policy "Users can insert their types"
on public.coupon_types for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their types" on public.coupon_types;
create policy "Users can update their types"
on public.coupon_types for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their types" on public.coupon_types;
create policy "Users can delete their types"
on public.coupon_types for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their coupons" on public.coupons;
create policy "Users can read their coupons"
on public.coupons for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their coupons" on public.coupons;
create policy "Users can insert their coupons"
on public.coupons for insert
with check (
  auth.uid() = user_id
  and (brand_id is null or exists (
    select 1 from public.coupon_brands b
    where b.id = brand_id and b.user_id = auth.uid()
  ))
  and (type_id is null or exists (
    select 1 from public.coupon_types t
    where t.id = type_id and t.user_id = auth.uid()
  ))
);

drop policy if exists "Users can update their coupons" on public.coupons;
create policy "Users can update their coupons"
on public.coupons for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (brand_id is null or exists (
    select 1 from public.coupon_brands b
    where b.id = brand_id and b.user_id = auth.uid()
  ))
  and (type_id is null or exists (
    select 1 from public.coupon_types t
    where t.id = type_id and t.user_id = auth.uid()
  ))
);

drop policy if exists "Users can delete their coupons" on public.coupons;
create policy "Users can delete their coupons"
on public.coupons for delete
using (auth.uid() = user_id);
