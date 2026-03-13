# Supabase setup

Create a table named `plots` in Supabase SQL editor:

```sql
create table if not exists public.plots (
  id text primary key,
  title text not null,
  description text,
  location text,
  city text,
  price numeric,
  image_url text,
  size text,
  status text default 'pending',
  contact_name text,
  contact_phone text,
  created_by text default 'user',
  created_at timestamptz default now()
);
```

Set these environment variables in `frontend/.env.local`:

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
ADMIN_SECRET=your_strong_secret
```

If Supabase env vars are not set, the app automatically uses local JSON storage in `frontend/data/plots.json`.
