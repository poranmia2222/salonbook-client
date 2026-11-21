import { Suspense } from "react"
import { redirect } from "next/navigation"
import { CheckoutSummary, CheckoutUnavailable } from "@/components/checkout/CheckoutSummary"
import { getMyAppointmentForUser } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"

type CheckoutSearchParams = Promise<{
  appointmentId?: string | string[]
  cancelled?: string | string[]
}>

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: CheckoutSearchParams
}) {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent searchParams={searchParams} />
    </Suspense>
  )
}

async function CheckoutContent({
  searchParams,
}: {
  searchParams: CheckoutSearchParams
}) {
  const [query, session] = await Promise.all([searchParams, getSession()])

  if (!session?.user.id) {
    redirect("/sign-in")
  }

  const role = (session.user as typeof session.user & { role?: string }).role
  if (role !== "customer") {
    redirect("/dashboard/customer")
  }

  const appointmentId =
    typeof query.appointmentId === "string" ? query.appointmentId : ""

  if (!appointmentId) {
    return <CheckoutUnavailable />
  }

  const appointment = await getMyAppointmentForUser(
    session.user.id,
    appointmentId
  )

  if (!appointment) {
    return <CheckoutUnavailable />
  }

  return (
    <CheckoutSummary
      appointment={appointment}
      paymentCancelled={query.cancelled === "1"}
    />
  )
}

function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6" aria-label="Loading checkout">
      <div className="h-8 w-64 animate-pulse rounded bg-secondary" />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.8fr]">
        <div className="h-72 animate-pulse rounded-xl border border-border bg-secondary/40" />
        <div className="h-72 animate-pulse rounded-xl border border-border bg-secondary/40" />
      </div>
    </div>
  )
}
