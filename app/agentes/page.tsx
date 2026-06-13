import { PageShell, PageHeader } from "@/components/page-shell"
import { AgentsPanel } from "@/components/agents-panel"

export default function AgentesPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-12">
        <PageHeader
          eyebrow="Estado de agentes"
          title="Panel de orquestación de agentes"
          description="Visualice en tiempo real el estado de los cuatro agentes de IA que componen el flujo de autorización, controlados por UiPath Maestro."
        />
        <div className="mt-10">
          <AgentsPanel />
        </div>
      </div>
    </PageShell>
  )
}
