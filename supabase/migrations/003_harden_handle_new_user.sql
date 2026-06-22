-- Evita que handle_new_user() sea invocable como RPC público.
-- El trigger on_auth_user_created sigue ejecutándola (corre como dueño de la tabla).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
