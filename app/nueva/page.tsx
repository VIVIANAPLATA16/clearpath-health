import { PageShell, PageHeader } from "@/components/page-shell"
import { AuthorizationFlow } from "@/components/authorization-flow"

export default function NuevaPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8 lg:py-12">
        <PageHeader
          eyebrow="Nueva solicitud"
          title="Procesar autorización médica"
          description="El personal de la clínica ingresa los datos de la solicitud y los agentes de IA resuelven la autorización en tiempo real."
        />
        <div className="mt-10">
          <AuthorizationFlow />
        </div>
      </div>
    </PageShell>
  )
}
