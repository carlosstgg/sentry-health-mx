"use client";

import { useEffect } from "react";

/**
 * Registra el service worker que sostiene el patrón offline-first
 * exigido por la regla 5 de .cursorrules: sin esto, una conexión
 * inestable deja a la persona sin acceso a su última lectura ni a la
 * orientación crítica de CrisisGuidance.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // El registro no es crítico: la app sigue funcionando en línea.
    });
  }, []);

  return null;
}
