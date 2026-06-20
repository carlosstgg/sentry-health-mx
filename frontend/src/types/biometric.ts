export interface BiometricRecord {
  id: string;
  glucoseMgDl: number;
  systolicBp: number;
  diastolicBp: number;
  heartRate: number;
  recordedAt: string;
  notes?: string;
}

export type NewBiometricRecord = Omit<BiometricRecord, "id" | "recordedAt">;
