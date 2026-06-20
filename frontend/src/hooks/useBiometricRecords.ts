"use client";

import { useCallback, useEffect, useState } from "react";
import { biometricSeed } from "@/lib/biometricSeed";
import type { BiometricRecord, NewBiometricRecord } from "@/types/biometric";

const STORAGE_KEY = "sentryhealth:biometric-records";

const sortByRecordedAtDesc = (records: BiometricRecord[]): BiometricRecord[] =>
  [...records].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  );

const readFromStorage = (): BiometricRecord[] => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return biometricSeed;
  }

  try {
    const parsed = JSON.parse(raw) as BiometricRecord[];
    return parsed.length > 0 ? parsed : biometricSeed;
  } catch {
    return biometricSeed;
  }
};

const writeToStorage = (records: BiometricRecord[]): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

interface UseBiometricRecords {
  records: BiometricRecord[];
  isLoading: boolean;
  addRecord: (record: NewBiometricRecord) => void;
}

export function useBiometricRecords(): UseBiometricRecords {
  const [records, setRecords] = useState<BiometricRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = readFromStorage();
    setRecords(sortByRecordedAtDesc(loaded));
    setIsLoading(false);
  }, []);

  const addRecord = useCallback((newRecord: NewBiometricRecord) => {
    const record: BiometricRecord = {
      ...newRecord,
      id: crypto.randomUUID(),
      recordedAt: new Date().toISOString(),
    };

    setRecords((previous) => {
      const updated = sortByRecordedAtDesc([record, ...previous]);
      writeToStorage(updated);
      return updated;
    });
  }, []);

  return { records, isLoading, addRecord };
}
