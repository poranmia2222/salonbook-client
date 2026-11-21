import {
  CircleDollarSign,
  CreditCard,
  ReceiptText,
  WalletCards,
} from "lucide-react"
import type { Appointment } from "@/lib/types/service"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function TransactionSummary({
  appointments,
}: {
  appointments: Appointment[]
}) {
  const paidTransactions = appointments.filter(
    (appointment) => appointment.payment === "paid"
  )
  const unpaidTransactions = appointments.filter(
    (appointment) => appointment.payment === "unpaid"
  )
  const paidAmount = paidTransactions.reduce(
    (total, appointment) => total + appointment.totalPrice,
    0
  )
  const unpaidAmount = unpaidTransactions.reduce(
    (total, appointment) => total + appointment.totalPrice,
    0
  )

  const items = [
    {
      title: "Total transactions",
      value: appointments.length,
      description: "All appointment payments",
      icon: ReceiptText,
      tone: "bg-primary/10 text-primary",
    },
    {
      title: "Paid",
      value: paidTransactions.length,
      description: formatCurrency(paidAmount),
      icon: CircleDollarSign,
      tone: "bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "Unpaid",
      value: unpaidTransactions.length,
      description: formatCurrency(unpaidAmount),
      icon: CreditCard,
      tone: "bg-amber-500/10 text-amber-300",
    },
    {
      title: "Collected",
      value: formatCurrency(paidAmount),
      description: "Successfully paid",
      icon: WalletCards,
      tone: "bg-blue-500/10 text-blue-400",
    },
  ]

  return (
    <section
      aria-label="Transaction summary"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {items.map(({ title, value, description, icon: Icon, tone }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
