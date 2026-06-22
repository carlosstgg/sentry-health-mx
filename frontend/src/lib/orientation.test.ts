import { getOrientationGuidance } from "@/lib/orientation";
import type { BiometricRecord } from "@/types/biometric";

function buildRecord(overrides: Partial<BiometricRecord>): BiometricRecord {
  return {
    id: "test-id",
    glucoseMgDl: 100,
    systolicBp: 120,
    diastolicBp: 80,
    heartRate: 70,
    recordedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("getOrientationGuidance", () => {
  it("devuelve nivel sin-datos cuando no hay registro previo", () => {
    const guidance = getOrientationGuidance(null);

    expect(guidance.level).toBe("sin-datos");
  });

  it("devuelve nivel critico cuando la glucosa está por debajo de 70 mg/dL", () => {
    const guidance = getOrientationGuidance(buildRecord({ glucoseMgDl: 65 }));

    expect(guidance.level).toBe("critico");
    expect(guidance.action).toMatch(/llama a alguien/i);
  });

  it("devuelve nivel critico cuando la presión sistólica es 180 o más", () => {
    const guidance = getOrientationGuidance(buildRecord({ systolicBp: 182 }));

    expect(guidance.level).toBe("critico");
  });

  it("devuelve nivel alerta cuando la glucosa está elevada sin llegar a crítico", () => {
    const guidance = getOrientationGuidance(buildRecord({ glucoseMgDl: 200 }));

    expect(guidance.level).toBe("alerta");
  });

  it("devuelve nivel normal cuando todos los signos están en rango aceptable", () => {
    const guidance = getOrientationGuidance(buildRecord({}));

    expect(guidance.level).toBe("normal");
  });
});
