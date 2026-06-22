import type { BiometricRecord } from "@/types/biometric";

export type OrientationLevel = "sin-datos" | "normal" | "alerta" | "critico";

export interface OrientationGuidance {
  level: OrientationLevel;
  title: string;
  message: string;
  action?: string;
}

const GLUCOSE_LOW_MG_DL = 70;
const GLUCOSE_ALERTA_MG_DL = 180;
const GLUCOSE_CRITICO_MG_DL = 250;
const SYSTOLIC_CRITICO_MMHG = 180;
const DIASTOLIC_CRITICO_MMHG = 120;

/**
 * Reglas de triaje del Módulo de Monitoreo y Orientación (componente
 * crítico de SentryHealth MX). Debe operar enteramente con el último
 * registro disponible en el dispositivo, sin depender de red, para
 * garantizar orientación inmediata aun sin conexión.
 */
export function getOrientationGuidance(
  latestRecord: BiometricRecord | null,
): OrientationGuidance {
  if (!latestRecord) {
    return {
      level: "sin-datos",
      title: "Aún no tienes registros",
      message:
        "Agrega tu primera lectura para que SentryHealth te diga cómo estás.",
    };
  }

  const { glucoseMgDl, systolicBp, diastolicBp } = latestRecord;

  if (glucoseMgDl < GLUCOSE_LOW_MG_DL) {
    return {
      level: "critico",
      title: "Tu glucosa está baja",
      message:
        "Come o bebe algo con azúcar ahora, como jugo o un dulce. Siéntate y descansa.",
      action: "Si no mejoras en 15 minutos o te sientes muy mal, llama a alguien.",
    };
  }

  if (
    systolicBp >= SYSTOLIC_CRITICO_MMHG ||
    diastolicBp >= DIASTOLIC_CRITICO_MMHG ||
    glucoseMgDl >= GLUCOSE_CRITICO_MG_DL
  ) {
    return {
      level: "critico",
      title: "Necesitas atención ahora",
      message: "Siéntate, respira despacio y bebe agua. No hagas esfuerzo físico.",
      action: "Llama a alguien de confianza o a tu médico ahora.",
    };
  }

  if (glucoseMgDl >= GLUCOSE_ALERTA_MG_DL) {
    return {
      level: "alerta",
      title: "Tu glucosa está elevada",
      message: "Bebe agua, evita el azúcar y descansa un momento.",
      action: "Vuelve a registrar tu glucosa más tarde para ver cómo evoluciona.",
    };
  }

  return {
    level: "normal",
    title: "Estás bien por ahora",
    message:
      "Tus últimos signos están en un rango aceptable. Sigue tu rutina de cuidado habitual.",
  };
}
