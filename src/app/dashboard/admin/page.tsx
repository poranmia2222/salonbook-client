import { LayoutDashboard } from "lucide-react"
import { redirect } from "next/navigation"
import { AdminOverviewStats } from "@/components/dashboard/admin/AdminOverviewStats"
import { AdminRecentAppointments } from "@/components/dashboard/admin/AdminRecentAppointments"
import { AdminQuickActions } from "@/components/dashboard/admin/AdminQuickActions"
import { AdminServiceSummary } from "@/components/dashboard/admin/AdminServiceSummary"
import { getAppointment, getServices } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"
import type { Appointment, Service } from "@/lib/types/service"

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  const role = (session.user as typeof session.user & { role?: string }).role
  if (role !== "admin") {
    redirect("/dashboard/customer")
  }

  let services: Service[]
  let appointments: Appointment[]

  try {
    [services, appointments] = await Promise.all([
      getServices(),
      getAppointment(),
    ])
  } catch {
    services = []
    appointments = []
  }

  const paidRevenue = appointments
    .filter((appointment) => appointment.payment === "paid")
    .reduce((total, appointment) => total + appointment.totalPrice, 0)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          <span>Admin dashboard</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Overview
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            A simple summary of your salon services and appointments.
          </p>
        </div>
      </header>

      <AdminOverviewStats
        servicesCount={services.length}
        appointmentsCount={appointments.length}
        paidRevenue={paidRevenue}
        pendingCount={
          appointments.filter((appointment) => appointment.status === "pending")
            .length
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.5fr)]">
        <AdminRecentAppointments appointments={appointments} />
        <AdminQuickActions />
      </div>

      <AdminServiceSummary services={services} />
    </div>
  )
}
