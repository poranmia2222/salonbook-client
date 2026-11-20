import type { LucideIcon } from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

type StatTone = "primary" | "amber" | "emerald" | "blue"

const toneClasses: Record<StatTone, string> = {
  primary: "bg-primary/10 text-primary",
  amber: "bg-amber-500/10 text-amber-300",
  emerald: "bg-emerald-500/10 text-emerald-300",
  blue: "bg-sky-500/10 text-sky-300",
}

interface OverviewStatCardProps {
  label: string
  value: number
  description: string
  icon: LucideIcon
  tone: StatTone
}

export function OverviewStatCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
}: OverviewStatCardProps) {
  return (
    <Card className="border-border bg-background">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  )
}
