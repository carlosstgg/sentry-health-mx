import type { BiometricRecord } from "@/types/biometric";

interface BiometricHistoryProps {
  records: BiometricRecord[];
}

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

const GLUCOSE_ALERTA_MG_DL = 180;
const GLUCOSE_CRITICO_MG_DL = 250;

/** Color de apoyo para la glucosa; el valor numérico sigue siendo el indicador principal. */
function glucoseClass(value: number): string {
  if (value >= GLUCOSE_CRITICO_MG_DL) return "text-red-600 font-semibold";
  if (value >= GLUCOSE_ALERTA_MG_DL) return "text-amber-600 font-semibold";
  return "text-zinc-900";
}

const headerClass =
  "py-2.5 pr-4 text-xs font-semibold uppercase tracking-wide text-zinc-500";

export default function BiometricHistory({ records }: BiometricHistoryProps) {
  return (
    <section
      aria-labelledby="titulo-historial"
      className="flex w-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6"
    >
      <h2
        id="titulo-historial"
        className="text-xl font-semibold tracking-tight text-zinc-900"
      >
        Historial de registros
      </h2>

      {records.length === 0 && (
        <div
          role="status"
          className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-zinc-400" aria-hidden="true">
            <path d="M3 12h4l2 5 4-12 2 7h6" />
          </svg>
          <p className="text-sm text-zinc-500">
            Todavía no tienes registros. Usa el formulario para agregar tu
            primera lectura.
          </p>
        </div>
      )}

      {records.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Historial de lecturas biométricas ordenadas de la más reciente a la
              más antigua
            </caption>
            <thead>
              <tr className="border-b border-zinc-200">
                <th scope="col" className={headerClass}>
                  Fecha
                </th>
                <th scope="col" className={headerClass}>
                  Glucosa
                </th>
                <th scope="col" className={headerClass}>
                  Presión
                </th>
                <th scope="col" className={headerClass}>
                  FC
                </th>
                <th scope="col" className={`${headerClass} pr-0`}>
                  Notas
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-zinc-100 transition-colors duration-200 last:border-0 hover:bg-zinc-50"
                >
                  <td className="py-3 pr-4 text-zinc-500">
                    {dateFormatter.format(new Date(record.recordedAt))}
                  </td>
                  <td
                    className={`py-3 pr-4 tabular-nums ${glucoseClass(record.glucoseMgDl)}`}
                  >
                    {record.glucoseMgDl} mg/dL
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-zinc-900">
                    {record.systolicBp}/{record.diastolicBp} mmHg
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-zinc-900">
                    {record.heartRate} lpm
                  </td>
                  <td className="py-3 text-zinc-500">{record.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
