import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase para el lado del navegador.
 *
 * Las credenciales se leen de variables de entorno públicas
 * (NEXT_PUBLIC_*) y nunca se hardcodean en el código fuente.
 * Ver `frontend/.env.local.example` para la plantilla de configuración.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables de entorno de Supabase. ' +
      'Copia .env.local.example a .env.local y define ' +
      'NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
