# CLAUDE.md — SentryHealth MX
## Contexto completo para el agente Claude Code

---

## 1. IDENTIDAD DEL PROYECTO

| Campo | Valor |
|---|---|
| **Nombre** | SentryHealth MX |
| **Repositorio** | https://github.com/carlosstgg/sentry-health-mx |
| **Tipo** | Monorepo |
| **Propósito** | PWA de monitoreo biométrico para pacientes diabéticos en México (ODS 3) |
| **Estado actual** | Repositorio vacío recién creado — primera configuración |

---

## 2. ARQUITECTURA DEL PROYECTO

### Estructura de carpetas objetivo

```
sentry-health-mx/
├── frontend/                   # Next.js 14 + TypeScript (PWA)
│   ├── src/
│   │   ├── app/                # App Router de Next.js
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   └── supabase.ts     # Cliente de Supabase
│   │   └── types/
│   ├── public/
│   │   └── manifest.json       # PWA manifest
│   ├── package.json
│   ├── package-lock.json       # OBLIGATORIO — npm ci lo requiere
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── .eslintrc.json
│   └── jest.config.ts
├── supabase/
│   ├── migrations/             # Migraciones SQL versionadas
│   └── seed.sql                # Datos de prueba (biométricos ficticios)
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI — GitHub Actions
├── .cursorrules                # Reglas de gobernanza IA (ya definidas)
├── .gitignore
└── README.md
```

### Stack tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | PWA, SSR, App Router |
| Base de datos / Auth / Storage | Supabase | BaaS — no hay backend propio |
| Estilos | Tailwind CSS | Consistencia, accesibilidad |
| Testing | Jest + React Testing Library | Requerido por pipeline CI |
| Linting | ESLint + reglas TypeScript | Definido en .cursorrules |
| CI | GitHub Actions | Requerido por Act02_ |
| Deploy | Vercel | Integración nativa con Next.js |

---

## 3. REGLAS DE GOBERNANZA IA (.cursorrules)

Estas reglas fueron definidas en la fase anterior del proyecto y deben plasmarse en el archivo `.cursorrules` en la raíz:

```
You are an expert developer in the project's selected stack (Next.js 14, TypeScript, Supabase, Tailwind CSS). Your goal is to produce robust, secure, and highly accessible code by default.

RULES:
1. Always write UI components with strict accessibility standards, including ARIA labels and semantic HTML, because our users rely on screen readers and clear interfaces.
2. Do not use 'any' in TypeScript. Always define strict interfaces and types to protect sensitive user data and ensure system predictability.
3. Prioritize performance and minimal loading times. Do not import heavy libraries unless they are strictly necessary for the core functionality.
4. All user-facing text, error messages, and UI labels must be in Spanish, using clear, non-technical language suitable for our target audience.
5. Always implement offline-first patterns using Next.js service workers, because users may have unstable internet connections.
```

---

## 4. ESTRATEGIA DE RAMAS (GIT FLOW)

```
main          ← producción (protegida, solo merge con PR aprobado)
  └── develop ← integración (pipeline CI se dispara aquí)
        └── feature/<nombre> ← desarrollo individual
```

**Ramas que deben existir al finalizar:**
- `main` (ya existe por defecto)
- `develop` (crear desde main)

**Convención de commits (Conventional Commits):**
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `ci:` cambios en pipeline
- `docs:` documentación
- `chore:` configuración, dependencias

---

## 5. PIPELINE CI — ESPECIFICACIÓN EXACTA

El archivo `.github/workflows/ci.yml` debe contener exactamente lo siguiente, adaptado a Next.js + TypeScript:

```yaml
name: CI — SentryHealth MX

on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - name: Checkout del código
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Instalar dependencias
        working-directory: frontend
        run: npm ci

      - name: Linting (ESLint)
        working-directory: frontend
        run: npm run lint

      - name: Pruebas unitarias (Jest)
        working-directory: frontend
        run: npm test

      - name: Build de producción (Next.js)
        working-directory: frontend
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Subir artefacto del build
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build-node${{ matrix.node-version }}
          path: frontend/.next/
          retention-days: 7
```

**Notas críticas del pipeline:**
- `working-directory: frontend` en cada step porque es monorepo
- `cache-dependency-path` apunta a `frontend/package-lock.json`
- Las variables de Supabase van como Secrets, nunca hardcodeadas
- La ruta del artefacto es `frontend/.next/` (Next.js, no `dist/`)

---

## 6. PACKAGE.JSON DEL FRONTEND

El `frontend/package.json` debe incluir estos scripts exactos:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**`--passWithNoTests`** es obligatorio para que el pipeline CI pase durante la fase inicial del proyecto cuando aún no hay pruebas escritas.

---

## 7. CONFIGURACIÓN DE JEST

`frontend/jest.config.ts`:

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

`frontend/jest.setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

---

## 8. CONFIGURACIÓN PWA (next.config.ts)

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // PWA será manejado via next-pwa en versión futura
  // Por ahora configuramos los headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## 9. MANIFEST PWA (public/manifest.json)

```json
{
  "name": "SentryHealth MX",
  "short_name": "SentryHealth",
  "description": "Monitoreo de salud para pacientes diabéticos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#003087",
  "lang": "es-MX",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## 10. GITIGNORE

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js build
frontend/.next/
frontend/out/

# Environment variables — NUNCA commitear
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
frontend/.env
frontend/.env.local

# Supabase local
supabase/.branches
supabase/.temp

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*
```

---

## 11. README.md (contenido inicial)

```markdown
# SentryHealth MX

![CI Status](https://github.com/carlosstgg/sentry-health-mx/actions/workflows/ci.yml/badge.svg?branch=develop)

PWA de monitoreo biométrico para pacientes con enfermedades crónicas en México.
Alineado con el **ODS 3: Salud y Bienestar**.

## Stack

- **Frontend:** Next.js 14 + TypeScript
- **Backend / Auth / DB:** Supabase
- **Estilos:** Tailwind CSS
- **CI/CD:** GitHub Actions + Vercel

## Equipo

| Nombre | Rol |
|---|---|
| Juan Carlos Gallegos Gutiérrez | Arquitecto |
| Sebastián Arreguín Villanueva | Líder |
| Thomas Bárcenas | Backend |
| Leonardo Efraín Jaramillo Reynoso | Frontend |

## Desarrollo local

```bash
cd frontend
npm install
cp .env.local.example .env.local   # agregar credenciales de Supabase
npm run dev
```

## Pipeline CI

El pipeline se ejecuta automáticamente en cada push a `develop` y en PRs hacia `main`.
Incluye: linting, pruebas unitarias y build de producción en Node.js 18 y 20.
```

---

## 12. SUPABASE — ESTRUCTURA MÍNIMA

`supabase/migrations/001_initial_schema.sql`:

```sql
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
```

`supabase/seed.sql` (datos ficticios para QA):

```sql
-- Datos de prueba — NO usar en producción
-- Simula registros biométricos para el arquetipo Carmen (glucosa con patrones de diabetes tipo 2)
insert into public.biometric_records (user_id, glucose_mg_dl, systolic_bp, diastolic_bp, heart_rate, recorded_at)
values
  ('00000000-0000-0000-0000-000000000001', 187.5, 138, 88, 78, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000001', 210.3, 142, 91, 82, now() - interval '12 hours'),
  ('00000000-0000-0000-0000-000000000001', 156.8, 135, 85, 75, now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', 263.1, 150, 95, 88, now() - interval '2 hours');
```

---

## 13. VARIABLES DE ENTORNO

`frontend/.env.local.example` (este archivo SÍ se commitea como referencia):

```bash
# Supabase — obtener desde el dashboard de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Solo para desarrollo local — NO commitear el .env.local real
```

---

## 14. REGLAS CRÍTICAS PARA EL AGENTE

### LO QUE DEBES HACER

- Crear todas las carpetas y archivos descritos en la sección 2
- Inicializar el proyecto Next.js dentro de `frontend/` con `npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir` y luego mover a estructura con `src/`
- Crear la rama `develop` desde `main`
- Hacer commits separados y descriptivos por cada grupo lógico de cambios
- Usar Conventional Commits en todos los mensajes: `chore:`, `ci:`, `docs:`, `feat:`
- Verificar que `npm ci` funciona correctamente en `frontend/` antes de hacer push
- Verificar que `npm run lint` pasa sin errores antes de hacer push
- Verificar que `npm test` pasa (aunque no haya pruebas, `--passWithNoTests` lo permite)
- Verificar que `npm run build` completa sin errores antes de hacer push

### LO QUE NO DEBES HACER

- **NO hacer commit de ningún archivo `.env` o `.env.local` con valores reales**
- **NO instalar librerías pesadas** que no sean estrictamente necesarias para esta fase
- **NO usar `any` en TypeScript** en ningún archivo que generes
- **NO crear archivos de componentes sin ARIA labels**
- **NO hacer push directamente a `main`** — todo va a `develop`
- **NO aparecer como autor de commits** — los commits deben estar configurados con los datos del usuario que ejecuta Claude Code en su máquina

### ORDEN DE EJECUCIÓN

1. Clonar el repositorio vacío
2. Crear `.gitignore` y hacer primer commit en `main`
3. Crear rama `develop` y cambiarse a ella
4. Crear estructura de carpetas del monorepo
5. Inicializar Next.js en `frontend/`
6. Instalar dependencias adicionales (Tailwind ya incluido, agregar: `@supabase/supabase-js`, `@testing-library/react`, `@testing-library/jest-dom`, `jest`, `jest-environment-jsdom`)
7. Configurar Jest (`jest.config.ts`, `jest.setup.ts`)
8. Crear `next.config.ts` con headers de seguridad
9. Crear `frontend/.env.local.example`
10. Crear carpeta `supabase/` con migraciones y seed
11. Crear `.cursorrules` en la raíz
12. Crear `.github/workflows/ci.yml`
13. Actualizar `README.md` con la badge y la tabla del equipo
14. Verificar que `npm ci`, `npm run lint`, `npm test` y `npm run build` pasan todos en `frontend/`
15. Hacer push de `develop` a GitHub

---

## 15. VERIFICACIÓN FINAL ANTES DE TERMINAR

El agente debe confirmar que:

- [ ] `git log --oneline` muestra commits con mensajes Conventional Commits
- [ ] `git branch -a` muestra `main` y `develop`
- [ ] `.github/workflows/ci.yml` existe y tiene la estructura exacta del pipeline
- [ ] `frontend/package-lock.json` existe (npm ci lo requiere)
- [ ] `frontend/package.json` tiene los scripts: `dev`, `build`, `start`, `lint`, `test`
- [ ] `npm run lint` pasa sin errores desde `frontend/`
- [ ] `npm test` pasa (con `--passWithNoTests`)
- [ ] `npm run build` completa sin errores desde `frontend/`
- [ ] No existe ningún `.env.local` con valores reales en el repositorio
- [ ] `.cursorrules` existe en la raíz del repositorio

---

*Documento generado para el proyecto SentryHealth MX — Innovación Tecnológica, Universidad La Salle Bajío, 2026.*