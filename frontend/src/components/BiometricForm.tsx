"use client";

import { useState, type FormEvent } from "react";
import type { NewBiometricRecord } from "@/types/biometric";

interface BiometricFormProps {
  onSubmit: (record: NewBiometricRecord) => Promise<void>;
}

interface FormValues {
  glucoseMgDl: string;
  systolicBp: string;
  diastolicBp: string;
  heartRate: string;
  notes: string;
}

type NumericField = Exclude<keyof FormValues, "notes">;
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

const FIELD_META: Record<
  NumericField,
  { label: string; unit: string; inputMode: "decimal" | "numeric" }
> = {
  glucoseMgDl: { label: "Glucosa", unit: "mg/dL", inputMode: "decimal" },
  systolicBp: { label: "Presión sistólica", unit: "mmHg", inputMode: "numeric" },
  diastolicBp: { label: "Presión diastólica", unit: "mmHg", inputMode: "numeric" },
  heartRate: { label: "Frecuencia cardiaca", unit: "lpm", inputMode: "numeric" },
};

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

const inputClass =
  "h-11 rounded-xl border border-zinc-300 bg-white px-3 text-zinc-900 transition-colors duration-200 placeholder:text-zinc-400 focus-visible:border-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rose-500 aria-[invalid=true]:border-red-500";

interface NumericFieldRowProps {
  field: NumericField;
  value: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function NumericFieldRow({ field, value, error, onChange }: NumericFieldRowProps) {
  const meta = FIELD_META[field];
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field} className="text-sm font-medium text-zinc-700">
        {meta.label}{" "}
        <span className="font-normal text-zinc-400">({meta.unit})</span>
      </label>
      <input
        id={field}
        name={field}
        type="number"
        inputMode={meta.inputMode}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `error-${field}` : undefined}
        className={inputClass}
      />
      {error && (
        <p id={`error-${field}`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function BiometricForm({ onSubmit }: BiometricFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmation, setConfirmation] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setConfirmation("");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        glucoseMgDl: Number(values.glucoseMgDl),
        systolicBp: Number(values.systolicBp),
        diastolicBp: Number(values.diastolicBp),
        heartRate: Number(values.heartRate),
        notes: values.notes.trim() || undefined,
      });

      setValues(INITIAL_VALUES);
      setConfirmation("Tu registro se guardó correctamente.");
    } catch (caught) {
      setConfirmation("");
      setSubmitError(
        caught instanceof Error
          ? caught.message
          : "No pudimos guardar tu registro. Intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="titulo-formulario-registro"
      className="flex w-full flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6"
    >
      <h2
        id="titulo-formulario-registro"
        className="text-xl font-semibold tracking-tight text-zinc-900"
      >
        Registrar lectura biométrica
      </h2>

      <NumericFieldRow
        field="glucoseMgDl"
        value={values.glucoseMgDl}
        error={errors.glucoseMgDl}
        onChange={handleChange("glucoseMgDl")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <NumericFieldRow
          field="systolicBp"
          value={values.systolicBp}
          error={errors.systolicBp}
          onChange={handleChange("systolicBp")}
        />
        <NumericFieldRow
          field="diastolicBp"
          value={values.diastolicBp}
          error={errors.diastolicBp}
          onChange={handleChange("diastolicBp")}
        />
      </div>

      <NumericFieldRow
        field="heartRate"
        value={values.heartRate}
        error={errors.heartRate}
        onChange={handleChange("heartRate")}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-zinc-700">
          Notas <span className="font-normal text-zinc-400">(opcional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          value={values.notes}
          onChange={handleChange("notes")}
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 transition-colors duration-200 placeholder:text-zinc-400 focus-visible:border-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rose-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 font-medium text-white transition-colors duration-200 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Guardando…" : "Guardar registro"}
      </button>

      {submitError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {submitError}
        </p>
      )}

      <p
        role="status"
        aria-live="polite"
        className="min-h-5 text-sm font-medium text-green-700"
      >
        {confirmation}
      </p>
    </form>
  );
}
