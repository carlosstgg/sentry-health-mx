import type { BiometricRecord } from "@/types/biometric";

const hoursAgo = (hours: number): string =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

export const biometricSeed: BiometricRecord[] = [
  {
    id: "seed-1",
    glucoseMgDl: 187.5,
    systolicBp: 138,
    diastolicBp: 88,
    heartRate: 78,
    recordedAt: hoursAgo(24),
    notes: "Después del desayuno",
  },
  {
    id: "seed-2",
    glucoseMgDl: 156.8,
    systolicBp: 135,
    diastolicBp: 85,
    heartRate: 75,
    recordedAt: hoursAgo(6),
  },
  {
    id: "seed-3",
    glucoseMgDl: 210.3,
    systolicBp: 142,
    diastolicBp: 91,
    heartRate: 82,
    recordedAt: hoursAgo(1),
    notes: "Después de comida con alto índice glucémico",
  },
];
