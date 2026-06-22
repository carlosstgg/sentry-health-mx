import type { ReactNode } from "react";
import type { BiometricRecord } from "@/types/biometric";
import { getOrientationGuidance, type OrientationLevel } from "@/lib/orientation";

interface CrisisGuidanceProps {
  latestRecord: BiometricRecord | null;
}

interface LevelConfig {
  container: string;
  badge: string;
  badgeLabel: string;
  iconWrap: string;
  icon: ReactNode;
}

const InfoIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5h.01" />
  </svg>
);

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
);

const AlertIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

const CriticalIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5M12 16h.01" />
  </svg>
);

const LEVEL_CONFIG: Record<OrientationLevel, LevelConfig> = {
  "sin-datos": {
    container: "border-zinc-200 border-l-zinc-400 bg-white",
    badge: "bg-zinc-100 text-zinc-600",
    badgeLabel: "Sin datos",
    iconWrap: "bg-zinc-100 text-zinc-500",
    icon: InfoIcon,
  },
  normal: {
    container: "border-zinc-200 border-l-green-500 bg-white",
    badge: "bg-green-100 text-green-800",
    badgeLabel: "Todo en orden",
    iconWrap: "bg-green-100 text-green-700",
    icon: CheckIcon,
  },
  alerta: {
    container: "border-amber-200 border-l-amber-500 bg-amber-50",
    badge: "bg-amber-100 text-amber-900",
    badgeLabel: "Precaución",
    iconWrap: "bg-amber-100 text-amber-700",
    icon: AlertIcon,
  },
  critico: {
    container: "border-red-300 border-l-red-600 bg-red-50",
    badge: "bg-red-600 text-white",
    badgeLabel: "Atención crítica",
    iconWrap: "bg-red-600 text-white",
    icon: CriticalIcon,
  },
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function CrisisGuidance({ latestRecord }: CrisisGuidanceProps) {
  const guidance = getOrientationGuidance(latestRecord);
  const isCritical = guidance.level === "critico";
  const config = LEVEL_CONFIG[guidance.level];

  return (
    <section
      aria-labelledby="titulo-orientacion"
      aria-live={isCritical ? "assertive" : "polite"}
      role={isCritical ? "alert" : "region"}
      className={`flex w-full flex-col gap-4 rounded-2xl border border-l-4 p-6 ${config.container}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.iconWrap}`}
        >
          {config.icon}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${config.badge}`}
        >
          {config.badgeLabel}
        </span>
      </div>

      <h2
        id="titulo-orientacion"
        className="text-2xl font-bold tracking-tight text-zinc-900"
      >
        {guidance.title}
      </h2>

      <p className="text-lg leading-7 text-zinc-700">{guidance.message}</p>

      {guidance.action && (
        <p className="text-lg font-semibold text-zinc-900">{guidance.action}</p>
      )}

      {latestRecord && (
        <p className="text-sm text-zinc-500">
          Último registro:{" "}
          {dateFormatter.format(new Date(latestRecord.recordedAt))} · Glucosa{" "}
          {latestRecord.glucoseMgDl} mg/dL · Presión {latestRecord.systolicBp}/
          {latestRecord.diastolicBp} mmHg
        </p>
      )}

      {isCritical && (
        <a
          href="tel:911"
          className="mt-1 inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
            <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.25 1l-2.2 2.2Z" />
          </svg>
          Llamar al 911
        </a>
      )}
    </section>
  );
}
