"use client"

import { CASES, formatTime, type AuthCase, type CaseStatus } from "@/lib/data"

const STORAGE_KEY = "clearpath:local-cases"

export type ProcessApiResponse = {
  success: boolean
  caseId: string
  score: number
  approved: boolean
  reasoning: string
  timestamp: string
  uipathSync?: { synced: boolean; mode: "live" | "fail-safe"; queueItemId?: number }
}

export type SubmittedForm = {
  patientName: string
  patientAge: string
  diagnosis: string
  service: string
  doctor: string
  eps: string
}

export function getLocalCases(): AuthCase[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AuthCase[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLocalCase(newCase: AuthCase) {
  if (typeof window === "undefined") return
  try {
    const existing = getLocalCases()
    const next = [newCase, ...existing.filter((c) => c.id !== newCase.id)]
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // localStorage no disponible
  }
}

export function getAllCases(): AuthCase[] {
  return [...getLocalCases(), ...CASES]
}

export function findCaseById(id: string): AuthCase | undefined {
  return getAllCases().find((c) => c.id === id)
}

export function buildCaseFromSubmission(
  form: SubmittedForm,
  api: ProcessApiResponse,
): AuthCase {
  const status: CaseStatus = api.approved ? "AUTO_APROBADO" : "REVISION_HUMANA"
  const receivedAt = Date.parse(api.timestamp) || Date.now()
  const cie10Match = form.diagnosis.match(/[A-Z]\d{2}(\.\d+)?/i)
  const cie10 = cie10Match ? cie10Match[0].toUpperCase() : "N/A"

  return {
    id: api.caseId,
    patientName: form.patientName,
    patientAge: Number(form.patientAge) || 0,
    patientDocument: "Validado por Agente Extractor",
    service: form.service,
    serviceType: "Procedimiento",
    cie10,
    diagnosis: form.diagnosis,
    doctor: form.doctor,
    doctorRegistry: "RM pendiente de verificación",
    eps: form.eps,
    plan: "Plan de Beneficios en Salud (PBS)",
    pertinenceScore: api.score,
    stage: "DECISION",
    status,
    receivedAt,
    reasoning: api.reasoning,
    riskFactors: api.approved
      ? ["Sin factores de riesgo adicionales detectados por el analista clínico."]
      : [
          "Complejidad clínica o impacto asistencial que requiere validación adicional.",
          "Escalado a auditor médico conforme a protocolos de gestión de la utilización.",
        ],
    coverageChecklist: [
      { label: "Datos clínicos extraídos por UiPath IDP", covered: true },
      { label: `Cobertura verificada en plan de ${form.eps}`, covered: true },
      { label: "Pertinencia clínica validada automáticamente", covered: api.approved },
    ],
    timeline: [
      {
        agent: "Agente Extractor",
        action: "Solicitud recibida y datos clínicos estructurados.",
        timestamp: formatTime(receivedAt),
      },
      {
        agent: "Agente Validador",
        action: `Cobertura verificada en ${form.eps}.`,
        timestamp: formatTime(receivedAt),
      },
      {
        agent: "Analista Clínico (Gemini 2.5)",
        action: api.approved
          ? "Pertinencia clínica confirmada. Autorización automática emitida."
          : "Pertinencia clínica con incertidumbre. Caso escalado a auditoría humana.",
        timestamp: formatTime(receivedAt),
      },
      {
        agent: "UiPath Maestro",
        action: api.uipathSync?.synced
          ? `Caso despachado a Orchestrator (Queue Item #${api.uipathSync.queueItemId ?? "—"}).`
          : "Caso registrado en cola local (Modo Respaldo). Sincronización UiPath pendiente.",
        timestamp: formatTime(receivedAt),
      },
    ],
  }
}
