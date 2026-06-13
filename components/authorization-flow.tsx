"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ScanSearch,
  ShieldCheck,
  Sparkles,
  FileText,
  Check,
  Loader2,
  ArrowRight,
  RotateCcw,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScoreGauge } from "@/components/score-gauge"
import { StatusBadge } from "@/components/case-ui"
import { EPS_LIST } from "@/lib/data"
import { cn } from "@/lib/utils"

type Phase = "form" | "processing" | "result"

type FormState = {
  patientName: string
  patientAge: string
  diagnosis: string
  service: string
  doctor: string
  eps: string
}

const AGENTS = [
  {
    id: 1,
    tag: "Lectura IDP",
    name: "Agente Extractor",
    detail: "Extrayendo datos clínicos de la solicitud médica.",
    icon: ScanSearch,
    duration: 1800,
  },
  {
    id: 2,
    tag: "Verificación",
    name: "Agente Validador",
    detail: "Validando cobertura en el plan de beneficios de la EPS.",
    icon: ShieldCheck,
    duration: 2000,
  },
  {
    id: 3,
    tag: "Análisis Gemini 2.5",
    name: "Analista Clínico",
    detail: "Evaluando pertinencia clínica y calculando score.",
    icon: Sparkles,
    duration: 2400,
  },
  {
    id: 4,
    tag: "Generación",
    name: "Generador de Respuestas",
    detail: "Creando documento oficial de autorización en PDF.",
    icon: FileText,
    duration: 1700,
  },
]

const EXAMPLES = [
  {
    patientName: "Sandra Liliana Ruiz",
    patientAge: "48",
    diagnosis: "M54.5 — Lumbago no especificado",
    service: "Terapia física, 10 sesiones",
    doctor: "Dr. Julián Castaño",
    eps: "EPS Sura",
  },
  {
    patientName: "Andrés Mauricio Peña",
    patientAge: "61",
    diagnosis: "I25.1 — Enfermedad coronaria aterosclerótica",
    service: "Cateterismo cardíaco diagnóstico",
    doctor: "Dra. Liliana Acosta",
    eps: "Sanitas EPS",
  },
]

function computeResult(form: FormState) {
  // Deterministic-ish pseudo score from inputs for realism
  const seed =
    (form.service.length * 7 +
      form.diagnosis.length * 3 +
      form.patientName.length) %
    55
  const score = 45 + seed // 45..99
  const approved = score >= 70
  const reasoning = approved
    ? `La solicitud de "${form.service}" es coherente con el diagnóstico reportado (${form.diagnosis}). El servicio está incluido en el plan de beneficios de ${form.eps} y cumple los criterios de la guía de práctica clínica. No se identifican banderas rojas ni requisitos pendientes, por lo que la autorización procede de forma automática.`
    : `La solicitud de "${form.service}" para el diagnóstico ${form.diagnosis} requiere verificación adicional. No se evidencian en la documentación todos los requisitos exigidos por ${form.eps} (concepto de comité o evidencia de manejo previo). Se escala a un auditor médico para revisión antes de emitir la decisión final.`
  return { score, approved, reasoning }
}

export function AuthorizationFlow() {
  const [phase, setPhase] = useState<Phase>("form")
  const [form, setForm] = useState<FormState>({
    patientName: "",
    patientAge: "",
    diagnosis: "",
    service: "",
    doctor: "",
    eps: "",
  })
  const [activeAgent, setActiveAgent] = useState(0)
  const [completedAgents, setCompletedAgents] = useState<number[]>([])
  const result = useRef<ReturnType<typeof computeResult> | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const update = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const isValid =
    form.patientName && form.patientAge && form.diagnosis && form.service && form.doctor && form.eps

  const runProcessing = () => {
    result.current = computeResult(form)
    setPhase("processing")
    setActiveAgent(0)
    setCompletedAgents([])

    let elapsed = 0
    AGENTS.forEach((agent, index) => {
      timers.current.push(
        setTimeout(() => setActiveAgent(index), elapsed),
      )
      elapsed += agent.duration
      timers.current.push(
        setTimeout(
          () => setCompletedAgents((prev) => [...prev, agent.id]),
          elapsed,
        ),
      )
    })
    timers.current.push(setTimeout(() => setPhase("result"), elapsed + 400))
  }

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    result.current = null
    setPhase("form")
    setActiveAgent(0)
    setCompletedAgents([])
  }

  if (phase === "processing") {
    return (
      <ProcessingView
        activeAgent={activeAgent}
        completedAgents={completedAgents}
      />
    )
  }

  if (phase === "result" && result.current) {
    return (
      <ResultView form={form} result={result.current} onReset={reset} />
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (isValid) runProcessing()
      }}
      className="cp-fade-up rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          Datos de la solicitud
        </p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setForm(ex)}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Ejemplo {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre del paciente">
          <input
            required
            value={form.patientName}
            onChange={(e) => update("patientName", e.target.value)}
            placeholder="Ej. María Fernanda Gómez"
            className={inputClass}
          />
        </Field>
        <Field label="Edad">
          <input
            required
            type="number"
            min={0}
            max={120}
            value={form.patientAge}
            onChange={(e) => update("patientAge", e.target.value)}
            placeholder="Ej. 54"
            className={inputClass}
          />
        </Field>
        <Field label="Diagnóstico o código CIE-10" full>
          <input
            required
            value={form.diagnosis}
            onChange={(e) => update("diagnosis", e.target.value)}
            placeholder="Ej. M17.1 — Gonartrosis primaria unilateral"
            className={inputClass}
          />
        </Field>
        <Field label="Procedimiento o medicamento solicitado" full>
          <input
            required
            value={form.service}
            onChange={(e) => update("service", e.target.value)}
            placeholder="Ej. Resonancia magnética de rodilla derecha"
            className={inputClass}
          />
        </Field>
        <Field label="Médico tratante">
          <input
            required
            value={form.doctor}
            onChange={(e) => update("doctor", e.target.value)}
            placeholder="Ej. Dr. Andrés Felipe Rincón"
            className={inputClass}
          />
        </Field>
        <Field label="EPS aseguradora">
          <select
            required
            value={form.eps}
            onChange={(e) => update("eps", e.target.value)}
            className={cn(inputClass, !form.eps && "text-muted-foreground")}
          >
            <option value="" disabled>
              Seleccione una EPS
            </option>
            {EPS_LIST.map((eps) => (
              <option key={eps} value={eps} className="text-foreground">
                {eps}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
        <p className="text-xs text-muted-foreground sm:mr-auto">
          La solicitud será procesada por 4 agentes de IA en tiempo real.
        </p>
        <Button
          type="submit"
          disabled={!isValid}
          size="lg"
          className="h-12 w-full rounded-full bg-accent px-7 text-base text-accent-foreground hover:bg-accent/90 sm:w-auto"
        >
          Procesar Autorización
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"

function Field({
  label,
  children,
  full,
}: {
  label: string
  children: React.ReactNode
  full?: boolean
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", full && "sm:col-span-2")}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}

function ProcessingView({
  activeAgent,
  completedAgents,
}: {
  activeAgent: number
  completedAgents: number[]
}) {
  return (
    <div className="cp-scale-in rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
      <div className="mx-auto mb-8 max-w-md text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/12 px-3 py-1 text-sm font-medium text-accent">
          <Loader2 className="h-4 w-4 animate-spin" />
          Procesando con UiPath Maestro
        </span>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Los agentes están resolviendo la autorización
        </h2>
      </div>

      <div className="mx-auto max-w-2xl space-y-3">
        {AGENTS.map((agent, index) => {
          const Icon = agent.icon
          const done = completedAgents.includes(agent.id)
          const active = activeAgent === index && !done
          const pending = index > activeAgent && !done
          return (
            <div
              key={agent.id}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300",
                done && "border-success/30 bg-success/5",
                active && "border-accent/40 bg-accent/5 shadow-sm",
                pending && "border-border bg-background opacity-50",
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                  done && "bg-success text-success-foreground",
                  active && "bg-accent text-accent-foreground cp-pulse-ring",
                  pending && "bg-secondary text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="h-5 w-5" strokeWidth={3} />
                ) : active ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{agent.name}</p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                    {agent.tag}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {agent.detail}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                {done ? "Completado" : active ? "Procesando" : "En espera"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ResultView({
  form,
  result,
  onReset,
}: {
  form: FormState
  result: { score: number; approved: boolean; reasoning: string }
  onReset: () => void
}) {
  return (
    <div className="cp-scale-in space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3 text-center">
            <ScoreGauge score={result.score} />
            <StatusBadge
              status={result.approved ? "AUTO_APROBADO" : "REVISION_HUMANA"}
            />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Resultado del análisis
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {result.approved
                ? "Autorización auto-aprobada"
                : "Escalado a revisión humana"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {form.service} · {form.eps}
            </p>

            <div className="mt-5 rounded-2xl bg-secondary/60 p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-accent" />
                Razonamiento clínico de Gemini 2.5
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {result.reasoning}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {result.approved ? (
                <Button
                  size="lg"
                  className="h-11 rounded-full bg-accent px-6 text-accent-foreground hover:bg-accent/90"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Descargar autorización (PDF)
                </Button>
              ) : (
                <Button
                  render={<Link href="/dashboard" />}
                  nativeButton={false}
                  size="lg"
                  className="h-11 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                >
                  Enviar al auditor médico
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={onReset}
                variant="outline"
                size="lg"
                className="h-11 rounded-full px-6"
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                Procesar otra
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
