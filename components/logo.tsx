import Link from "next/link"
import { Activity } from "lucide-react"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Activity className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        ClearPath <span className="text-muted-foreground font-normal">Health</span>
      </span>
    </Link>
  )
}
