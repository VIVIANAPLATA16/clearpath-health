"use client"

import { useState } from "react"
import {
  Check,
  X,
  MessageSquarePlus,
  Sparkles,
  AlertTriangle,
  User,
  Stethoscope,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScoreGauge } from "@/components/score-gauge"
import { StatusBadge, StageTimeline } from "@/components/case-ui"
import { type AuthCase } from "@/lib/data"
import { cn } from "@/lib/utils"

export function CaseDetailActions({ caseData }: { caseData: AuthCase }) {
  const [decision, setDecision] = useState<"none" | "approved" | "info">("none")

  if (decision === "approved") {
    return (
      <div className="cp-scale-in flex items-center gap-3 rounded-2xl border border-success/30 bg-success/8 p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="h-5 w-5" strokeWidth={3} />
        </span>
        <div>
          <p className="font-medium text-foreground">Autorización aprobada</p>
          <p className="text-sm text-muted-foreground">
            El documento oficial fue generado y notificado al prestador.
          </p>
        </div>
      </div>
    )
  }

  if (decision === "info") {
    return (
      <div className="cp-scale-in flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-warning text-warning-foreground">
          <MessageSquarePlus className="h-5 w-5" />
        </span>
        <div>
          <p className="font-medium text-foreground">
            Solicitud de información enviada
          </p>
          <p className="text-sm text-muted-foreground">
            Se notificó al médico tratante para complementar la documentación.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        onClick={() => setDecision("approved")}
        size="lg"
        className="h-12 flex-1 rounded-full bg-success px-6 text-base text-success-foreground hover:bg-success/90"
      >
        <Check className="mr-1 h-4 w-4" strokeWidth={3} />
        Aprobar Autorización
      </Button>
      <Button
        onClick={() => setDecision("info")}
        variant="outline"
        size="lg"
        className="h-12 flex-1 rounded-full px-6 text-base"
      >
        <MessageSquarePlus className="mr-1 h-4 w-4" />
        Solicitar Más Información
      </Button>
    </div>
  )
}

export function CaseDetailContent({ caseData }: { caseData: AuthCase }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* main column */}
      <div className="space-y-6 lg:col-span-2">
        {/* patient + doctor */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <User className="h-4 w-4" />
            Historia clínica del paciente
          </h2>
          <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Detail label="Paciente" value={caseData.patientName} />
            <Detail label="Documento" value={caseData.patientDocument} />
            <Detail label="Edad" value={`${caseData.patientAge} años`} />
            <Detail label="EPS" value={caseData.eps} />
            <Detail label="Diagnóstico" value={caseData.diagnosis} />
            <Detail label="Código CIE-10" value={caseData.cie10} />
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Stethoscope className="h-4 w-4" />
              Profesional tratante
            </h3>
            <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="Médico" value={caseData.doctor} />
              <Detail label="Registro médico" value={caseData.doctorRegistry} />
              <Detail label="Servicio solicitado" value={caseData.service} />
              <Detail label="Tipo" value={caseData.serviceType} />
            </div>
          </div>
        </div>

        {/* reasoning */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            Razonamiento clínico — Gemini 2.5 Flash
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-foreground">
            {caseData.reasoning}
          </p>
        </div>

        {/* risk + checklist */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Factores de riesgo
            </h2>
            <ul className="mt-4 space-y-3">
              {caseData.riskFactors.map((risk) => (
                <li key={risk} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <FileText className="h-4 w-4" />
              Verificación de cobertura
            </h2>
            <ul className="mt-4 space-y-3">
              {caseData.coverageChecklist.map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-sm">
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                      item.covered
                        ? "bg-success text-success-foreground"
                        : "bg-warning text-warning-foreground",
                    )}
                  >
                    {item.covered ? (
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    ) : (
                      <X className="h-2.5 w-2.5" strokeWidth={3} />
                    )}
                  </span>
                  <span className={item.covered ? "text-foreground" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* timeline */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Línea de tiempo de los agentes
          </h2>
          <ol className="mt-5 space-y-0">
            {caseData.timeline.map((event, i) => (
              <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {i < caseData.timeline.length - 1 && (
                  <span className="absolute left-[7px] top-4 h-full w-0.5 bg-border" />
                )}
                <span className="relative mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />
                </span>
                <div className="-mt-0.5">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="text-sm font-medium text-foreground">
                      {event.agent}
                    </p>
                    <time className="font-mono text-xs text-muted-foreground">
                      {event.timestamp}
                    </time>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {event.action}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* sidebar */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Score de pertinencia
          </p>
          <div className="mt-5 flex justify-center">
            <ScoreGauge score={caseData.pertinenceScore} />
          </div>
          <div className="mt-5 flex justify-center">
            <StatusBadge status={caseData.status} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {caseData.pertinenceScore >= 70
              ? "Score superior a 70: la solicitud cumple los criterios de aprobación automática."
              : "Score inferior a 70: la solicitud requiere la decisión de un auditor médico."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Etapa del flujo
          </p>
          <div className="mt-5">
            <StageTimeline stage={caseData.stage} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Decisión del auditor
          </p>
          <CaseDetailActions caseData={caseData} />
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[0.95rem] font-medium text-foreground">{value}</p>
    </div>
  )
}
