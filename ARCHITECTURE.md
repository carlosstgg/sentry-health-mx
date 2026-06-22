# Arquitectura — SentryHealth MX

Este documento traslada al repositorio las decisiones de arquitectura
fundamentadas en la fase de Innovación Tecnológica ("segundo periodo"),
para que vivan junto al código en vez de solo en el reporte académico.

## 1. Arquetipo de usuario: Doña Carmen

Carmen representa al paciente con diabetes tipo 2 que usa principalmente
WhatsApp y teme tanto a las complicaciones de su enfermedad como a
gastos inesperados. De su validación surgieron tres requisitos no
negociables:

1. **Simplicidad extrema** — pocos botones, letras grandes, interacción
   tipo WhatsApp.
2. **Resiliencia de red** — la app debe funcionar con internet
   inestable o sin datos.
3. **Transparencia y seguridad** — sin costos ocultos ni sorpresas.

Estos tres puntos son la justificación directa de las reglas 1, 4 y 5
de [`.cursorrules`](./.cursorrules).

## 2. Contextos delimitados (Bounded Contexts)

| Módulo | Responsabilidad | Estado en el repo |
|---|---|---|
| **Monitoreo y Orientación de Salud** (crítico) | Procesa biométricos y genera orientación inmediata ("tómese esto", "llame a alguien") | Implementado: `frontend/src/lib/orientation.ts` + `frontend/src/components/CrisisGuidance.tsx` |
| **Gestión de Usuarios** | Registro, autenticación y perfiles | Modelado en `supabase/migrations/001_initial_schema.sql` (tabla `profiles` + RLS); sin UI de autenticación todavía — pendiente de conectar Supabase al frontend |
| **Historial Clínico** | Almacena y presenta datos históricos | Implementado con persistencia local (`useBiometricRecords.ts`, `localStorage`) más el esquema `biometric_records` en Supabase, aún no conectados entre sí |
| **Notificaciones y Recordatorios** | Alertas de medicación y hábitos | No implementado — fuera del alcance del MVP actual |

El **Módulo de Monitoreo y Orientación** se trata como el componente
crítico porque es el que sostiene al paciente en el "tiempo invisible"
entre consultas médicas.

## 3. Arquitectura híbrida (microservicio + monolito modular)

**Decisión de diseño (fase de planeación):** aislar el Módulo de
Monitoreo y Orientación como microservicio independiente, mientras que
Gestión de Usuarios, Historial Clínico y Notificaciones se mantienen en
un monolito modular para optimizar recursos en esta etapa del proyecto.

**Estado actual de implementación:** el proyecto todavía no tiene un
backend de aplicación propio (solo Supabase como BaaS), por lo que la
separación en microservicio real aún no existe a nivel de despliegue.
Como aproximación equivalente dentro del frontend, el módulo de
orientación se construyó como una unidad aislada y sin dependencias de
red (`orientation.ts` recibe solo el último registro local y no llama a
ningún servicio externo), de modo que sigue funcionando aunque el resto
de la aplicación falle o esté sin conexión. Cuando exista un backend
propio, este módulo es el candidato natural para extraerse a un
servicio desplegado de forma independiente, conservando el mismo
contrato de entrada/salida.

**Trade-off:** un microservicio real añade complejidad operativa, pero
elimina el punto único de falla de la funcionalidad vital de
orientación — la app se mantiene como un acompañante activo en vez de
abandonar al paciente cuando algo más en el sistema falla.

## 4. Escenario de alto tráfico y contrato Serverless/FaaS

**Contexto:** una campaña viral del ODS 3 puede generar miles de
solicitudes simultáneas de reportes clínicos mensuales con análisis de
Machine Learning sobre resultados de laboratorio. La generación masiva
de PDFs y el procesamiento de ML son tareas intensivas en CPU/RAM que
colapsarían primero al servidor principal si se ejecutaran en línea.

**Decisión de diseño:** delegar ese trabajo a una función
Serverless/FaaS (p. ej. AWS Lambda o Google Cloud Functions) para que
el sistema principal permanezca ligero mientras la nube escala el
procesamiento de reportes.

**Contrato definido (pendiente de implementación):**

- **Trigger:** una solicitud de reporte que genera un evento en una
  cola de mensajes o un cambio de estado en la tabla `Reportes`.
- **Payload:**

  ```json
  {
    "transactionId": "sh-98765",
    "userId": "carmen_58_le",
    "reportType": "biometric_ml_analysis",
    "dataRange": { "start": "2026-04-01", "end": "2026-04-30" },
    "outputFormat": "pdf"
  }
  ```

- **Output:** el reporte se guarda en un bucket de almacenamiento
  (Cloud Storage) y se actualiza el registro en la base de datos con la
  URL de descarga, notificando al usuario de forma asíncrona.

Esta función no existe aún en el repositorio — no hay generación de
reportes ni integración de ML en el MVP actual. Se documenta aquí para
que la implementación futura respete el contrato ya definido.

## 5. Gobernanza de IA (.cursorrules)

Las 5 reglas de [`.cursorrules`](./.cursorrules) traducen los
requisitos de Carmen y los objetivos del ODS 3 en restricciones
técnicas: accesibilidad estricta (A11y), prohibición de `any` en
TypeScript, restricciones de rendimiento, idioma español claro para
todo el texto de cara al usuario, y patrones offline-first. Ver la
sección 2 de este documento para el mapeo módulo por módulo de qué
tan implementada está cada regla.
