import type { BiometricRecord } from "@/types/biometric";
import { getOrientationGuidance, type OrientationLevel } from "@/lib/orientation";

interface CrisisGuidanceProps {
  latestRecord: BiometricRecord | null;
}

const LEVEL_STYLES: Record<OrientationLevel, string> = {
  "sin-datos": "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900",
  normal: "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950",
  alerta: "border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-950",
  critico: "border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-950",
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function CrisisGuidance({ latestRecord }: CrisisGuidanceProps) {
  const guidance = getOrientationGuidance(latestRecord);
  const isCritical = guidance.level === "critico";

  return (
    <section
      aria-labelledby="titulo-orientacion"
      aria-live={isCritical ? "assertive" : "polite"}
      role={isCritical ? "alert" : "region"}
      className={`flex w-full max-w-3xl flex-col gap-3 rounded-xl border-2 p-6 shadow-sm ${LEVEL_STYLES[guidance.level]}`}
    >
      <h2
        id="titulo-orientacion"
        className="text-2xl font-bold text-zinc-900 dark:text-zinc-50"
      >
        {guidance.title}
      </h2>

      <p className="text-xl leading-8 text-zinc-800 dark:text-zinc-100">
        {guidance.message}
      </p>

      {guidance.action && (
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {guidance.action}
        </p>
      )}

      {latestRecord && (
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          Último registro: {dateFormatter.format(new Date(latestRecord.recordedAt))} · Glucosa{" "}
          {latestRecord.glucoseMgDl} mg/dL · Presión {latestRecord.systolicBp}/
          {latestRecord.diastolicBp} mmHg
        </p>
      )}

      {isCritical && (
        <a
          href="tel:911"
          className="mt-2 inline-flex w-fit items-center justify-center rounded-md bg-red-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        >
          Llamar al 911
        </a>
      )}
    </section>
  );
}
