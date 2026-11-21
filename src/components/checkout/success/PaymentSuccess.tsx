import { CheckCircle2 } from "lucide-react"
import type { Appointment } from "@/lib/types/service"
import { AppointmentReceiptCard } from "@/components/checkout/success/AppointmentReceiptCard"
import { Button } from "@/components/ui/button"

export function PaymentSuccess({
  appointment,
  amountPaidInCents,
}: {
  appointment: Appointment
  amountPaidInCents: number
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-4 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          >
            <CheckCircle2 className="h-9 w-9" strokeWidth={1.8} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
              Payment complete
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              You’re all set.
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              Your payment was confirmed. Here are the details for your salon
              appointment.
            </p>
          </div>
        </header>

        <AppointmentReceiptCard
          appointment={appointment}
          amountPaidInCents={amountPaidInCents}
        />

        <div className="space-y-3 text-center">
          <Button
            href="/dashboard/customer/my-appointments"
            className="h-11 w-full sm:w-auto sm:min-w-64"
          >
            View my appointments
          </Button>
          <p className="text-sm text-muted-foreground">
            Need to make a change? You can manage your booking from your
            appointments.
          </p>
        </div>
      </div>
    </main>
  )
}
