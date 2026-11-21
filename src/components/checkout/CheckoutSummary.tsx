import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  Scissors,
  ShieldCheck,
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
import { Button, buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { CheckoutButton } from "@/components/checkout/CheckoutButton"

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

const statusVariants: Record<Appointment["status"], BadgeVariant> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "destructive",
}

function formatPrice(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "Price unavailable"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

function formatDate(value: string) {
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

function formatTime(value: string) {
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

export function CheckoutSummary({
  appointment,
  paymentCancelled,
}: {
  appointment: Appointment
  paymentCancelled: boolean
}) {
  const hasValidPrice =
    Number.isFinite(appointment.totalPrice) && appointment.totalPrice > 0
  const canPay =
    appointment.status === "confirmed" &&
    appointment.payment === "unpaid" &&
    hasValidPrice

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/dashboard/customer/my-appointments"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "-ml-3 gap-2 text-muted-foreground",
        })}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to appointments
      </Link>

      <header className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          <span>Secure checkout</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Review your appointment
          </h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Confirm the appointment and total before continuing to secure
            payment.
          </p>
        </div>
      </header>

      {paymentCancelled && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200"
        >
          Payment was not completed. Your appointment is still unpaid.
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[1.3fr_0.8fr]">
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle className="text-lg">Appointment details</CardTitle>
            <CardDescription>
              Make sure these details are correct before paying.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/20 p-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Scissors className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">
                  {appointment.serviceName}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {appointment.category}
                </p>
              </div>
              <Badge variant={statusVariants[appointment.status]}>
                {appointment.status}
              </Badge>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
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
                    {formatDate(appointment.date)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Appointment time
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {formatTime(appointment.time)}
                  </dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="border-border bg-background lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="text-lg">Payment summary</CardTitle>
            <CardDescription>
              The amount is taken from your appointment request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">
                {appointment.serviceName}
              </span>
              <span className="font-medium text-foreground">
                {formatPrice(appointment.totalPrice)}
              </span>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-foreground">
                  Total due
                </span>
                <span className="text-xl font-bold tracking-tight text-foreground">
                  {formatPrice(appointment.totalPrice)}
                </span>
              </div>
            </div>

            {canPay ? (
              <CheckoutButton appointmentId={appointment._id ?? ""} />
            ) : (
              <p
                role="status"
                className="rounded-lg bg-secondary/60 px-3 py-2.5 text-sm text-muted-foreground"
              >
                {!hasValidPrice
                  ? "The appointment price is unavailable. Please contact the salon."
                  : appointment.payment === "paid"
                    ? "This appointment is already paid."
                    : "Payment is available after the appointment is confirmed."}
              </p>
            )}

            <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              You’ll be redirected to Stripe to enter your payment details.
              SalonBook does not store your card information.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export function CheckoutUnavailable() {
  return (
    <main className="mx-auto max-w-xl py-12">
      <Card className="border-border bg-background">
        <CardHeader>
          <CardTitle>Appointment not available</CardTitle>
          <CardDescription>
            We couldn’t find an appointment you can pay for. Open your
            appointments and choose a confirmed, unpaid request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button href="/dashboard/customer/my-appointments" className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to appointments
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
