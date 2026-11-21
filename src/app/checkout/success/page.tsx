import { redirect } from "next/navigation"
import { PaymentOutcome } from "@/components/checkout/success/PaymentOutcome"
import { PaymentSuccess } from "@/components/checkout/success/PaymentSuccess"
import { getMyAppointmentForUser } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"
import { stripe } from "@/lib/stripe"
import { verifyCheckoutPayment } from "@/lib/action/appointment"

type CheckoutSuccessSearchParams = Promise<{
  session_id?: string | string[]
}>

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: CheckoutSuccessSearchParams
}) {
  const [query, session] = await Promise.all([searchParams, getSession()])

  if (!session?.user.id) {
    redirect("/sign-in")
  }

  const role = (session.user as typeof session.user & { role?: string }).role
  if (role !== "customer") {
    redirect("/dashboard/customer")
  }

  const sessionId =
    typeof query.session_id === "string" ? query.session_id : ""

  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return <PaymentOutcome status="unavailable" />
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
  const {
  status,
  payment_status,
  customer_email,
  payment_intent,
  metadata,
} = checkoutSession
  const appointmentId = checkoutSession.metadata?.appointmentId
  if (
    !appointmentId ||
    checkoutSession.metadata?.userId !== session.user.id ||
    checkoutSession.client_reference_id !== appointmentId ||
    checkoutSession.mode !== "payment"
  ) {
    return <PaymentOutcome status="unavailable" />
  }

  const appointment = await getMyAppointmentForUser(session.user.id, appointmentId)

  if (!appointment) {
    return <PaymentOutcome status="unavailable" />
  }

  if (checkoutSession.payment_status !== "paid") {
    return <PaymentOutcome status="pending" />
  }

  if (
    checkoutSession.currency !== "usd" ||
    !Number.isSafeInteger(checkoutSession.amount_total) ||
    checkoutSession.amount_total === null ||
    checkoutSession.amount_total <= 0
  ) {
    return <PaymentOutcome status="unavailable" />
  }
  try {
  await verifyCheckoutPayment(sessionId);
} catch (error) {
  console.error("Payment verification error:", error);
  return <PaymentOutcome status="unavailable" />;
}
  return (
    <PaymentSuccess
      appointment={appointment}
      amountPaidInCents={checkoutSession.amount_total}
    />
  )
}
