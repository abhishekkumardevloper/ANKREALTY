-- ANK Realty Supabase schema
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key,
  email text not null unique,
  password text not null,
  name text not null,
  phone text not null,
  role text not null default 'client' check (role in ('client', 'agent', 'broker', 'admin')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_users_email on public.users (email);
create index if not exists idx_users_role on public.users (role);

create table if not exists public.properties (
  id uuid primary key,
  owner_id uuid not null references public.users(id) on delete cascade,
  owner_name text not null,
  owner_phone text not null,
  title text not null,
  description text not null,
  price numeric(14,2) not null check (price >= 0),
  location text not null,
  city text not null,
  state text not null,
  property_type text not null,
  category text not null check (category in ('buy', 'sell', 'rent')),
  bhk integer null check (bhk is null or bhk >= 0),
  area numeric(12,2) not null check (area > 0),
  furnishing text not null default 'unfurnished',
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  latitude double precision null,
  longitude double precision null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  verified boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  views integer not null default 0 check (views >= 0)
);

create index if not exists idx_properties_owner_id on public.properties (owner_id);
create index if not exists idx_properties_status on public.properties (status);
create index if not exists idx_properties_city on public.properties (city);
create index if not exists idx_properties_category on public.properties (category);
create index if not exists idx_properties_property_type on public.properties (property_type);
create index if not exists idx_properties_created_at on public.properties (created_at desc);
create index if not exists idx_properties_featured on public.properties (featured);

create table if not exists public.favorites (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, property_id)
);

create index if not exists idx_favorites_user_id on public.favorites (user_id);
create index if not exists idx_favorites_property_id on public.favorites (property_id);

create table if not exists public.inquiries (
  id uuid primary key,
  from_user_id uuid not null references public.users(id) on delete cascade,
  from_user_name text not null,
  to_user_id uuid not null references public.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_inquiries_from_user_id on public.inquiries (from_user_id);
create index if not exists idx_inquiries_to_user_id on public.inquiries (to_user_id);
create index if not exists idx_inquiries_property_id on public.inquiries (property_id);
create index if not exists idx_inquiries_created_at on public.inquiries (created_at desc);

create table if not exists public.appointments (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  user_name text not null,
  user_phone text not null,
  property_id uuid not null references public.properties(id) on delete cascade,
  property_title text not null,
  date text not null,
  time text not null,
  message text null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_appointments_user_id on public.appointments (user_id);
create index if not exists idx_appointments_property_id on public.appointments (property_id);
create index if not exists idx_appointments_created_at on public.appointments (created_at desc);

-- Optional seed example
-- insert into public.users (id, email, password, name, phone, role)
-- values (gen_random_uuid(), 'admin@ankrealty.com', '$2b$12$replace_with_bcrypt_hash', 'ANK Admin', '9999999999', 'admin');
