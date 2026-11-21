import type { LucideIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface OverviewStatCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  tone: string
}

export function OverviewStatCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
}: OverviewStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
