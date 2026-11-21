import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PaymentOutcomeStatus = "pending" | "unavailable"

const outcomeCopy: Record<
  PaymentOutcomeStatus,
  { title: string; description: string }
> = {
  pending: {
    title: "Payment not confirmed yet",
    description:
      "Stripe hasn’t confirmed this payment as complete. Check your appointments before trying to pay again.",
  },
  unavailable: {
    title: "We couldn’t verify this payment",
    description:
      "The payment details aren’t available for this account. Open your appointments to check your booking status.",
  },
}

export function PaymentOutcome({ status }: { status: PaymentOutcomeStatus }) {
  const copy = outcomeCopy[status]

  return (
    <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-20">
      <Card className="border-border bg-background">
        <CardHeader className="items-center space-y-3 text-center">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          >
            <AlertCircle className="h-7 w-7" />
          </span>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{copy.title}</CardTitle>
            <CardDescription className="leading-6">
              {copy.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button href="/dashboard/customer/my-appointments" className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to appointments
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
