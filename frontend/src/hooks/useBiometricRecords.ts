"use client";

import { useSyncExternalStore } from "react";
import { biometricSeed } from "@/lib/biometricSeed";
import type { BiometricRecord, NewBiometricRecord } from "@/types/biometric";

const STORAGE_KEY = "sentryhealth:biometric-records";
const listeners = new Set<() => void>();
let cachedRecords: BiometricRecord[] | null = null;

const sortByRecordedAtDesc = (records: BiometricRecord[]): BiometricRecord[] =>
  [...records].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  );

function readFromStorage(): BiometricRecord[] {
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
}

function writeToStorage(records: BiometricRecord[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

function getSnapshot(): BiometricRecord[] {
  if (cachedRecords === null) {
    cachedRecords = sortByRecordedAtDesc(readFromStorage());
  }
  return cachedRecords;
}

function getServerSnapshot(): BiometricRecord[] {
  return [];
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function addRecord(newRecord: NewBiometricRecord): void {
  const record: BiometricRecord = {
    ...newRecord,
    id: crypto.randomUUID(),
    recordedAt: new Date().toISOString(),
  };

  cachedRecords = sortByRecordedAtDesc([record, ...getSnapshot()]);
  writeToStorage(cachedRecords);
  notifyListeners();
}

interface UseBiometricRecords {
  records: BiometricRecord[];
  addRecord: (record: NewBiometricRecord) => void;
}

export function useBiometricRecords(): UseBiometricRecords {
  const records = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { records, addRecord };
}
