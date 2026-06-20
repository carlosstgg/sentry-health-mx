"use client";

import { useState, type FormEvent } from "react";
import type { NewBiometricRecord } from "@/types/biometric";

interface BiometricFormProps {
  onSubmit: (record: NewBiometricRecord) => void;
}

interface FormValues {
  glucoseMgDl: string;
  systolicBp: string;
  diastolicBp: string;
  heartRate: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  glucoseMgDl: "",
  systolicBp: "",
  diastolicBp: "",
  heartRate: "",
  notes: "",
};

const RANGES = {
  glucoseMgDl: { min: 40, max: 600, label: "Glucosa" },
  systolicBp: { min: 70, max: 250, label: "Presión sistólica" },
  diastolicBp: { min: 40, max: 150, label: "Presión diastólica" },
  heartRate: { min: 30, max: 220, label: "Frecuencia cardiaca" },
} as const;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  for (const field of Object.keys(RANGES) as Array<keyof typeof RANGES>) {
    const raw = values[field];
    const { min, max, label } = RANGES[field];

    if (raw.trim() === "") {
      errors[field] = `${label} es obligatorio.`;
      continue;
    }

    const numericValue = Number(raw);
    if (Number.isNaN(numericValue)) {
      errors[field] = `${label} debe ser un número.`;
    } else if (numericValue < min || numericValue > max) {
      errors[field] = `${label} debe estar entre ${min} y ${max}.`;
    }
  }

  return errors;
}

export default function BiometricForm({ onSubmit }: BiometricFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmation, setConfirmation] = useState<string>("");

  const handleChange =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setConfirmation("");
      return;
    }

    onSubmit({
      glucoseMgDl: Number(values.glucoseMgDl),
      systolicBp: Number(values.systolicBp),
      diastolicBp: Number(values.diastolicBp),
      heartRate: Number(values.heartRate),
      notes: values.notes.trim() || undefined,
    });

    setValues(INITIAL_VALUES);
    setConfirmation("Tu registro se guardó correctamente.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="titulo-formulario-registro"
      className="flex w-full max-w-xl flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2
        id="titulo-formulario-registro"
        className="text-xl font-semibold text-zinc-900 dark:text-zinc-50"
      >
        Registrar lectura biométrica
      </h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="glucoseMgDl" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Glucosa (mg/dL)
        </label>
        <input
          id="glucoseMgDl"
          name="glucoseMgDl"
          type="number"
          inputMode="decimal"
          value={values.glucoseMgDl}
          onChange={handleChange("glucoseMgDl")}
          aria-invalid={Boolean(errors.glucoseMgDl)}
          aria-describedby={errors.glucoseMgDl ? "error-glucoseMgDl" : undefined}
          className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        {errors.glucoseMgDl && (
          <p id="error-glucoseMgDl" role="alert" className="text-sm text-red-600 dark:text-red-400">
            {errors.glucoseMgDl}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="systolicBp" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Presión sistólica (mmHg)
        </label>
        <input
          id="systolicBp"
          name="systolicBp"
          type="number"
          inputMode="numeric"
          value={values.systolicBp}
          onChange={handleChange("systolicBp")}
          aria-invalid={Boolean(errors.systolicBp)}
          aria-describedby={errors.systolicBp ? "error-systolicBp" : undefined}
          className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        {errors.systolicBp && (
          <p id="error-systolicBp" role="alert" className="text-sm text-red-600 dark:text-red-400">
            {errors.systolicBp}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="diastolicBp" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Presión diastólica (mmHg)
        </label>
        <input
          id="diastolicBp"
          name="diastolicBp"
          type="number"
          inputMode="numeric"
          value={values.diastolicBp}
          onChange={handleChange("diastolicBp")}
          aria-invalid={Boolean(errors.diastolicBp)}
          aria-describedby={errors.diastolicBp ? "error-diastolicBp" : undefined}
          className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        {errors.diastolicBp && (
          <p id="error-diastolicBp" role="alert" className="text-sm text-red-600 dark:text-red-400">
            {errors.diastolicBp}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="heartRate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Frecuencia cardiaca (lpm)
        </label>
        <input
          id="heartRate"
          name="heartRate"
          type="number"
          inputMode="numeric"
          value={values.heartRate}
          onChange={handleChange("heartRate")}
          aria-invalid={Boolean(errors.heartRate)}
          aria-describedby={errors.heartRate ? "error-heartRate" : undefined}
          className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        {errors.heartRate && (
          <p id="error-heartRate" role="alert" className="text-sm text-red-600 dark:text-red-400">
            {errors.heartRate}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Notas (opcional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          value={values.notes}
          onChange={handleChange("notes")}
          className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-md bg-blue-700 px-4 py-2 font-medium text-white transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Guardar registro
      </button>

      <p role="status" aria-live="polite" className="text-sm text-green-700 dark:text-green-400">
        {confirmation}
      </p>
    </form>
  );
}
