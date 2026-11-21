import { redirect } from "next/navigation"
import { TransactionDashboard } from "@/components/dashboard/admin/TransactionDashboard"
import { getAppointment } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"

export default async function TransactionsPage() {
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
    <div className="mx-auto max-w-7xl">
      <TransactionDashboard appointments={appointments} />
    </div>
  )
}