import { CalendarDays } from "lucide-react"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { AdminAppointmentSummary } from "@/components/appointments/AdminAppointmentSummary"
import { AdminAppointmentTable } from "@/components/appointments/AdminAppointmentTable"
import { getAppointment } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"

export default function ManageAppointmentPage() {
  return (
    <Suspense fallback={<ManageAppointmentLoading />}>
      <ManageAppointmentsContent />
    </Suspense>
  )
}

async function ManageAppointmentsContent() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  const role = (session.user as typeof session.user & { role?: string }).role
  if (role !== "admin") {
    redirect("/dashboard/customer")
  }

  const appointments = await getAppointment()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          <span>Admin dashboard</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Manage appointments
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review customer requests, appointment details, and payment status.
          </p>
        </div>
      </header>

      <AdminAppointmentSummary appointments={appointments} />
      <AdminAppointmentTable appointments={appointments} />
    </div>
  )
}

function ManageAppointmentLoading() {
  return (
    <div className="space-y-6" aria-label="Loading appointments">
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
        <div className="h-8 w-64 max-w-full animate-pulse rounded bg-secondary" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-secondary" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-xl border border-border bg-secondary/40"
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-xl border border-border bg-secondary/40" />
    </div>
  )
}