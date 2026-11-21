'use client'
import { CalendarDays, CreditCard, Eye, Scissors, X } from "lucide-react"
import type { Appointment } from "@/lib/types/service"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { VariantProps } from "class-variance-authority"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { deleteAppointment } from "@/lib/action/appointment"
import { useRouter } from "next/navigation"
type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

const appointmentStatusVariants: Record<Appointment["status"], BadgeVariant> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "destructive",
}

function formatDate(value?: string) {
  if (!value) {
    return "Not recorded"
  }

  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T12:00:00`
    : value
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return "Not recorded"
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

  const date = new Date(2000, 0, 1, Number(match[1]), Number(match[2]))
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function ServiceIdentity({ appointment }: { appointment: Appointment }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {appointment.image ? (
        <img
          src={appointment.image}
          alt=""
          className="h-12 w-12 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Scissors className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <span className="line-clamp-2 font-medium text-foreground">
        {appointment.serviceName}
      </span>
    </div>
  )
}

function AppointmentStatusBadge({
  status,
}: {
  status: Appointment["status"]
}) {
  return <Badge variant={appointmentStatusVariants[status]}>{status}</Badge>
}

function PaymentStatusBadge({ payment }: { payment: Appointment["payment"] }) {
  if (!payment) {
    return <Badge variant="outline">Not recorded</Badge>
  }

  return (
    <Badge variant={payment === "paid" ? "success" : "warning"}>
      {payment}
    </Badge>
  )
}

function AppointmentDetails({ appointment }: { appointment: Appointment }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Category</dt>
        <dd className="mt-1 text-sm text-foreground">{appointment.category}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Price</dt>
        <dd className="mt-1 text-sm font-semibold text-foreground">
          {formatPrice(appointment.totalPrice)}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">
          Appointment date
        </dt>
        <dd className="mt-1 text-sm text-foreground">
          {formatDate(appointment.date)}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">
          Appointment time
        </dt>
        <dd className="mt-1 text-sm text-foreground">
          {formatTime(appointment.time)}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">
          Payment status
        </dt>
        <dd className="mt-1">
          <PaymentStatusBadge payment={appointment.payment} />
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">
          Request date
        </dt>
        <dd className="mt-1 text-sm text-foreground">
          {formatDate(appointment.createdAt)}
        </dd>
      </div>
    </dl>
  )
}

function EmptyAppointments() {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CalendarDays className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        No appointments yet
      </h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        Your appointment requests will appear here after you book a service.
      </p>
    </div>
  )
}

function AppointmentActions({
  id,
  status,
  payment,
  serviceId,
}: {
  id: string,
  status: Appointment["status"]
  payment: Appointment["payment"]
  serviceId?: string
}) {

  const canPayNow = status === "confirmed" && payment === "unpaid"
  const canCancel =
    (status === "cancelled" || status === "pending") && payment === "unpaid"
  const router = useRouter()
  const handleCancleAppointment = async () => {
    const cancelAppointment = await deleteAppointment(id)
    console.log(cancelAppointment)

    router.refresh()
  }
  return (
    <div className="flex items-center justify-end gap-2">
      {serviceId ? (
        <Link
          href={`/services/${encodeURIComponent(serviceId)}`}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "h-9 shrink-0 gap-1.5 px-3",
          })}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          Details
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="h-9 shrink-0 gap-1.5 px-3"
          disabled
          title="Service details are not available"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          Details
        </Button>
      )}

      {canPayNow &&
        (id ? (
          <Link
            href={`/checkout?appointmentId=${encodeURIComponent(id)}`}
            className={buttonVariants({
              size: "sm",
              className: "h-9 shrink-0 gap-1.5 px-3 shadow-sm shadow-primary/20",
            })}
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Pay now
          </Link>
        ) : (
          <Button
            size="sm"
            disabled
            title="Appointment details are not available"
            className="h-9 shrink-0 gap-1.5 px-3"
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Pay now
          </Button>
        ))}

      {canCancel && (
        <Button
          onClick={handleCancleAppointment}
          variant="outline"
          size="sm"
          className="h-9 shrink-0 gap-1.5 border-destructive/30 bg-destructive/5 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Cancel
        </Button>
      )}
    </div>
  )
}

export function AppointmentTable({
  appointments,
}: {
  appointments: Appointment[]
}) {

  return (
    <Card className="overflow-hidden border-border bg-background">
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
        <div className="space-y-1">
          <CardTitle className="text-lg">Appointment requests</CardTitle>
          <CardDescription>
            Your requested services, visit details, and payment information.
          </CardDescription>
        </div>
        <Badge variant="secondary">
          {appointments.length}{" "}
          {appointments.length === 1 ? "request" : "requests"}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        {appointments.length === 0 ? (
          <EmptyAppointments />
        ) : (
          <>
            <div className="hidden md:block">
              <Table className="min-w-[1050px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Appointment date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Appointment status</TableHead>
                    <TableHead>Payment status</TableHead>
                    <TableHead>Request date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment, index) => (
                    <TableRow
                      key={
                        appointment._id ??
                        `${appointment.date}-${appointment.time}-${index}`
                      }
                    >
                      <TableCell>
                        <ServiceIdentity appointment={appointment} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {appointment.category}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(appointment.date)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatTime(appointment.time)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        {formatPrice(appointment.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <AppointmentStatusBadge status={appointment.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge payment={appointment.payment} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(appointment.createdAt)}
                      </TableCell>
                      <TableCell className="min-w-[290px]">
                        <AppointmentActions
                          id={appointment._id ?? ""}
                          status={appointment.status}
                          payment={appointment.payment}
                          serviceId={appointment.serviceId}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {appointments.map((appointment, index) => (
                <article
                  key={
                    appointment._id ??
                    `${appointment.date}-${appointment.time}-${index}`
                  }
                  className="space-y-4 rounded-xl border border-border bg-secondary/20 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <ServiceIdentity appointment={appointment} />
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                  <AppointmentDetails appointment={appointment} />
                  <AppointmentActions
                    id={appointment._id ?? ""}
                    status={appointment.status}
                    payment={appointment.payment}
                    serviceId={appointment.serviceId}
                  />
                </article>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function AppointmentTableSkeleton() {
  return (
    <Card className="overflow-hidden border-border bg-background">
      <CardHeader className="space-y-3 border-b border-border px-5 py-5 sm:px-6">
        <div className="h-5 w-44 animate-pulse rounded bg-secondary" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-secondary" />
      </CardHeader>
      <CardContent className="space-y-3 p-5">
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            className="h-16 animate-pulse rounded-lg bg-secondary/60"
          />
        ))}
      </CardContent>
    </Card>
  )
}
