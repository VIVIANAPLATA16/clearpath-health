import { PageShell, PageHeader } from "@/components/page-shell"
import { DashboardView } from "@/components/dashboard-view"

export default function DashboardPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12">
        <PageHeader
          eyebrow="Panel de control"
          title="Casos de autorización activos"
          description="Monitoree en tiempo real cada solicitud médica mientras los agentes de IA la procesan, de la recepción a la decisión final."
        />
        <div className="mt-10">
          <DashboardView />
        </div>
      </div>
    </PageShell>
  )
}
