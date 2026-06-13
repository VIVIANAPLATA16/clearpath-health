import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-sm space-y-3">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Plataforma de agentes de IA que automatiza las autorizaciones de
              servicios médicos para aseguradoras de salud en América Latina.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Orquestado por</p>
            <p className="mt-1 leading-relaxed">
              Powered by UiPath Maestro · Gemini 2.5 Flash · UiPath IDP · Claude
              Code
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} ClearPath Health. Todos los derechos reservados.</p>
          <p>Hecho para el sistema de salud colombiano.</p>
        </div>
      </div>
    </footer>
  )
}
