"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Search, Clock, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react"
import { CASES, relativeTime, type AuthCase, type CaseStatus } from "@/lib/data"
import { getAllCases } from "@/lib/case-store"
import { StatusBadge, ScorePill, StageTimeline } from "@/components/case-ui"
import { cn } from "@/lib/utils"

type FilterKey = "TODOS" | "AUTO_APROBADO" | "REVISION_HUMANA"

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "TODOS", label: "Todos" },
  { key: "AUTO_APROBADO", label: "Auto-aprobados" },
  { key: "REVISION_HUMANA", label: "Revisión humana" },
]

export function DashboardView() {
  const [now, setNow] = useState(() => Date.now())
  const [filter, setFilter] = useState<FilterKey>("TODOS")
  const [query, setQuery] = useState("")
  const [cases, setCases] = useState<AuthCase[]>(CASES)

  useEffect(() => {
    setCases(getAllCases())
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const stats = useMemo(() => {
    const total = cases.length
    const approved = cases.filter((c) => c.status === "AUTO_APROBADO").length
    const review = cases.filter((c) => c.status === "REVISION_HUMANA").length
    const avg = total
      ? Math.round(cases.reduce((a, c) => a + c.pertinenceScore, 0) / total)
      : 0
    return { total, approved, review, avg }
  }, [cases])

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchesFilter =
        filter === "TODOS" || (c.status as CaseStatus) === filter
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        c.patientName.toLowerCase().includes(q) ||
        c.service.toLowerCase().includes(q) ||
        c.eps.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [cases, filter, query])

  const summaryCards = [
    { label: "Casos activos hoy", value: stats.total, icon: Clock, tint: "text-foreground", bg: "bg-secondary" },
    { label: "Auto-aprobados", value: stats.approved, icon: CheckCircle2, tint: "text-success", bg: "bg-success/12" },
    { label: "En revisión humana", value: stats.review, icon: AlertTriangle, tint: "text-warning", bg: "bg-warning/14" },
    { label: "Score promedio", value: stats.avg, icon: TrendingUp, tint: "text-accent", bg: "bg-accent/12" },
  ]

  return (
    <div className="space-y-8">
      {/* summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </span>
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", card.bg, card.tint)}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {card.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar paciente, servicio, EPS o ID..."
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* table - desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 font-medium">Paciente</th>
              <th className="px-5 py-3.5 font-medium">Servicio solicitado</th>
              <th className="px-5 py-3.5 font-medium">Médico · EPS</th>
              <th className="px-5 py-3.5 font-medium">Score</th>
              <th className="px-5 py-3.5 font-medium">Etapa del flujo</th>
              <th className="px-5 py-3.5 font-medium">Estado</th>
              <th className="px-5 py-3.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => (
              <tr key={c.id} className="group transition-colors hover:bg-secondary/40">
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground">{c.patientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.patientAge} años · {c.patientDocument}
                  </p>
                </td>
                <td className="px-5 py-4 max-w-56">
                  <p className="font-medium text-foreground">{c.service}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.serviceType} · CIE-10 {c.cie10}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-foreground">{c.doctor}</p>
                  <p className="text-xs text-muted-foreground">{c.eps}</p>
                </td>
                <td className="px-5 py-4">
                  <ScorePill score={c.pertinenceScore} />
                </td>
                <td className="px-5 py-4 w-72">
                  <StageTimeline stage={c.stage} />
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={c.status} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {relativeTime(c.receivedAt, now)}
                  </p>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/caso/${c.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Ver
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">
            No se encontraron casos con los filtros aplicados.
          </p>
        )}
      </div>

      {/* cards - mobile */}
      <div className="space-y-4 lg:hidden">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/caso/${c.id}`}
            className="block rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{c.patientName}</p>
                <p className="text-xs text-muted-foreground">
                  {c.patientAge} años · {c.eps}
                </p>
              </div>
              <ScorePill score={c.pertinenceScore} />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">{c.service}</p>
            <p className="text-xs text-muted-foreground">
              {c.serviceType} · CIE-10 {c.cie10}
            </p>
            <div className="mt-4">
              <StageTimeline stage={c.stage} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <StatusBadge status={c.status} />
              <span className="text-xs text-muted-foreground">
                {relativeTime(c.receivedAt, now)}
              </span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
            No se encontraron casos con los filtros aplicados.
          </p>
        )}
      </div>
    </div>
  )
}
