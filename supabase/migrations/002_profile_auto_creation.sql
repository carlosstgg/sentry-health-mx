-- Crea automáticamente un perfil cuando se registra un usuario en auth.users.
-- security definer permite que el trigger inserte saltando RLS de forma controlada.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Permite al usuario actualizar su propio perfil.
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
