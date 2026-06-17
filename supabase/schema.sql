create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('lojista', 'consultor', 'administrador')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'consultor')
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      role = excluded.role,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.digital_diagnoses (
  id text primary key,
  shop_name text not null,
  shop_address text not null,
  niche text not null,
  consultant_name text not null,
  score integer not null default 0,
  maturity text not null,
  answers jsonb not null default '[]'::jsonb,
  action_plan jsonb not null default '[]'::jsonb,
  status text not null default 'pendente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.digital_diagnoses enable row level security;

create policy if not exists "Consultores e admins podem inserir diagnósticos"
on public.digital_diagnoses
for insert
with check (true);

create policy if not exists "Consultores e admins podem ler diagnósticos"
on public.digital_diagnoses
for select
using (true);

create policy if not exists "Consultores e admins podem atualizar diagnósticos"
on public.digital_diagnoses
for update
using (true)
with check (true);

alter table public.profiles force row level security;