import { cn } from "@/lib/utils"

export function ScoreGauge({
  score,
  size = 160,
  className,
}: {
  score: number
  size?: number
  className?: string
}) {
  const stroke = size * 0.085
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const high = score >= 70
  const color = high ? "var(--success)" : "var(--warning)"

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-semibold tabular-nums tracking-tight"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  )
}
