import { CalendarDays, Clock3, Scissors } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Appointment } from "@/lib/types/service"

function formatAppointmentDate(value: string) {
  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T12:00:00`
    : value
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return "Date not recorded"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function formatAppointmentTime(value: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value)
  if (!match) {
    return value || "Time not recorded"
  }

  const date = new Date(2000, 0, 1, Number(match[1]), Number(match[2]))
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatPaidAmount(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100)
}

export function AppointmentReceiptCard({
  appointment,
  amountPaidInCents,
}: {
  appointment: Appointment
  amountPaidInCents: number
}) {
  return (
    <Card className="border-border bg-background shadow-md shadow-black/5">
      <CardHeader className="border-b border-border pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Appointment summary</CardTitle>
            <CardDescription>Keep these details handy for your visit.</CardDescription>
          </div>
          <Badge variant="success">Paid</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Scissors className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">
              {appointment.serviceName}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {appointment.category}
            </p>
          </div>
        </div>

        <dl className="grid gap-5 rounded-xl bg-secondary/40 p-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <CalendarDays
              className="mt-0.5 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Appointment date
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {formatAppointmentDate(appointment.date)}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock3
              className="mt-0.5 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <dt className="text-xs font-medium text-muted-foreground">
                Appointment time
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {formatAppointmentTime(appointment.time)}
              </dd>
            </div>
          </div>
        </dl>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="font-semibold text-foreground">Total paid</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Securely processed by Stripe
            </p>
          </div>
          <p className="text-xl font-bold tracking-tight text-foreground">
            {formatPaidAmount(amountPaidInCents)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
