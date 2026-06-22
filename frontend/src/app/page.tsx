"use client";

import BiometricForm from "@/components/BiometricForm";
import BiometricHistory from "@/components/BiometricHistory";
import CrisisGuidance from "@/components/CrisisGuidance";
import MetricSummary from "@/components/MetricSummary";
import { useBiometricRecords } from "@/hooks/useBiometricRecords";

export default function Home() {
  const { records, addRecord } = useBiometricRecords();
  const latestRecord = records[0] ?? null;

  return (
    <main
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 sm:py-14"
      aria-labelledby="titulo-principal"
    >
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-rose-600">
          Monitoreo biométrico
        </p>
        <h1
          id="titulo-principal"
          className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl"
        >
          Tu salud, bajo control todos los días
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
          Registra tus signos vitales y dale seguimiento a tu condición sin
          depender de visitas médicas frecuentes. Alineado con el Objetivo de
          Desarrollo Sostenible 3: Salud y Bienestar.
        </p>
      </section>

      <CrisisGuidance latestRecord={latestRecord} />

      <MetricSummary latestRecord={latestRecord} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <BiometricForm onSubmit={addRecord} />
        <BiometricHistory records={records} />
      </div>
    </main>
  );
}
