import { CalendarDays } from "lucide-react"
import type { Appointment } from "@/lib/types/service"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const statusVariants = {
  pending: "warning",
  confirmed: "success",
  cancelled: "destructive",
} as const

function formatDate(value?: string) {
  if (!value) return "No date"
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value)
  if (Number.isNaN(date.getTime())) return "No date"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

export function AdminRecentAppointments({
  appointments,
}: {
  appointments: Appointment[]
}) {
  const recentAppointments = [...appointments]
    .sort((first, second) =>
      String(second.createdAt || "").localeCompare(String(first.createdAt || ""))
    )
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent appointments</CardTitle>
        <CardDescription>Latest customer booking requests</CardDescription>
      </CardHeader>
      <CardContent>
        {recentAppointments.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
            <CalendarDays className="mb-3 h-6 w-6 text-muted-foreground" />
            <p className="font-medium text-foreground">No appointments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New requests will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {appointment.userName || "Unknown customer"}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {appointment.serviceName || "Service"} ·{" "}
                    {formatDate(appointment.date)}
                  </p>
                </div>
                <Badge variant={statusVariants[appointment.status]}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
