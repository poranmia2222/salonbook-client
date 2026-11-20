import { CalendarDays, CheckCircle2, CircleX, Clock3 } from "lucide-react"
import type { Appointment } from "@/lib/types/service"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AdminAppointmentSummary({
  appointments,
}: {
  appointments: Appointment[]
}) {
  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length
  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length
  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length

  const summary = [
    {
      label: "All requests",
      value: appointments.length,
      icon: CalendarDays,
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock3,
      tone: "text-amber-700 bg-amber-500/10 dark:text-amber-300",
    },
    {
      label: "Confirmed",
      value: confirmedCount,
      icon: CheckCircle2,
      tone: "text-emerald-700 bg-emerald-500/10 dark:text-emerald-300",
    },
    {
      label: "Cancelled",
      value: cancelledCount,
      icon: CircleX,
      tone: "text-destructive bg-destructive/10",
    },
  ]

  return (
    <section
      aria-label="Appointment request summary"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {summary.map(({ label, value, icon: Icon, tone }) => (
        <Card key={label} className="border-border bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
