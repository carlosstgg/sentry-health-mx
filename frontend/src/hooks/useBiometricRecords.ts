"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import type { Database } from "@/types/database";
import type { BiometricRecord, NewBiometricRecord } from "@/types/biometric";

type BiometricRow =
  Database["public"]["Tables"]["biometric_records"]["Row"];

/** Convierte una fila de la base (snake_case, anulable) al tipo de dominio. */
function mapRow(row: BiometricRow): BiometricRecord {
  return {
    id: row.id,
    glucoseMgDl: Number(row.glucose_mg_dl ?? 0),
    systolicBp: row.systolic_bp ?? 0,
    diastolicBp: row.diastolic_bp ?? 0,
    heartRate: row.heart_rate ?? 0,
    recordedAt: row.recorded_at ?? new Date().toISOString(),
    notes: row.notes ?? undefined,
  };
}

interface UseBiometricRecords {
  records: BiometricRecord[];
  addRecord: (record: NewBiometricRecord) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useBiometricRecords(): UseBiometricRecords {
  const { user } = useAuth();
  const [records, setRecords] = useState<BiometricRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Todos los setState ocurren después del await para no disparar
    // renders en cascada de forma síncrona dentro del efecto.
    async function load() {
      const { data, error: queryError } = await supabase
        .from("biometric_records")
        .select("*")
        .order("recorded_at", { ascending: false });

      if (cancelled) return;

      if (queryError) {
        setError("No pudimos cargar tus registros. Revisa tu conexión.");
      } else {
        setRecords((data ?? []).map(mapRow));
        setError(null);
      }
      setIsLoading(false);
    }

    if (user) {
      void load();
    }

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addRecord = useCallback(
    async (newRecord: NewBiometricRecord) => {
      if (!user) {
        throw new Error("Debes iniciar sesión para guardar registros.");
      }

      const { data, error: insertError } = await supabase
        .from("biometric_records")
        .insert({
          user_id: user.id,
          glucose_mg_dl: newRecord.glucoseMgDl,
          systolic_bp: newRecord.systolicBp,
          diastolic_bp: newRecord.diastolicBp,
          heart_rate: newRecord.heartRate,
          notes: newRecord.notes ?? null,
        })
        .select()
        .single();

      if (insertError || !data) {
        throw new Error("No pudimos guardar tu registro. Intenta de nuevo.");
      }

      setRecords((previous) => [mapRow(data), ...previous]);
    },
    [user],
  );

  return { records, addRecord, isLoading, error };
}
