import { ManageServiceTable } from "@/components/dashboard/admin/ManageServiceTable"
import { getServices } from "@/lib/api/services"

export default async function ManageServicePage() {
  const services = await getServices()

  return (
    <div className="mx-auto max-w-7xl py-2">
      <ManageServiceTable initialServices={services} />
    </div>
  )
}