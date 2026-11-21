import { redirect } from "next/navigation"
import { ManageUsersTable } from "@/components/dashboard/admin/ManageUsersTable"
import { getUsers } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"

export default async function ManageUsersPage() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  const role = (session.user as typeof session.user & { role?: string }).role
  if (role !== "admin") {
    redirect("/dashboard/customer")
  }

  const users = await getUsers()

  return (
    <div className="mx-auto max-w-7xl">
      <ManageUsersTable users={users} />
    </div>
  )
}