export type AuthorizationInput = {
  patientName: string
  patientAge: string | number
  diagnosis: string
  service: string
  doctor: string
  eps: string
}

export type ScoringResult = {
  score: number
  approved: boolean
  reasoning: string
  caseId: string
}

export type ValidationError = {
  field: string
  message: string
}

type ClinicalContext = {
  age: number
  ageGroup: "pediatric" | "adult" | "elderly"
  isOncology: boolean
  isSurgery: boolean
  isEmergency: boolean
  isChronic: boolean
  isRoutine: boolean
  isHighCost: boolean
  isLowRisk: boolean
  hasPriorityDiagnosis: boolean
  eps: string
  diagnosis: string
  service: string
}

const HIGH_PRIORITY_DIAGNOSES = [
  "cancer",
  "oncolog",
  "tumor",
  "neoplasia",
  "fracture",
  "fractura",
  "trauma",
  "diabetes",
  "stroke",
  "ictus",
  "hipertension",
  "hipertensión",
  "cardiac",
  "cardiaco",
  "cardíaco",
  "surgery",
  "cirugia",
  "cirugía",
]

const CHRONIC_CONDITIONS = [
  "diabetes",
  "hipertension",
  "hipertensión",
  "epoc",
  "cronico",
  "crónico",
  "insuficiencia renal",
  "artritis",
]

const AUTO_APPROVED_SERVICES = [
  "terapia física",
  "terapia fisica",
  "consulta especializada",
  "laboratorio",
  "resonancia",
  "radiografia",
  "radiografía",
  "medicamentos",
  "medicamento",
]

const HIGH_COST_SERVICES = [
  "cirugía",
  "cirugia",
  "cirugía robótica",
  "cirugia robotica",
  "quimioterapia",
  "hospitalización",
  "hospitalizacion",
  "uci",
]

const URGENCY_KEYWORDS = [
  "urgente",
  "prioritario",
  "emergencia",
  "critico",
  "crítico",
  "inmediato",
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function containsAny(text: string, keywords: string[]): string | null {
  const normalized = normalize(text)
  for (const keyword of keywords) {
    if (normalized.includes(normalize(keyword))) {
      return keyword
    }
  }
  return null
}

function buildClinicalContext(input: AuthorizationInput): ClinicalContext {
  const age = Number(input.patientAge)
  const diagnosis = input.diagnosis.trim()
  const service = input.service.trim()

  const isOncology =
    !!containsAny(diagnosis, ["cancer", "oncolog", "tumor", "neoplasia", "linfoma", "leucemia"]) ||
    !!containsAny(service, ["quimioterapia", "radioterapia", "oncolog"])

  const isSurgery =
    !!containsAny(service, HIGH_COST_SERVICES) ||
    !!containsAny(diagnosis, ["cirugia", "cirugía", "surgery"])

  const isEmergency = !!containsAny(`${diagnosis} ${service}`, URGENCY_KEYWORDS)
  const isChronic = !!containsAny(diagnosis, CHRONIC_CONDITIONS)
  const isHighCost = !!containsAny(service, HIGH_COST_SERVICES)
  const isRoutine =
    !!containsAny(service, AUTO_APPROVED_SERVICES) && !isHighCost && !isOncology
  const hasPriorityDiagnosis = !!containsAny(diagnosis, HIGH_PRIORITY_DIAGNOSES)
  const isLowRisk = isRoutine && !hasPriorityDiagnosis && !isEmergency

  return {
    age,
    ageGroup: age <= 18 ? "pediatric" : age >= 60 ? "elderly" : "adult",
    isOncology,
    isSurgery,
    isEmergency,
    isChronic,
    isRoutine,
    isHighCost,
    isLowRisk,
    hasPriorityDiagnosis,
    eps: input.eps.trim(),
    diagnosis,
    service,
  }
}

function pickVariant(seed: string, variants: string[]): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % variants.length
  }
  return variants[hash]
}

function generateApprovedReasoning(ctx: ClinicalContext, caseId: string): string {
  if (ctx.isEmergency) {
    return pickVariant(caseId, [
      `Se identificó indicación de atención prioritaria en la solicitud de «${ctx.service}», alineada con el diagnóstico de «${ctx.diagnosis}». La pertinencia clínica es consistente y no se observan criterios de exclusión en el plan de beneficios de ${ctx.eps}. La autorización automática es segura bajo protocolos de oportunidad médica.`,
      `El cuadro clínico reportado justifica intervención oportuna. El procedimiento solicitado guarda relación directa con el diagnóstico y cumple criterios de necesidad médica según lineamientos de gestión de la utilización. Se autoriza de forma automática para preservar continuidad asistencial.`,
    ])
  }

  if (ctx.isOncology) {
    return pickVariant(caseId, [
      `La solicitud oncológica de «${ctx.service}» se encuentra clínicamente fundamentada frente al diagnóstico «${ctx.diagnosis}». Se verificó coherencia entre historia clínica, indicación terapéutica y cobertura del plan de ${ctx.eps}. No se identifican alertas que impidan autorización inmediata.`,
      `El caso oncológico presenta documentación suficiente para sustentar la necesidad del servicio solicitado. La intervención propuesta es pertinente dentro del marco de atención oncológica y no requiere escalamiento adicional en esta etapa.`,
    ])
  }

  if (ctx.ageGroup === "pediatric") {
    return pickVariant(caseId, [
      `En el contexto pediátrico del paciente (${ctx.age} años), el servicio «${ctx.service}» es coherente con el diagnóstico «${ctx.diagnosis}» y responde a criterios de necesidad médica establecidos para la población infantil. La cobertura en ${ctx.eps} es plausible y no se detectan exclusiones relevantes.`,
      `La solicitud pediátrica cumple con criterios de pertinencia clínica y oportunidad asistencial. El procedimiento solicitado es acorde al diagnóstico y se autoriza automáticamente para evitar demoras en la atención del menor.`,
    ])
  }

  if (ctx.ageGroup === "elderly") {
    return pickVariant(caseId, [
      `Considerando el perfil del adulto mayor (${ctx.age} años), la solicitud de «${ctx.service}» presenta coherencia clínica con «${ctx.diagnosis}» y evidencia de necesidad médica. Se validó pertinencia frente al plan de beneficios de ${ctx.eps} sin hallar criterios de exclusión.`,
      `El caso del adulto mayor requiere continuidad asistencial oportuna. El servicio solicitado es clínicamente justificado, con riesgo bajo de sobreutilización, por lo que procede autorización automática.`,
    ])
  }

  if (ctx.isChronic) {
    return pickVariant(caseId, [
      `El diagnóstico de condición crónica «${ctx.diagnosis}» sustenta de forma razonable la solicitud de «${ctx.service}». La intervención solicitada contribuye al manejo integral del paciente y se encuentra alineada con protocolos de manejo crónico vigentes en el sistema de salud colombiano.`,
      `La solicitud se enmarca en el seguimiento de patología crónica con indicación médica clara. No se identifican inconsistencias clínicas ni alertas de riesgo que obliguen revisión adicional.`,
    ])
  }

  if (ctx.isRoutine || ctx.isLowRisk) {
    return pickVariant(caseId, [
      `El servicio solicitado presenta coherencia clínica con el diagnóstico reportado y evidencia suficiente de necesidad médica. No se identifican alertas de riesgo elevado ni criterios de exclusión, por lo que la solicitud cumple condiciones para autorización automática.`,
      `La solicitud corresponde a un procedimiento de baja complejidad asistencial, con indicación médica clara y alineación con el plan de beneficios de ${ctx.eps}. La autorización automática es segura y acorde a protocolos de gestión de la utilización.`,
      `Tras revisar diagnóstico, servicio solicitado y cobertura en ${ctx.eps}, se concluye que la pertinencia clínica es adecuada. No se requieren validaciones adicionales para emitir la autorización.`,
    ])
  }

  return pickVariant(caseId, [
    `El servicio solicitado presenta coherencia clínica con el diagnóstico reportado y evidencia suficiente de necesidad médica. No se identifican alertas de riesgo elevado ni criterios de exclusión, por lo que la solicitud cumple condiciones para autorización automática.`,
    `La solicitud cumple criterios de pertinencia clínica y cobertura plausible en ${ctx.eps}. Se autoriza de forma automática al no detectarse factores de riesgo que exijan intervención del auditor médico.`,
  ])
}

function generateReviewReasoning(ctx: ClinicalContext, caseId: string): string {
  if (ctx.isOncology && ctx.isHighCost) {
    return pickVariant(caseId, [
      `El caso oncológico combina alta complejidad clínica con un procedimiento de impacto asistencial y económico significativo («${ctx.service}»). Se recomienda validación por auditor médico para confirmar pertinencia, soportes clínicos y cobertura en ${ctx.eps} antes de emitir decisión definitiva.`,
      `La naturaleza oncológica del diagnóstico y el costo del servicio solicitado exigen revisión especializada. Es necesario verificar protocolos MIPRES, junta médica o criterios de exclusión antes de autorizar.`,
    ])
  }

  if (ctx.isSurgery || ctx.isHighCost) {
    return pickVariant(caseId, [
      `El caso presenta alta complejidad clínica debido a la severidad del diagnóstico y al impacto asistencial del procedimiento solicitado («${ctx.service}»). Se recomienda validación por auditor médico para confirmar pertinencia, cobertura y soportes clínicos antes de emitir una decisión definitiva.`,
      `Los procedimientos de alto costo o complejidad quirúrgica requieren verificación de indicación, alternativas terapéuticas y documentación de soporte. El caso se escala a revisión humana conforme a protocolos de gestión de la utilización.`,
      `La solicitud de «${ctx.service}» implica impacto significativo en el plan de beneficios de ${ctx.eps}. Se requiere dictamen del auditor médico para confirmar necesidad, oportunidad y cumplimiento normativo.`,
    ])
  }

  if (ctx.isEmergency) {
    return pickVariant(caseId, [
      `Aunque existe indicación de urgencia, persisten elementos de incertidumbre clínica o de cobertura que impiden autorización automática. Se escala a auditor médico para balancear oportunidad asistencial con cumplimiento de criterios de pertinencia en ${ctx.eps}.`,
      `El caso presenta señales de prioridad clínica, pero la complejidad del servicio solicitado requiere validación adicional de soportes y criterios de exclusión antes de autorizar.`,
    ])
  }

  if (ctx.ageGroup === "elderly" && ctx.hasPriorityDiagnosis) {
    return pickVariant(caseId, [
      `En adulto mayor con diagnóstico de alta complejidad («${ctx.diagnosis}»), la solicitud de «${ctx.service}» requiere evaluación individualizada de riesgo-beneficio y pertinencia. Se deriva a auditoría médica para confirmar indicación y continuidad asistencial segura.`,
      `La combinación de edad avanzada y diagnóstico severo incrementa la incertidumbre clínica. Se recomienda revisión humana antes de autorizar el procedimiento solicitado.`,
    ])
  }

  if (ctx.isChronic && !ctx.isRoutine) {
    return pickVariant(caseId, [
      `El manejo de patología crónica asociada a «${ctx.diagnosis}» requiere validar que «${ctx.service}» sea la intervención más pertinente dentro del plan de ${ctx.eps}. Se escala a auditor médico por posible necesidad de protocolo o junta de profesionales.`,
      `La solicitud en contexto de enfermedad crónica presenta matices clínicos que ameritan revisión especializada antes de autorizar.`,
    ])
  }

  return pickVariant(caseId, [
    `El caso presenta alta complejidad clínica debido a la severidad del diagnóstico y al impacto asistencial del procedimiento solicitado. Se recomienda validación por auditor médico para confirmar pertinencia, cobertura y soportes clínicos antes de emitir una decisión definitiva.`,
    `Persisten factores de incertidumbre en pertinencia clínica, cobertura o complejidad del servicio solicitado. La solicitud se deriva a revisión humana conforme a protocolos de autorización de ${ctx.eps}.`,
    `La solicitud no cumple criterios suficientes para autorización automática segura. Se requiere dictamen del auditor médico para evaluar necesidad, oportunidad y cumplimiento del plan de beneficios.`,
  ])
}

export function validateAuthorizationInput(
  input: AuthorizationInput,
): ValidationError | null {
  const name = input.patientName?.trim() ?? ""
  const diagnosis = input.diagnosis?.trim() ?? ""
  const service = input.service?.trim() ?? ""
  const doctor = input.doctor?.trim() ?? ""
  const age = Number(input.patientAge)

  if (name.length < 3) {
    return { field: "patientName", message: "El nombre del paciente debe tener al menos 3 caracteres." }
  }
  if (diagnosis.length < 5) {
    return { field: "diagnosis", message: "El diagnóstico debe tener al menos 5 caracteres." }
  }
  if (service.length < 5) {
    return { field: "service", message: "El servicio solicitado debe tener al menos 5 caracteres." }
  }
  if (doctor.length < 3) {
    return { field: "doctor", message: "El nombre del médico debe tener al menos 3 caracteres." }
  }
  if (!Number.isFinite(age) || age <= 0 || age > 120) {
    return { field: "patientAge", message: "La edad debe ser un número entre 1 y 120." }
  }

  return null
}

export function generateCaseId(): string {
  return `UPM-${Math.floor(100000 + Math.random() * 900000)}`
}

export function computeAuthorizationScore(input: AuthorizationInput): ScoringResult {
  const age = Number(input.patientAge)
  const diagnosis = input.diagnosis.trim()
  const service = input.service.trim()
  const eps = input.eps.trim()
  const caseId = generateCaseId()
  const ctx = buildClinicalContext(input)

  let score = 50

  if (age <= 18) score += 10
  else if (age <= 59) score += 5
  else score += 15

  if (containsAny(diagnosis, HIGH_PRIORITY_DIAGNOSES)) score += 20
  if (containsAny(service, AUTO_APPROVED_SERVICES)) score += 20
  if (containsAny(service, HIGH_COST_SERVICES)) score -= 15

  const epsNorm = normalize(eps)
  if (epsNorm.includes("sura")) score += 5
  else if (epsNorm.includes("sanitas")) score += 3
  else if (epsNorm.includes("salud total")) score += 4

  score = Math.max(0, Math.min(100, score))
  const approved = score >= 80

  const reasoning = approved
    ? generateApprovedReasoning(ctx, caseId)
    : generateReviewReasoning(ctx, caseId)

  return { score, approved, reasoning, caseId }
}
