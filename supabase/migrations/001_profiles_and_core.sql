-- Son Çağrı — Faz 1: profiles + MVP çekirdek tablolar (PRD / plan.md)

-- ---------------------------------------------------------------------------
-- profiles: Auth kullanıcısına bağlı uygulama profili
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- global_ingredients (US-01 arama kütüphanesi)
-- ---------------------------------------------------------------------------
create table if not exists public.global_ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('sebze', 'protein', 'tahil', 'sut')),
  default_shelf_days int not null default 7,
  carbon_factor_kg_per_kg numeric(10, 4) not null default 0,
  default_weight_grams int not null default 100,
  created_at timestamptz not null default now()
);

create index if not exists global_ingredients_name_idx
  on public.global_ingredients (name);

alter table public.global_ingredients enable row level security;

create policy "global_ingredients_read_authenticated"
  on public.global_ingredients for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- user_pantries
-- ---------------------------------------------------------------------------
create table if not exists public.user_pantries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ingredient_id uuid not null references public.global_ingredients (id),
  expiry_date date,
  is_urgent boolean not null default false,
  status text not null default 'active' check (status in ('active', 'consumed')),
  added_at timestamptz not null default now()
);

create index if not exists user_pantries_user_id_idx on public.user_pantries (user_id);

alter table public.user_pantries enable row level security;

create policy "user_pantries_own"
  on public.user_pantries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- user_savings_ledger (Green Ledger — user_id silme sonrası nullable)
-- ---------------------------------------------------------------------------
create table if not exists public.user_savings_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  recipe_title text not null,
  grams_saved int not null default 0,
  co2_kg_prevented numeric(12, 4) not null default 0,
  ingredient_ids uuid[] not null default '{}',
  confirmed_at timestamptz not null default now()
);

alter table public.user_savings_ledger enable row level security;

create policy "user_savings_ledger_own"
  on public.user_savings_ledger for select
  using (auth.uid() = user_id);

create policy "user_savings_ledger_insert_own"
  on public.user_savings_ledger for insert
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- recipe_confirmations (günlük 1 onay — plan önerisi)
-- ---------------------------------------------------------------------------
create table if not exists public.recipe_confirmations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_fingerprint text not null,
  confirmed_date date not null default current_date,
  unique (user_id, confirmed_date)
);

alter table public.recipe_confirmations enable row level security;

create policy "recipe_confirmations_own"
  on public.recipe_confirmations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
