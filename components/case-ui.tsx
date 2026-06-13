import { Check } from "lucide-react"
import {
  type CaseStatus,
  type WorkflowStage,
  STAGE_ORDER,
  STAGE_LABELS,
} from "@/lib/data"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: CaseStatus }) {
  if (status === "AUTO_APROBADO") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-xs font-semibold text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Auto-aprobado
      </span>
    )
  }
  if (status === "REVISION_HUMANA") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/14 px-2.5 py-1 text-xs font-semibold text-warning">
        <span className="h-1.5 w-1.5 rounded-full bg-warning" />
        Revisión humana
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
      En proceso
    </span>
  )
}

export function ScorePill({ score }: { score: number }) {
  const high = score >= 70
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-sm font-semibold tabular-nums",
        high ? "bg-success/12 text-success" : "bg-warning/14 text-warning",
      )}
    >
      {score}
      <span className="text-[0.7rem] font-medium opacity-70">/100</span>
    </span>
  )
}

export function StageTimeline({
  stage,
  className,
}: {
  stage: WorkflowStage
  className?: string
}) {
  const currentIndex = STAGE_ORDER.indexOf(stage)
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {STAGE_ORDER.map((s, i) => {
        const done = i < currentIndex || stage === "DECISION"
        const current = i === currentIndex && stage !== "DECISION"
        return (
          <div key={s} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold",
                  done
                    ? "bg-success text-success-foreground"
                    : current
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              {i < STAGE_ORDER.length - 1 && (
                <span
                  className={cn(
                    "h-0.5 flex-1 rounded-full",
                    i < currentIndex ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-[0.6rem] font-medium leading-tight",
                done || current ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {STAGE_LABELS[s]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
