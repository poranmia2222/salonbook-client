"use client"

import { Fragment, useState } from "react"
import {
  CalendarDays,
  Check,
  Clock3,
  CreditCard,
  Eye,
  Scissors,
  UserRound,
  X,
} from "lucide-react"
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
import { Button } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { updateAppointment } from "@/lib/action/appointment"
import { useRouter } from "next/navigation"

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

const statusVariants: Record<Appointment["status"], BadgeVariant> = {
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

function formatTime(value?: string) {
  if (!value) {
    return "Not recorded"
  }

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

function AppointmentStatus({ status }: { status: Appointment["status"] }) {
  return <Badge variant={statusVariants[status]}>{status}</Badge>
}

function PaymentStatus({ payment }: { payment: Appointment["payment"] }) {
  return (
    <Badge variant={payment === "paid" ? "success" : "warning"}>{payment}</Badge>
  )
}

function CustomerIdentity({ appointment }: { appointment: Appointment }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <UserRound className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">
          {appointment.userName || "Unknown customer"}
        </p>
        <p className="max-w-[200px] truncate text-xs text-muted-foreground">
          {appointment.userEmail || "No email provided"}
        </p>
      </div>
    </div>
  )
}

function ServiceIdentity({ appointment }: { appointment: Appointment }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {appointment.image ? (
        <img
          src={appointment.image}
          alt=""
          className="h-10 w-10 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Scissors className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <p className="line-clamp-2 font-medium text-foreground">
          {appointment.serviceName || "Service"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {appointment.category || "Uncategorized"}
        </p>
      </div>
    </div>
  )
}

function AppointmentDetails({ appointment }: { appointment: Appointment }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div>
        <dt className="text-xs font-medium text-muted-foreground">
          Customer
        </dt>
        <dd className="mt-1 text-sm text-foreground">
          {appointment.userName || "Unknown customer"}
          <span className="block text-muted-foreground">
            {appointment.userEmail || "No email provided"}
          </span>
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Service</dt>
        <dd className="mt-1 text-sm text-foreground">
          {appointment.serviceName || "Service"}
          <span className="block text-muted-foreground">
            {appointment.category || "Uncategorized"}
          </span>
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">
          Appointment
        </dt>
        <dd className="mt-1 text-sm text-foreground">
          {formatDate(appointment.date)} at {formatTime(appointment.time)}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">Price</dt>
        <dd className="mt-1 text-sm font-semibold text-foreground">
          {formatPrice(appointment.totalPrice)}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">
          Booking request date
        </dt>
        <dd className="mt-1 text-sm text-foreground">
          {formatDate(appointment.createdAt)}
        </dd>
      </div>
      <div>
        <dt className="text-xs font-medium text-muted-foreground">
          Customer message
        </dt>
        <dd className="mt-1 whitespace-pre-wrap text-sm text-foreground">
          {appointment.message?.trim() || "No message provided"}
        </dd>
      </div>
    </dl>
  )
}

function DetailsToggle({
  expanded,
  onClick,
  id,
}: {
  expanded: boolean
  onClick: () => void
  id: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      aria-expanded={expanded}
      aria-controls={id}
      onClick={onClick}
    >
      <Eye className="h-4 w-4" aria-hidden="true" />
      {expanded ? "Hide details" : "View details"}
    </Button>
  )
}

function EmptyAppointments() {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CalendarDays className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-foreground">
        No appointment requests
      </h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        New customer requests will appear here.
      </p>
    </div>
  )
}

export function AdminAppointmentTable({
  appointments,
}: {
  appointments: Appointment[]
}) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const router = useRouter()

  function StatusActions({ id, status }: { id: string, status: Appointment["status"] }) {
    const canConfirm = status === "pending"
    const canCancel = status === "pending"
    const actionHelp =
      "Status changes will be available when the appointment API supports updates."

    const handleCofirm = async () => {
      await updateAppointment(id, "confirmed")
      router.refresh()
    }
    const handleCancel = async () => {
      await updateAppointment(id, "cancelled")
      router.refresh()
    }

    return (
      <div className="flex items-center gap-2">
        {canConfirm && (
          <Button
            onClick={handleCofirm}
            type="button"
            size="sm"
            title={actionHelp}
            className="gap-1.5"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            Confirm
          </Button>
        )}
        {canCancel && (
          <Button
            onClick={handleCancel}
            type="button"
            variant="outline"
            size="sm"
            title={actionHelp}
            className="gap-1.5 border-destructive/30 text-destructive"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </Button>
        )}
      </div>
    )
  }

  function getKey(appointment: Appointment, index: number) {
    return (
      appointment._id ??
      `${appointment.userEmail}-${appointment.date}-${appointment.time}-${index}`
    )
  }

  function toggleDetails(key: string) {
    setExpandedKey((current) => (current === key ? null : key))
  }

  return (
    <Card className="overflow-hidden border-border bg-background">
      <CardHeader className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="space-y-1">
          <CardTitle className="text-lg">All appointment requests</CardTitle>
          <CardDescription>
            Review customer and service details. Confirm and cancel controls are
            disabled until status updates are supported by the API.
          </CardDescription>
        </div>
        <Badge variant="secondary">
          {appointments.length}{" "}
          {appointments.length === 1 ? "appointment" : "appointments"}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        {appointments.length === 0 ? (
          <EmptyAppointments />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <Table className="min-w-[1280px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Request date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment, index) => {
                    const key = getKey(appointment, index)
                    const detailsId = `appointment-details-${index}`
                    const expanded = expandedKey === key

                    return (
                      <Fragment key={key}>
                        <TableRow>
                          <TableCell>
                            <CustomerIdentity appointment={appointment} />
                          </TableCell>
                          <TableCell>
                            <ServiceIdentity appointment={appointment} />
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <p className="font-medium">
                              {formatDate(appointment.date)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(appointment.time)}
                            </p>
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-medium">
                            {formatPrice(appointment.totalPrice)}
                          </TableCell>
                          <TableCell>
                            <AppointmentStatus status={appointment.status} />
                          </TableCell>
                          <TableCell>
                            <PaymentStatus payment={appointment.payment} />
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatDate(appointment.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex min-w-[220px] flex-col items-end gap-2">
                              <DetailsToggle
                                id={detailsId}
                                expanded={expanded}
                                onClick={() => toggleDetails(key)}
                              />
                              <StatusActions id={appointment._id || ''} status={appointment.status} />
                            </div>
                          </TableCell>
                        </TableRow>
                        {expanded && (
                          <TableRow>
                            <TableCell colSpan={9} className="bg-secondary/20">
                              <section
                                id={detailsId}
                                aria-label={`Details for ${appointment.serviceName}`}
                                className="p-2 sm:p-4"
                              >
                                <AppointmentDetails appointment={appointment} />
                              </section>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {appointments.map((appointment, index) => {
                const key = getKey(appointment, index)
                const detailsId = `appointment-details-mobile-${index}`
                const expanded = expandedKey === key

                return (
                  <article
                    key={key}
                    className="space-y-4 rounded-xl border border-border bg-secondary/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <CustomerIdentity appointment={appointment} />
                      <AppointmentStatus status={appointment.status} />
                    </div>
                    <ServiceIdentity appointment={appointment} />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Appointment
                        </p>
                        <p className="mt-1 font-medium">
                          {formatDate(appointment.date)}
                        </p>
                        <p className="text-muted-foreground">
                          {formatTime(appointment.time)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="mt-1 font-medium">
                          {formatPrice(appointment.totalPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
                          Payment
                        </p>
                        <div className="mt-1">
                          <PaymentStatus payment={appointment.payment} />
                        </div>
                      </div>
                      <div>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                          Request date
                        </p>
                        <p className="mt-1">
                          {formatDate(appointment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                      <DetailsToggle
                        id={detailsId}
                        expanded={expanded}
                        onClick={() => toggleDetails(key)}
                      />
                      <StatusActions id={appointment._id || ''} status={appointment.status} />
                    </div>
                    {expanded && (
                      <section
                        id={detailsId}
                        aria-label={`Details for ${appointment.serviceName}`}
                        className="border-t border-border pt-4"
                      >
                        <AppointmentDetails appointment={appointment} />
                      </section>
                    )}
                  </article>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
