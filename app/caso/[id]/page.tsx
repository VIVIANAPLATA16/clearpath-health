import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PageShell } from "@/components/page-shell"
import { CaseDetailContent } from "@/components/case-detail"
import { CASES } from "@/lib/data"

export function generateStaticParams() {
  return CASES.map((c) => ({ id: c.id }))
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const caseData = CASES.find((c) => c.id === id)

  if (!caseData) notFound()

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
