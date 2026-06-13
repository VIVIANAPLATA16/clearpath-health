"use client"

import { useEffect, useState } from "react"
import {
  ScanSearch,
  ShieldCheck,
  Sparkles,
  FileText,
  Cpu,
} from "lucide-react"
import { AGENTS, type AgentStatus } from "@/lib/data"
import { cn } from "@/lib/utils"

const ICONS = [ScanSearch, ShieldCheck, Sparkles, FileText]

const STATUS_CYCLE: AgentStatus[] = ["Libre", "Procesando", "Completado"]

function statusStyles(status: AgentStatus) {
  switch (status) {
    case "Procesando":
      return {
        chip: "bg-accent/12 text-accent",
        dot: "bg-accent",
        ring: "cp-pulse-ring bg-accent text-accent-foreground",
      }
    case "Completado":
      return {
        chip: "bg-success/12 text-success",
        dot: "bg-success",
        ring: "bg-success text-success-foreground",
      }
    default:
      return {
        chip: "bg-secondary text-muted-foreground",
        dot: "bg-muted-foreground",
        ring: "bg-secondary text-muted-foreground",
      }
  }
}

export function AgentsPanel() {
  const [agents, setAgents] = useState(
    AGENTS.map((a) => ({ ...a, statusState: a.status as AgentStatus, count: a.processedToday })),
  )

  // Simulate live orchestration: rotate statuses and increment counters
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((a) => {
          const roll = Math.random()
          let next = a.statusState
          if (roll > 0.6) {
            const idx = STATUS_CYCLE.indexOf(a.statusState)
            next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
          }
          const increment = a.statusState === "Completado" ? 1 : 0
          return { ...a, statusState: next, count: a.count + increment }
        }),
      )
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const processingCount = agents.filter((a) => a.statusState === "Procesando").length
  const totalToday = agents.reduce((sum, a) => sum + a.count, 0)

  return (
    <div className="space-y-8">
      {/* control bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Cpu className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-foreground">UiPath Maestro</p>
            <p className="text-sm text-muted-foreground">
              Orquestación de agentes en vivo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {processingCount}
            </p>
            <p className="text-xs text-muted-foreground">Agentes activos</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-2xl font-semibold tabular-nums text-accent">
              {totalToday.toLocaleString("es-CO")}
            </p>
            <p className="text-xs text-muted-foreground">Casos procesados hoy</p>
          </div>
        </div>
      </div>

      {/* agent cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {agents.map((agent, i) => {
          const Icon = ICONS[i]
          const styles = statusStyles(agent.statusState)
          return (
            <div
              key={agent.id}
              className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                      styles.ring,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{agent.name}</p>
                    <p className="text-xs font-medium text-accent">
                      {agent.engine}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                    styles.chip,
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      styles.dot,
                      agent.statusState === "Procesando" && "animate-pulse",
                    )}
                  />
                  {agent.statusState}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {agent.statusState === "Procesando" ? agent.detail : agent.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">
                  Casos procesados hoy
                </span>
                <span className="text-lg font-semibold tabular-nums text-foreground">
                  {agent.count.toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
