"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Check,
  Clock,
  Loader2,
  Workflow,
  Bell,
  Building2,
  UserCheck,
  Server,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type OrchestrationPanelProps = {
  caseId: string
  approved: boolean
  eps: string
  uipathSynced: boolean
  pdfReady: boolean
  dashboardHref: string
}

type StepStatus = "complete" | "active" | "pending"

type WorkflowStep = {
  id: string
  label: string
  status: StepStatus
  detail?: string
}

export function OrchestrationPanel({
  caseId,
  approved,
  eps,
  uipathSynced,
  pdfReady,
  dashboardHref,
}: OrchestrationPanelProps) {
  const [visibleSteps, setVisibleSteps] = useState(0)

  const steps: WorkflowStep[] = useMemo(
    () => [
      {
        id: "received",
        label: "Solicitud recibida",
        status: "complete",
        detail: "Datos clínicos capturados por UiPath IDP",
      },
      {
        id: "analysis",
        label: "Análisis IA completado",
        status: "complete",
        detail: "Gemini 2.5 Flash + agentes de pertinencia clínica",
      },
      {
        id: "decision",
        label: "Decisión clínica generada",
        status: "complete",
        detail: approved ? "AUTO_APROBADO" : "REVISION_HUMANA",
      },
      {
        id: "pdf",
        label: "PDF de autorización",
        status: approved ? (pdfReady ? "complete" : "active") : "pending",
        detail: approved
          ? pdfReady
            ? "Documento generado y listo para despacho"
            : "Disponible para descarga"
          : "Se generará tras dictamen del auditor",
      },
      {
        id: "orchestrator",
        label: "Despachado a UiPath Orchestrator",
        status: uipathSynced ? "complete" : "active",
        detail: uipathSynced
          ? "Queue ClearPathAuthorizations · UiPath Maestro"
          : "Modo Respaldo Local · sincronización pendiente",
      },
      {
        id: "final",
        label: approved
          ? "Pendiente de confirmación EPS"
          : "Pendiente de auditoría médica / aseguradora",
        status: "active",
        detail: approved
          ? `Autorización en cola de despacho hacia ${eps}`
          : `Tarea creada en Action Center · ${eps}`,
      },
    ],
    [approved, eps, uipathSynced, pdfReady],
  )

  useEffect(() => {
    setVisibleSteps(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleSteps(i + 1), 180 * (i + 1)))
    })
    return () => timers.forEach(clearTimeout)
  }, [caseId, steps])

  return (
    <div className="space-y-5">
      {/* Orchestration header */}
      <div className="rounded-2xl border border-accent/25 bg-accent/5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Workflow className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Orquestación UiPath Maestro
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Caso <span className="font-mono text-foreground">{caseId}</span>{" "}
                en flujo activo de autorización
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-background px-3 py-1 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Workflow en ejecución
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Trazabilidad del caso
        </p>
        <ol className="space-y-0">
          {steps.map((step, index) => {
            const visible = index < visibleSteps
            const isLast = index === steps.length - 1
            return (
              <li
                key={step.id}
                className={cn(
                  "relative flex gap-4 pb-6 transition-all duration-500",
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                  isLast && "pb-0",
                )}
              >
                {!isLast && (
                  <span
                    className={cn(
                      "absolute left-[15px] top-8 h-[calc(100%-16px)] w-0.5",
                      step.status === "complete" ? "bg-success" : "bg-border",
                    )}
                  />
                )}
                <StepIcon status={step.status} />
                <div className="min-w-0 flex-1 pt-0.5">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.status === "pending"
                        ? "text-muted-foreground"
                        : "text-foreground",
                    )}
                  >
                    {step.label}
                    {step.status === "complete" && (
                      <Check className="ml-1.5 inline h-3.5 w-3.5 text-success" />
                    )}
                  </p>
                  {step.detail && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Routing cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <RoutingCard
          icon={approved ? Building2 : UserCheck}
          title={approved ? "Cola de despacho EPS" : "Action Center — Auditor médico"}
          description={
            approved
              ? `La autorización será notificada a ${eps} para activación del servicio autorizado.`
              : `El caso fue escalado al auditor de ${eps} para dictamen clínico y validación de soportes.`
          }
          status={approved ? "En cola de despacho" : "Pendiente de auditoría"}
          tone={approved ? "success" : "warning"}
        />
        <RoutingCard
          icon={Server}
          title="UiPath Orchestrator"
          description={
            uipathSynced
              ? "QueueItem registrado en ClearPathAuthorizations. Trazabilidad auditable en Orchestrator."
              : "Caso almacenado en cola local. Se sincronizará automáticamente con Orchestrator al restablecer conexión."
          }
          status={uipathSynced ? "Sincronizado" : "Modo Respaldo Local"}
          tone={uipathSynced ? "success" : "muted"}
        />
      </div>

      {/* Notifications + CTA */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/40 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {approved
                ? "Notificación generada para la EPS"
                : "Alerta enviada al equipo de auditoría"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              El caso ya es visible en el panel de control con estado actualizado en tiempo real.
            </p>
          </div>
        </div>
        <Button
          render={<Link href={dashboardHref} />}
          nativeButton={false}
          variant="outline"
          className="shrink-0 rounded-full"
        >
          Ver caso en el panel
        </Button>
      </div>
    </div>
  )
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "complete") {
    return (
      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    )
  }
  if (status === "active") {
    return (
      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground cp-pulse-ring">
        <Clock className="h-4 w-4" />
      </span>
    )
  }
  return (
    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
      <Loader2 className="h-4 w-4 opacity-40" />
    </span>
  )
}

function RoutingCard({
  icon: Icon,
  title,
  description,
  status,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  status: string
  tone: "success" | "warning" | "muted"
}) {
  const toneStyles = {
    success: "border-success/25 bg-success/5 text-success",
    warning: "border-warning/25 bg-warning/5 text-warning",
    muted: "border-border bg-background text-muted-foreground",
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          <span
            className={cn(
              "mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold",
              toneStyles[tone],
            )}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  )
}
