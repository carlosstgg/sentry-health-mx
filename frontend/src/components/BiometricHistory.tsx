import type { BiometricRecord } from "@/types/biometric";

interface BiometricHistoryProps {
  records: BiometricRecord[];
  isLoading: boolean;
}

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function BiometricHistory({ records, isLoading }: BiometricHistoryProps) {
  return (
    <section
      aria-labelledby="titulo-historial"
      className="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 id="titulo-historial" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Historial de registros
      </h2>

      {isLoading && (
        <p role="status" className="text-sm text-zinc-500 dark:text-zinc-400">
          Cargando registros...
        </p>
      )}

      {!isLoading && records.length === 0 && (
        <p role="status" className="text-sm text-zinc-500 dark:text-zinc-400">
          Todavía no tienes registros. Usa el formulario para agregar tu primera lectura.
        </p>
      )}

      {!isLoading && records.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Historial de lecturas biométricas ordenadas de la más reciente a la más antigua
            </caption>
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th scope="col" className="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">
                  Fecha
                </th>
                <th scope="col" className="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">
                  Glucosa
                </th>
                <th scope="col" className="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">
                  Presión
                </th>
                <th scope="col" className="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">
                  FC
                </th>
                <th scope="col" className="py-2 font-medium text-zinc-700 dark:text-zinc-300">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-zinc-100 dark:border-zinc-900">
                  <td className="py-2 pr-4 text-zinc-600 dark:text-zinc-400">
                    {dateFormatter.format(new Date(record.recordedAt))}
                  </td>
                  <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-50">
                    {record.glucoseMgDl} mg/dL
                  </td>
                  <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-50">
                    {record.systolicBp}/{record.diastolicBp} mmHg
                  </td>
                  <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-50">
                    {record.heartRate} lpm
                  </td>
                  <td className="py-2 text-zinc-600 dark:text-zinc-400">{record.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
