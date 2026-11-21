import { AddServiceForm } from "@/components/dashboard/admin/AddServiceForm"

export default function AddServicePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium text-primary">Service management</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Add a new service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a complete service listing for your customers.
        </p>
      </div>

      <AddServiceForm />
    </div>
  )
}