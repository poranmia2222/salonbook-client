import {
  CalendarCheck2,
  CalendarDays,
  CreditCard,
  Hourglass,
  Plus,
} from "lucide-react"
import type { Appointment } from "@/lib/types/service"
import {
  RecentAppointmentRequests,
  UpcomingAppointments,
} from "@/components/dashboard/customer/AppointmentOverviewLists"
import { OverviewStatCard } from "@/components/dashboard/customer/OverviewStatCard"
import { Button } from "@/components/ui/button"

function getTodayDateKey() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${today.getFullYear()}-${month}-${day}`
}

function getCreatedAtTimestamp(createdAt?: string) {
  if (!createdAt) {
    return 0
  }

  const timestamp = Date.parse(createdAt)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export function CustomerOverview({
  customerName,
  appointments,
}: {
  customerName: string
  appointments: Appointment[]
}) {
  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === "confirmed" &&
        /^\d{4}-\d{2}-\d{2}$/.test(appointment.date) &&
        appointment.date >= getTodayDateKey()
    )
    .sort((a, b) => {
      const byDate = a.date.localeCompare(b.date)
      return byDate || a.time.localeCompare(b.time)
    })

  const recentAppointments = [...appointments]
    .sort(
      (a, b) =>
        getCreatedAtTimestamp(b.createdAt) -
        getCreatedAtTimestamp(a.createdAt)
    )
    .slice(0, 4)

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length
  const paymentDueCount = appointments.filter(
    (appointment) =>
      appointment.status === "confirmed" && appointment.payment === "unpaid"
  ).length

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Customer overview</p>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back{customerName ? `, ${customerName}` : ""}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Here’s a snapshot of your salon appointments and requests.
            </p>
          </div>
        </div>
        <Button href="/services" className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Book a service
        </Button>
      </header>

      <section
        aria-label="Appointment summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <OverviewStatCard
          label="Total requests"
          value={appointments.length}
          description="All your appointment requests"
          icon={CalendarDays}
          tone="primary"
        />
        <OverviewStatCard
          label="Awaiting confirmation"
          value={pendingCount}
          description="Requests waiting for the salon"
          icon={Hourglass}
          tone="amber"
        />
        <OverviewStatCard
          label="Upcoming visits"
          value={upcomingAppointments.length}
          description="Confirmed appointments ahead"
          icon={CalendarCheck2}
          tone="emerald"
        />
        <OverviewStatCard
          label="Payment due"
          value={paymentDueCount}
          description="Confirmed visits not yet paid"
          icon={CreditCard}
          tone="blue"
        />
      </section>

      <section
        aria-label="Your appointment activity"
        className="grid gap-5 xl:grid-cols-2"
      >
        <UpcomingAppointments appointments={upcomingAppointments.slice(0, 3)} />
        <RecentAppointmentRequests appointments={recentAppointments} />
      </section>
    </div>
  )
}

export function CustomerOverviewSkeleton() {
  return (
    <div className="space-y-8" aria-label="Loading customer overview">
      <div className="space-y-3">
        <div className="h-4 w-36 animate-pulse rounded bg-secondary" />
        <div className="h-8 w-64 max-w-full animate-pulse rounded bg-secondary" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-secondary" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-xl border border-border bg-secondary/40"
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-72 animate-pulse rounded-xl border border-border bg-secondary/40"
          />
        ))}
      </div>
    </div>
  )
}
