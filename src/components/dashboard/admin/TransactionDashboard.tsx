"use client"

import { CreditCard } from "lucide-react"
import type { Appointment } from "@/lib/types/service"
import { TransactionSummary } from "./TransactionSummary"
import { TransactionTable } from "./TransactionTable"

export function TransactionDashboard({
  appointments,
}: {
  appointments: Appointment[]
}) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <CreditCard className="h-4 w-4" aria-hidden="true" />
          <span>Admin dashboard</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Transactions
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          View appointment payments and their current status.
        </p>
      </header>

      <TransactionSummary appointments={appointments} />
      <TransactionTable appointments={appointments} />
    </div>
  )
}
