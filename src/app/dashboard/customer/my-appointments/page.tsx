import { redirect } from "next/navigation"
import { Suspense } from "react"
import { CalendarDays, Plus } from "lucide-react"
import {
  AppointmentTable,
  AppointmentTableSkeleton,
} from "@/components/appointments/AppointmentTable"
import { Button } from "@/components/ui/button"
import { getMyAppointments } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"

export default function MyAppointmentsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <span>Customer dashboard</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My appointments
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Review your appointment requests, scheduled visits, and payment
              status.
            </p>
          </div>
        </div>

        <Button href="/services" className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Book a service
        </Button>
      </header>

      <Suspense fallback={<AppointmentTableSkeleton />}>
        <MyAppointmentsList />
      </Suspense>
    </div>
  )
}

async function MyAppointmentsList() {
  const session = await getSession()

  if (!session?.user.id) {
    redirect("/sign-in")
  }

  const appointments = await getMyAppointments(
    `applicantId=${encodeURIComponent(session.user.id)}`
  )

  return <AppointmentTable appointments={appointments} />
}