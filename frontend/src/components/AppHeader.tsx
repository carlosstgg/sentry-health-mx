"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Encabezado fijo con la marca y un indicador de conexión.
 * El estado en línea/sin conexión es relevante para una PWA que debe
 * funcionar con internet inestable (regla 5 de .cursorrules).
 */
export default function AppHeader() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-600"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full bg-rose-600"
          />
          <span className="text-base font-semibold tracking-tight text-zinc-900">
            SentryHealth <span className="text-rose-600">MX</span>
          </span>
        </Link>

        <span
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-xs font-medium text-zinc-500"
        >
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-zinc-400"
            }`}
          />
          {isOnline ? "En línea" : "Sin conexión"}
        </span>
      </div>
    </header>
  );
}
