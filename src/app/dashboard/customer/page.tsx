import { Suspense } from "react"
import { redirect } from "next/navigation"
import { CustomerOverview, CustomerOverviewSkeleton } from "@/components/dashboard/customer/CustomerOverview"
import { getMyAppointments } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"

export default function CustomerPage() {
  return (
    <Suspense fallback={<CustomerOverviewSkeleton />}>
      <CustomerOverviewContent />
    </Suspense>
  )
}

async function CustomerOverviewContent() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  const role = (session.user as typeof session.user & { role?: string }).role
  if (role === "admin") {
    redirect("/dashboard/admin")
  }

  const appointments = await getMyAppointments(
    `applicantId=${encodeURIComponent(session.user.id)}`
  )

  return (
    <CustomerOverview
      customerName={session.user.name || ""}
      appointments={appointments}
    />
  )
}
