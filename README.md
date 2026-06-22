# SentryHealth MX

![CI Status](https://github.com/carlosstgg/sentry-health-mx/actions/workflows/ci.yml/badge.svg?branch=develop)

PWA de monitoreo biométrico para pacientes con enfermedades crónicas en México.
Alineado con el **ODS 3: Salud y Bienestar**.

Ver [`ARCHITECTURE.md`](./ARCHITECTURE.md) para los contextos delimitados,
la arquitectura híbrida (microservicio de orientación + monolito modular)
y el contrato Serverless/FaaS definido para los reportes clínicos.

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
Incluye: linting, pruebas unitarias y build de producción en Node.js 20 y 22.
