-- Tabla de perfiles de usuario (extiende auth.users de Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  created_at timestamptz default now()
);

-- Tabla de registros biométricos
create table public.biometric_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  glucose_mg_dl numeric(6,2),
  systolic_bp integer,
  diastolic_bp integer,
  heart_rate integer,
  recorded_at timestamptz default now(),
  notes text
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.biometric_records enable row level security;

-- Políticas: solo el propio usuario puede ver sus datos
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can view own records"
  on public.biometric_records for select using (auth.uid() = user_id);

create policy "Users can insert own records"
  on public.biometric_records for insert with check (auth.uid() = user_id);
