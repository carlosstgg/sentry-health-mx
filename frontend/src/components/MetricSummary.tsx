import type { ReactNode } from "react";
import type { BiometricRecord } from "@/types/biometric";

interface MetricSummaryProps {
  latestRecord: BiometricRecord | null;
}

interface MetricCard {
  label: string;
  value: string;
  unit: string;
  icon: ReactNode;
}

const iconClass = "h-5 w-5";

const GlucoseIcon = (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2.7 6.3 9.3a7.5 7.5 0 1 0 11.4 0L12 2.7Z" />
  </svg>
);

const PressureIcon = (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 12h4l2 5 4-12 2 7h6" />
  </svg>
);

const HeartRateIcon = (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.8 6.6a4.5 4.5 0 0 0-7.6-2.4L12 5.4l-1.2-1.2a4.5 4.5 0 1 0-6.4 6.4L12 18l7.6-7.4a4.5 4.5 0 0 0 1.2-4Z" />
  </svg>
);

export default function MetricSummary({ latestRecord }: MetricSummaryProps) {
  if (!latestRecord) {
    return null;
  }

  const cards: MetricCard[] = [
    {
      label: "Glucosa",
      value: String(latestRecord.glucoseMgDl),
      unit: "mg/dL",
      icon: GlucoseIcon,
    },
    {
      label: "Presión arterial",
      value: `${latestRecord.systolicBp}/${latestRecord.diastolicBp}`,
      unit: "mmHg",
      icon: PressureIcon,
    },
    {
      label: "Frecuencia cardiaca",
      value: String(latestRecord.heartRate),
      unit: "lpm",
      icon: HeartRateIcon,
    },
  ];

  return (
    <section aria-labelledby="titulo-resumen">
      <h2 id="titulo-resumen" className="sr-only">
        Resumen de tu última lectura
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="text-rose-600">{card.icon}</span>
              <span className="text-sm font-medium">{card.label}</span>
            </div>
            <p className="flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tabular-nums text-zinc-900">
                {card.value}
              </span>
              <span className="text-sm text-zinc-500">{card.unit}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
