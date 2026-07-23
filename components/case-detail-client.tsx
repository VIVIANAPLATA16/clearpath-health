"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, SearchX } from "lucide-react"
import { PageShell } from "@/components/page-shell"
import { CaseDetailContent } from "@/components/case-detail"
import { CASES, type AuthCase } from "@/lib/data"
import { findCaseById } from "@/lib/case-store"

/**
 * Resuelve casos de dos fuentes:
 * 1. CASES estáticos (demo) — disponibles en SSR e hidratación (sin flash)
 * 2. localStorage vía case-store — casos UPM-* creados en /nueva
 *
 * localStorage solo existe en el cliente; por eso la resolución de casos
 * dinámicos ocurre tras el montaje.
 */
export function CaseDetailClient({ id }: { id: string }) {
  const staticCase = CASES.find((c) => c.id === id)
  const [caseData, setCaseData] = useState<AuthCase | undefined>(() => staticCase)
  const [resolved, setResolved] = useState(() => Boolean(staticCase))

  useEffect(() => {
    if (staticCase) {
      setCaseData(staticCase)
      setResolved(true)
      return
    }
    setCaseData(findCaseById(id))
    setResolved(true)
  }, [id, staticCase])

  if (!caseData && resolved) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-5 py-20 text-center lg:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <SearchX className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            No encontramos este caso
          </h1>
          <p className="mt-2 text-muted-foreground">
            El caso <span className="font-mono">{id}</span> no existe en la cola
            local de este navegador ni en los casos de demostración. Si lo
            procesaste en otro dispositivo o navegador, no estará disponible
            aquí: la cola local vive únicamente en este equipo hasta que se
            sincronice con UiPath Orchestrator.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel de casos
          </Link>
        </div>
      </PageShell>
    )
  }

  if (!caseData) {
    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
          <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
          <div className="mt-4 h-10 w-72 animate-pulse rounded-xl bg-secondary" />
          <div className="mt-10 h-64 animate-pulse rounded-3xl bg-secondary" />
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel de casos
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-accent">{caseData.id}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {caseData.patientName}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {caseData.service} · {caseData.eps}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <CaseDetailContent caseData={caseData} />
        </div>
      </div>
    </PageShell>
  )
}
