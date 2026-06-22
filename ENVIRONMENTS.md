# Entornos — SentryHealth MX

Este documento define las reglas de operación para los tres entornos del
proyecto. No es un concepto teórico: cada regla está reflejada en
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml), y se referencia la
línea exacta que la implementa.

## Resumen del flujo

```
feature/<nombre>  --PR-->  develop  --PR-->  main  --(auto)-->  Vercel (producción)
     DEV                      QA                PROD
```

| Entorno | Rama | Trigger del pipeline |
|---|---|---|
| DEV | `feature/<nombre>` | Ninguno automático; se valida al abrir PR hacia `develop`. |
| QA | `develop` | `push` a `develop` → `on.push.branches` (ci.yml líneas 4-5). |
| PROD | `main` | `push` a `main` → mismo trigger, más `pull_request.branches: [main]` (ci.yml línea 7) para validar el PR antes del merge. |

## DEV (ramas `feature/*`)

- **¿Quién puede hacer deploy?** Cualquier integrante del equipo, únicamente en su propia máquina (`npm run dev` local). No hay despliegue a ningún servidor compartido desde este entorno.
- **¿Qué pruebas deben pasar?** Ninguna de forma obligatoria para trabajar localmente. Antes de integrar el cambio, el integrante debe abrir un Pull Request hacia `develop`, lo que dispara el pipeline completo (ver QA).
- **Política de fallo:** No aplica bloqueo automático; es responsabilidad del integrante no abrir el PR si sabe que el cambio está roto.

## QA (rama `develop`)

- **¿Quién puede hacer deploy?** Nadie despliega a un entorno público desde `develop`; es el entorno de integración donde se valida el trabajo conjunto del equipo antes de llegar a producción.
- **¿Qué pruebas deben pasar?** El job `build-and-test` (ci.yml líneas 9-56), corriendo en matriz de Node 20 y 22:
  - Lint con ESLint (`npm run lint`)
  - Pruebas unitarias con Jest (`npm test`)
  - Build de producción de Next.js (`npm run build`)
  
  Las tres deben completarse sin error en ambas versiones de Node para que el workflow quede en verde.
- **¿Qué ocurre si una prueba falla?** **Se bloquea.** Un step en rojo marca todo el workflow en rojo, y el Pull Request hacia `main` no puede aprobarse con el pipeline fallido. No es solo una notificación: QA es la última barrera antes de producción.

## PROD (rama `main`)

- **¿Quién puede hacer deploy?** Solo el líder del equipo puede aprobar y mergear un Pull Request hacia `main`, y únicamente cuando el pipeline está en verde. El despliegue en sí (a Vercel) ocurre de forma automática, sin intervención manual, una vez hecho el merge.
- **¿Qué pruebas deben pasar?** Las mismas del job `build-and-test` se vuelven a ejecutar sobre el PR (`pull_request.branches: [main]`, ci.yml línea 7) y sobre el push resultante a `main`. Adicionalmente, el job `deploy-vercel` (ci.yml líneas 58-82) solo se ejecuta si `build-and-test` terminó con éxito (`needs: build-and-test`).
- **¿Qué ocurre si una prueba falla?** **Se bloquea el deploy.** La condición `if: github.ref == 'refs/heads/main'` (ci.yml línea 61) combinada con `needs: build-and-test` garantiza que `deploy-vercel` nunca se ejecuta si el job anterior falló. Producción nunca recibe un build que no pasó pruebas.
- **Estado actual:** el job `deploy-vercel` está escrito y condicionado correctamente, pero aún no se ha ejecutado con éxito porque los secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) todavía no están configurados en el repositorio. Ver la sección 3.5 de la documentación técnica para el plan de despliegue completo.
