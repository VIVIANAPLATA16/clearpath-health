export type WorkflowStage =
  | "RECIBIDO"
  | "LECTURA"
  | "VERIFICACION"
  | "ANALISIS_IA"
  | "DECISION"

export const STAGE_ORDER: WorkflowStage[] = [
  "RECIBIDO",
  "LECTURA",
  "VERIFICACION",
  "ANALISIS_IA",
  "DECISION",
]

export const STAGE_LABELS: Record<WorkflowStage, string> = {
  RECIBIDO: "Recibido",
  LECTURA: "Lectura",
  VERIFICACION: "Verificación",
  ANALISIS_IA: "Análisis IA",
  DECISION: "Decisión",
}

export type CaseStatus = "AUTO_APROBADO" | "REVISION_HUMANA" | "EN_PROCESO"

export type TimelineEvent = {
  agent: string
  action: string
  timestamp: string
}

export type AuthCase = {
  id: string
  patientName: string
  patientAge: number
  patientDocument: string
  service: string
  serviceType: "Procedimiento" | "Medicamento" | "Examen diagnóstico"
  cie10: string
  diagnosis: string
  doctor: string
  doctorRegistry: string
  eps: string
  plan: string
  pertinenceScore: number
  stage: WorkflowStage
  status: CaseStatus
  receivedAt: number // epoch ms
  reasoning: string
  riskFactors: string[]
  coverageChecklist: { label: string; covered: boolean }[]
  timeline: TimelineEvent[]
}

export const EPS_LIST = [
  "EPS Sura",
  "Sanitas EPS",
  "Compensar EPS",
  "Nueva EPS",
  "Salud Total EPS",
  "Coomeva EPS",
  "Famisanar EPS",
]

const now = Date.now()
const sec = 1000
const min = 60 * sec

export function relativeTime(epoch: number, reference: number = Date.now()): string {
  const diff = Math.max(0, reference - epoch)
  const s = Math.floor(diff / 1000)
  if (s < 60) return `hace ${s} segundo${s === 1 ? "" : "s"}`
  const m = Math.floor(s / 60)
  if (m < 60) return `hace ${m} minuto${m === 1 ? "" : "s"}`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h} hora${h === 1 ? "" : "s"}`
  const d = Math.floor(h / 24)
  return `hace ${d} día${d === 1 ? "" : "s"}`
}

export function formatTime(epoch: number): string {
  return new Date(epoch).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export const CASES: AuthCase[] = [
  {
    id: "AUT-2024-08891",
    patientName: "María Fernanda Gómez",
    patientAge: 54,
    patientDocument: "CC 39.482.117",
    service: "Resonancia magnética de rodilla derecha",
    serviceType: "Examen diagnóstico",
    cie10: "M17.1",
    diagnosis: "Gonartrosis primaria unilateral",
    doctor: "Dr. Andrés Felipe Rincón",
    doctorRegistry: "RM 52.118",
    eps: "EPS Sura",
    plan: "Plan de Beneficios en Salud (PBS)",
    pertinenceScore: 92,
    stage: "DECISION",
    status: "AUTO_APROBADO",
    receivedAt: now - 45 * sec,
    reasoning:
      "El diagnóstico de gonartrosis (M17.1) con dolor persistente mayor a 3 meses y limitación funcional justifica clínicamente la resonancia magnética. El procedimiento está incluido en el PBS y no requiere autorización adicional del comité técnico-científico. La solicitud es pertinente y cumple los criterios de la guía de práctica clínica.",
    riskFactors: ["Edad mayor a 50 años", "Sin contraindicaciones reportadas"],
    coverageChecklist: [
      { label: "Procedimiento incluido en PBS", covered: true },
      { label: "Diagnóstico coherente con el servicio", covered: true },
      { label: "Prestador habilitado en red", covered: true },
      { label: "Sin período mínimo de cotización pendiente", covered: true },
    ],
    timeline: [
      { agent: "Agente Extractor", action: "Datos clínicos extraídos del formato de solicitud médica.", timestamp: formatTime(now - 44 * sec) },
      { agent: "Agente Validador", action: "Cobertura verificada en el plan de beneficios de EPS Sura.", timestamp: formatTime(now - 40 * sec) },
      { agent: "Analista Clínico", action: "Pertinencia clínica evaluada. Score: 92/100.", timestamp: formatTime(now - 32 * sec) },
      { agent: "Generador de Respuestas", action: "Documento oficial de autorización generado en PDF.", timestamp: formatTime(now - 28 * sec) },
    ],
  },
  {
    id: "AUT-2024-08890",
    patientName: "Jorge Iván Restrepo",
    patientAge: 67,
    patientDocument: "CC 70.554.902",
    service: "Adalimumab 40mg solución inyectable",
    serviceType: "Medicamento",
    cie10: "M05.9",
    diagnosis: "Artritis reumatoide seropositiva",
    doctor: "Dra. Carolina Méndez Ospina",
    doctorRegistry: "RM 48.770",
    eps: "Sanitas EPS",
    plan: "Plan complementario PAC",
    pertinenceScore: 58,
    stage: "DECISION",
    status: "REVISION_HUMANA",
    receivedAt: now - 3 * min,
    reasoning:
      "El medicamento biológico Adalimumab es de alto costo y está sujeto a verificación del comité técnico-científico. Aunque el diagnóstico de artritis reumatoide es coherente, no se evidencia en la documentación el fallo terapéutico previo a FAME convencionales (metotrexato) exigido por la guía. Se recomienda revisión por auditor médico antes de aprobar.",
    riskFactors: [
      "Medicamento de alto costo (biológico)",
      "Falta evidencia de terapia previa con FAME",
      "Paciente mayor de 65 años",
    ],
    coverageChecklist: [
      { label: "Medicamento incluido en PBS", covered: true },
      { label: "Requiere concepto de comité técnico-científico", covered: false },
      { label: "Evidencia de fallo terapéutico previo", covered: false },
      { label: "Prestador habilitado en red", covered: true },
    ],
    timeline: [
      { agent: "Agente Extractor", action: "Datos clínicos extraídos del formato de solicitud médica.", timestamp: formatTime(now - 3 * min) },
      { agent: "Agente Validador", action: "Medicamento identificado como de alto costo. Validación de requisitos.", timestamp: formatTime(now - 3 * min + 18 * sec) },
      { agent: "Analista Clínico", action: "Pertinencia clínica evaluada. Score: 58/100. Escalado a revisión humana.", timestamp: formatTime(now - 3 * min + 40 * sec) },
    ],
  },
  {
    id: "AUT-2024-08889",
    patientName: "Luz Adriana Cardona",
    patientAge: 41,
    patientDocument: "CC 43.118.665",
    service: "Colecistectomía laparoscópica",
    serviceType: "Procedimiento",
    cie10: "K80.2",
    diagnosis: "Cálculo de vesícula biliar sin colecistitis",
    doctor: "Dr. Sebastián Quintero Lozano",
    doctorRegistry: "RM 61.204",
    eps: "Compensar EPS",
    plan: "Plan de Beneficios en Salud (PBS)",
    pertinenceScore: 88,
    stage: "DECISION",
    status: "AUTO_APROBADO",
    receivedAt: now - 8 * min,
    reasoning:
      "La colelitiasis sintomática confirmada por ecografía (K80.2) tiene indicación quirúrgica clara. La colecistectomía laparoscópica es el estándar de manejo, está incluida en el PBS y el prestador cuenta con habilitación para cirugía de baja complejidad. La solicitud es pertinente.",
    riskFactors: ["Sin comorbilidades reportadas", "Riesgo quirúrgico bajo (ASA I)"],
    coverageChecklist: [
      { label: "Procedimiento incluido en PBS", covered: true },
      { label: "Diagnóstico confirmado por imagen", covered: true },
      { label: "Prestador habilitado en red", covered: true },
      { label: "Sin período mínimo de cotización pendiente", covered: true },
    ],
    timeline: [
      { agent: "Agente Extractor", action: "Datos clínicos extraídos del formato de solicitud médica.", timestamp: formatTime(now - 8 * min) },
      { agent: "Agente Validador", action: "Cobertura verificada en el plan de beneficios de Compensar EPS.", timestamp: formatTime(now - 8 * min + 15 * sec) },
      { agent: "Analista Clínico", action: "Pertinencia clínica evaluada. Score: 88/100.", timestamp: formatTime(now - 8 * min + 35 * sec) },
      { agent: "Generador de Respuestas", action: "Documento oficial de autorización generado en PDF.", timestamp: formatTime(now - 8 * min + 42 * sec) },
    ],
  },
  {
    id: "AUT-2024-08888",
    patientName: "Camilo Andrés Vargas",
    patientAge: 29,
    patientDocument: "CC 1.020.447.331",
    service: "Tomografía axial computarizada de cráneo simple",
    serviceType: "Examen diagnóstico",
    cie10: "G43.9",
    diagnosis: "Migraña no especificada",
    doctor: "Dra. Paula Andrea Torres",
    doctorRegistry: "RM 55.901",
    eps: "Nueva EPS",
    plan: "Plan de Beneficios en Salud (PBS)",
    pertinenceScore: 47,
    stage: "DECISION",
    status: "REVISION_HUMANA",
    receivedAt: now - 14 * min,
    reasoning:
      "La solicitud de TAC de cráneo para migraña no especificada (G43.9) sin signos de alarma neurológicos documentados no cumple los criterios de la guía de práctica clínica para neuroimagen. No se reportan banderas rojas (cefalea de inicio súbito, déficit focal, papiledema). Se recomienda revisión del auditor para evitar exposición innecesaria a radiación.",
    riskFactors: [
      "Sin signos de alarma neurológicos documentados",
      "Estudio no indicado por guía de práctica clínica",
      "Posible exposición innecesaria a radiación",
    ],
    coverageChecklist: [
      { label: "Procedimiento incluido en PBS", covered: true },
      { label: "Cumple criterios de neuroimagen de la GPC", covered: false },
      { label: "Signos de alarma documentados", covered: false },
      { label: "Prestador habilitado en red", covered: true },
    ],
    timeline: [
      { agent: "Agente Extractor", action: "Datos clínicos extraídos del formato de solicitud médica.", timestamp: formatTime(now - 14 * min) },
      { agent: "Agente Validador", action: "Cobertura verificada en el plan de beneficios de Nueva EPS.", timestamp: formatTime(now - 14 * min + 12 * sec) },
      { agent: "Analista Clínico", action: "Pertinencia clínica evaluada. Score: 47/100. Escalado a revisión humana.", timestamp: formatTime(now - 14 * min + 30 * sec) },
    ],
  },
  {
    id: "AUT-2024-08887",
    patientName: "Gloria Patricia Naranjo",
    patientAge: 62,
    patientDocument: "CC 41.905.228",
    service: "Hemoglobina glicosilada (HbA1c)",
    serviceType: "Examen diagnóstico",
    cie10: "E11.9",
    diagnosis: "Diabetes mellitus tipo 2 sin complicaciones",
    doctor: "Dr. Ricardo León Mejía",
    doctorRegistry: "RM 39.442",
    eps: "Salud Total EPS",
    plan: "Plan de Beneficios en Salud (PBS)",
    pertinenceScore: 96,
    stage: "DECISION",
    status: "AUTO_APROBADO",
    receivedAt: now - 22 * min,
    reasoning:
      "El control de hemoglobina glicosilada en paciente con diabetes mellitus tipo 2 (E11.9) es un examen de seguimiento de rutina recomendado cada 3 a 6 meses. Está incluido en el PBS, es de bajo costo y plenamente pertinente para el monitoreo metabólico del paciente.",
    riskFactors: ["Control rutinario de bajo riesgo"],
    coverageChecklist: [
      { label: "Examen incluido en PBS", covered: true },
      { label: "Diagnóstico coherente con el servicio", covered: true },
      { label: "Prestador habilitado en red", covered: true },
      { label: "Frecuencia dentro de lo recomendado", covered: true },
    ],
    timeline: [
      { agent: "Agente Extractor", action: "Datos clínicos extraídos del formato de solicitud médica.", timestamp: formatTime(now - 22 * min) },
      { agent: "Agente Validador", action: "Cobertura verificada en el plan de beneficios de Salud Total EPS.", timestamp: formatTime(now - 22 * min + 9 * sec) },
      { agent: "Analista Clínico", action: "Pertinencia clínica evaluada. Score: 96/100.", timestamp: formatTime(now - 22 * min + 20 * sec) },
      { agent: "Generador de Respuestas", action: "Documento oficial de autorización generado en PDF.", timestamp: formatTime(now - 22 * min + 25 * sec) },
    ],
  },
  {
    id: "AUT-2024-08886",
    patientName: "Héctor Manuel Salazar",
    patientAge: 73,
    patientDocument: "CC 19.338.770",
    service: "Artroplastia total de cadera",
    serviceType: "Procedimiento",
    cie10: "M16.1",
    diagnosis: "Coxartrosis primaria bilateral",
    doctor: "Dr. Fernando Gutiérrez Ariza",
    doctorRegistry: "RM 33.870",
    eps: "Famisanar EPS",
    plan: "Plan de Beneficios en Salud (PBS)",
    pertinenceScore: 81,
    stage: "DECISION",
    status: "AUTO_APROBADO",
    receivedAt: now - 35 * min,
    reasoning:
      "La coxartrosis severa bilateral (M16.1) con dolor incapacitante y fracaso del manejo conservador tiene indicación de artroplastia total de cadera. El procedimiento está incluido en el PBS. El score considera la edad avanzada del paciente pero el beneficio funcional supera el riesgo quirúrgico documentado.",
    riskFactors: [
      "Paciente mayor de 70 años",
      "Procedimiento de alta complejidad",
      "Requiere valoración prequirúrgica completa",
    ],
    coverageChecklist: [
      { label: "Procedimiento incluido en PBS", covered: true },
      { label: "Fracaso del manejo conservador documentado", covered: true },
      { label: "Prestador habilitado para alta complejidad", covered: true },
      { label: "Valoración prequirúrgica completa", covered: true },
    ],
    timeline: [
      { agent: "Agente Extractor", action: "Datos clínicos extraídos del formato de solicitud médica.", timestamp: formatTime(now - 35 * min) },
      { agent: "Agente Validador", action: "Cobertura verificada en el plan de beneficios de Famisanar EPS.", timestamp: formatTime(now - 35 * min + 20 * sec) },
      { agent: "Analista Clínico", action: "Pertinencia clínica evaluada. Score: 81/100.", timestamp: formatTime(now - 35 * min + 48 * sec) },
      { agent: "Generador de Respuestas", action: "Documento oficial de autorización generado en PDF.", timestamp: formatTime(now - 35 * min + 55 * sec) },
    ],
  },
]

export const AGENTS = [
  {
    id: "extractor",
    name: "Agente Extractor",
    engine: "UiPath IDP",
    description: "Lee y extrae los datos clínicos de cada solicitud médica.",
    detail: "Extrayendo datos clínicos de la solicitud médica.",
    status: "Procesando" as const,
    processedToday: 1284,
  },
  {
    id: "validador",
    name: "Agente Validador",
    engine: "UiPath Maestro",
    description: "Valida la cobertura en el plan de beneficios de la EPS.",
    detail: "Validando cobertura en el plan de beneficios de la EPS.",
    status: "Completado" as const,
    processedToday: 1251,
  },
  {
    id: "analista",
    name: "Analista Clínico",
    engine: "Gemini 2.5 Flash",
    description: "Evalúa la pertinencia clínica y calcula el score de aprobación.",
    detail: "Evaluando pertinencia clínica y calculando score.",
    status: "Procesando" as const,
    processedToday: 1198,
  },
  {
    id: "generador",
    name: "Generador de Respuestas",
    engine: "Claude Code",
    description: "Crea el documento oficial y legal de autorización en PDF.",
    detail: "Creando documento oficial de autorización en PDF.",
    status: "Libre" as const,
    processedToday: 1077,
  },
]

export type AgentStatus = "Libre" | "Procesando" | "Completado"
