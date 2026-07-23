import { CASES } from "@/lib/data"
import { CaseDetailClient } from "@/components/case-detail-client"

/**
 * Pre-genera rutas estáticas para los casos de demo.
 * dynamicParams=true permite que IDs nuevos (UPM-*) también
 * lleguen a esta página en runtime; el client component los
 * resuelve desde localStorage vía case-store.
 */
export const dynamicParams = true

export function generateStaticParams() {
  return CASES.map((c) => ({ id: c.id }))
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CaseDetailClient id={id} />
}
