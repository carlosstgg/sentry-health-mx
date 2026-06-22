"use client";

import BiometricForm from "@/components/BiometricForm";
import BiometricHistory from "@/components/BiometricHistory";
import CrisisGuidance from "@/components/CrisisGuidance";
import { useBiometricRecords } from "@/hooks/useBiometricRecords";

export default function Home() {
  const { records, addRecord } = useBiometricRecords();
  const latestRecord = records[0] ?? null;

  return (
    <main
      className="flex flex-1 flex-col items-center gap-10 bg-zinc-50 px-6 py-16 dark:bg-black"
      aria-labelledby="titulo-principal"
    >
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <h1
          id="titulo-principal"
          className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          SentryHealth MX
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Registra tus signos vitales y dale seguimiento a tu condición sin
          depender de visitas médicas frecuentes. Alineado con el Objetivo de
          Desarrollo Sostenible 3: Salud y Bienestar.
        </p>
      </div>

      <CrisisGuidance latestRecord={latestRecord} />

      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
        <BiometricForm onSubmit={addRecord} />
        <BiometricHistory records={records} />
      </div>
    </main>
  );
}
