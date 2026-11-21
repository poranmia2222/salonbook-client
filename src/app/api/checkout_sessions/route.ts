import { NextResponse } from "next/server"
import { getMyAppointmentForUser } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  const session = await getSession()

  if (!session?.user.id) {
    return NextResponse.json({ error: "Sign in to continue to checkout." }, { status: 401 })
  }

  const role = (session.user as typeof session.user & { role?: string }).role
  if (role !== "customer") {
    return NextResponse.json({ error: "Only customers can pay for appointments." }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 })
  }

  const appointmentId =
    typeof body === "object" &&
    body !== null &&
    "appointmentId" in body &&
    typeof body.appointmentId === "string"
      ? body.appointmentId.trim()
      : ""

  if (!appointmentId) {
    return NextResponse.json({ error: "An appointment is required." }, { status: 400 })
  }

  const appointment = await getMyAppointmentForUser(
    session.user.id,
    appointmentId
  )

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 })
  }

  if (appointment.status !== "confirmed" || appointment.payment !== "unpaid") {
    return NextResponse.json(
      { error: "Only confirmed, unpaid appointments can be paid." },
      { status: 409 }
    )
  }

  const amountInCents = Math.round(appointment.totalPrice * 100)
  if (
    !Number.isFinite(appointment.totalPrice) ||
    appointment.totalPrice <= 0 ||
    !Number.isSafeInteger(amountInCents) ||
    amountInCents <= 0
  ) {
    return NextResponse.json({ error: "The appointment price is invalid." }, { status: 422 })
  }

  const origin = new URL(request.url).origin
  let checkoutSession
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: appointment.serviceName || "Salon appointment",
              description: `${appointment.date} at ${appointment.time}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: session?.user.email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?appointmentId=${encodeURIComponent(appointmentId)}&cancelled=1`,
      client_reference_id: appointmentId,
      metadata: {
        appointmentId,
        userId: session.user.id,
      },
    })
  } catch (error) {
    console.error("Stripe Checkout session creation failed.", error)
    return NextResponse.json(
      { error: "Unable to start secure checkout. Please try again." },
      { status: 502 }
    )
  }

  if (!checkoutSession.url) {
    return NextResponse.json(
      { error: "Stripe did not return a checkout URL." },
      { status: 502 }
    )
  }

  return NextResponse.json({ url: checkoutSession.url })
}