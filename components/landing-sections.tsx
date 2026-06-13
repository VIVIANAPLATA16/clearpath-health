import Link from "next/link"
import { ArrowRight, FileText, ShieldCheck, ScanSearch, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "@/components/animated-counter"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 text-center lg:px-8 lg:pt-24">
        <div className="cp-fade-up mx-auto flex max-w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
          <span className="flex h-2 w-2 items-center justify-center">
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-accent/60" />
            <span className="h-2 w-2 rounded-full bg-accent" />
          </span>
          Construido sobre UiPath Maestro
        </div>

        <h1 className="cp-fade-up mx-auto mt-8 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl" style={{ animationDelay: "60ms" }}>
          700 tutelas de salud al día en Colombia.{" "}
          <span className="text-accent">ClearPath Health</span> procesa
          autorizaciones médicas en segundos.
        </h1>

        <p className="cp-fade-up mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "120ms" }}>
          Agentes de inteligencia artificial que leen, verifican, analizan y
          resuelven solicitudes médicas automáticamente para las EPS de América
          Latina.
        </p>

        <div className="cp-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "180ms" }}>
          <Button
            render={<Link href="/nueva" />}
            nativeButton={false}
            size="lg"
            className="group h-12 rounded-full bg-accent px-7 text-base text-accent-foreground shadow-sm transition-all hover:bg-accent/90 hover:shadow-md"
          >
            Procesar Autorización
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button
            render={<Link href="/dashboard" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="h-12 rounded-full px-7 text-base"
          >
            Ver panel de casos
          </Button>
        </div>

        {/* Live counter card */}
        <div className="cp-scale-in mx-auto mt-16 max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-sm" style={{ animationDelay: "240ms" }}>
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            Autorizaciones procesadas hoy
          </p>
          <p className="mt-3 text-6xl font-semibold tracking-tight text-accent sm:text-7xl">
            <AnimatedCounter target={4327} />
          </p>
          <div className="mt-5 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              90% automáticas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-warning" />
              10% a revisión
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

const STATS = [
  {
    value: "700",
    label: "tutelas diarias reducidas",
    description:
      "Disminuimos la principal causa de tutelas en salud al resolver autorizaciones antes de que se conviertan en barreras de acceso.",
    icon: ShieldCheck,
  },
  {
    value: "Segundos",
    label: "no días de espera",
    description:
      "Lo que antes tardaba semanas entre auditores y comités, hoy se resuelve en tiempo real con orquestación de agentes.",
    icon: Sparkles,
  },
  {
    value: "90%",
    label: "de aprobación automática",
    description:
      "Nueve de cada diez solicitudes pertinentes se aprueban sin intervención humana, liberando a los auditores para los casos complejos.",
    icon: ScanSearch,
  },
]

export function ImpactStats() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="grid gap-5 md:grid-cols-3">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {stat.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const STEPS = [
  {
    n: "01",
    title: "Lectura inteligente",
    agent: "Agente Extractor · UiPath IDP",
    description:
      "El agente lee la solicitud médica y extrae datos del paciente, diagnóstico CIE-10, procedimiento y profesional tratante.",
    icon: ScanSearch,
  },
  {
    n: "02",
    title: "Verificación de cobertura",
    agent: "Agente Validador · UiPath Maestro",
    description:
      "Valida en segundos si el servicio está incluido en el plan de beneficios de la EPS y si cumple los requisitos normativos.",
    icon: ShieldCheck,
  },
  {
    n: "03",
    title: "Análisis de pertinencia",
    agent: "Analista Clínico · Gemini 2.5 Flash",
    description:
      "Evalúa la pertinencia clínica frente a las guías de práctica y calcula un score de aprobación de 0 a 100.",
    icon: Sparkles,
  },
  {
    n: "04",
    title: "Generación del documento",
    agent: "Generador de Respuestas · Claude Code",
    description:
      "Crea automáticamente el documento oficial de autorización en PDF, listo para notificar al paciente y al prestador.",
    icon: FileText,
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Orquestación de agentes
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Cuatro agentes de IA, una decisión en segundos
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            UiPath Maestro orquesta el flujo completo de cada autorización, de la
            recepción a la decisión final.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.n}
                className="relative rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/12 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-2xl font-semibold tabular-nums text-border">
                    {step.n}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-accent">
                  {step.agent}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-3.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-border lg:block" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function LandingCTA() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          El acceso a la salud no debería depender de una tutela
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/70">
          Procese su primera autorización médica y vea a los agentes resolverla
          en tiempo real.
        </p>
        <Button
          render={<Link href="/nueva" />}
          nativeButton={false}
          size="lg"
          className="mt-8 h-12 rounded-full bg-accent px-7 text-base text-accent-foreground hover:bg-accent/90"
        >
          Procesar Autorización
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
