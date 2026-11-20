import Link from "next/link"
import { ArrowRight, CalendarDays, Clock3, Sparkles } from "lucide-react"
import type { Appointment } from "@/lib/types/service"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]
type ListMode = "upcoming" | "recent"

const statusVariants: Record<Appointment["status"], BadgeVariant> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "destructive",
}

function formatDate(value?: string) {
  if (!value) {
    return "Date not recorded"
  }

  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T12:00:00`
    : value
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return "Date not recorded"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function formatTime(value: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value)
  if (!match) {
    return value
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2000, 0, 1, Number(match[1]), Number(match[2])))
}

function AppointmentRow({
  appointment,
  mode,
}: {
  appointment: Appointment
  mode: ListMode
}) {
  const dateLabel =
    mode === "upcoming"
      ? `${formatDate(appointment.date)} · ${formatTime(appointment.time)}`
      : `Requested ${formatDate(appointment.createdAt)}`

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/20 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {mode === "upcoming" ? (
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {appointment.serviceName}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {appointment.category}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            {mode === "upcoming" && (
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {dateLabel}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Badge variant={statusVariants[appointment.status]}>
          {appointment.status}
        </Badge>
        {mode === "upcoming" && (
          <span className="text-sm font-semibold text-foreground">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(appointment.totalPrice)}
          </span>
        )}
      </div>
    </li>
  )
}

function AppointmentList({
  appointments,
  mode,
}: {
  appointments: Appointment[]
  mode: ListMode
}) {
  const isUpcoming = mode === "upcoming"
  const title = isUpcoming ? "Upcoming visits" : "Recent requests"
  const description = isUpcoming
    ? "Your next confirmed appointments."
    : "A quick look at your latest booking activity."

  return (
    <Card className="border-border bg-background">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Link
          href="/dashboard/customer/my-appointments"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <ul className="space-y-3">
            {appointments.map((appointment, index) => (
              <AppointmentRow
                key={
                  appointment._id ??
                  `${appointment.serviceId}-${appointment.date}-${index}`
                }
                appointment={appointment}
                mode={mode}
              />
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-secondary/20 px-5 py-8 text-center">
            <p className="text-sm font-medium text-foreground">
              {isUpcoming ? "No upcoming visits" : "No requests yet"}
            </p>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
              {isUpcoming
                ? "Confirmed appointments will appear here."
                : "Your appointment requests will show here after you book."}
            </p>
            <Button
              href="/services"
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Browse services
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function UpcomingAppointments({
  appointments,
}: {
  appointments: Appointment[]
}) {
  return <AppointmentList appointments={appointments} mode="upcoming" />
}

export function RecentAppointmentRequests({
  appointments,
}: {
  appointments: Appointment[]
}) {
  return <AppointmentList appointments={appointments} mode="recent" />
}
