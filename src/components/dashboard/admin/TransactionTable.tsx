"use client"

import { useMemo, useState } from "react"
import { ReceiptText, Search } from "lucide-react"
import type { Appointment } from "@/lib/types/service"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(value?: string) {
  if (!value) return "Unknown"
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value)

  if (Number.isNaN(date.getTime())) return "Unknown"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function TransactionTable({
  appointments,
}: {
  appointments: Appointment[]
}) {
  const [search, setSearch] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...appointments]
      .filter((appointment) => {
        const matchesPayment =
          paymentFilter === "all" || appointment.payment === paymentFilter
        const matchesSearch =
          !query ||
          (appointment.userName || "").toLowerCase().includes(query) ||
          (appointment.userEmail || "").toLowerCase().includes(query) ||
          (appointment.serviceName || "").toLowerCase().includes(query)

        return matchesPayment && matchesSearch
      })
      .sort((first, second) =>
        String(second.createdAt || "").localeCompare(
          String(first.createdAt || "")
        )
      )
  }, [appointments, paymentFilter, search])

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Transaction history</CardTitle>
        <CardDescription>
          Search and review customer payments
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px]">
          <div className="space-y-2">
            <Label htmlFor="transaction-search">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="transaction-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customer or service..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-filter">Payment status</Label>
            <select
              id="payment-filter"
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all" className="bg-background text-foreground">
                All payments
              </option>
              <option value="paid" className="bg-background text-foreground">
                Paid
              </option>
              <option value="unpaid" className="bg-background text-foreground">
                Unpaid
              </option>
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>
                  <p className="font-medium text-foreground">
                    {appointment.userName || "Unknown customer"}
                  </p>
                  <p className="mt-1 max-w-48 truncate text-xs text-muted-foreground">
                    {appointment.userEmail || "No email"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="max-w-48 truncate text-foreground">
                    {appointment.serviceName || "Service"}
                  </p>
                </TableCell>
                <TableCell className="text-foreground">
                  {formatDate(appointment.createdAt)}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {formatCurrency(appointment.totalPrice)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={appointment.payment === "paid" ? "success" : "warning"}
                  >
                    {appointment.payment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "success"
                        : appointment.status === "cancelled"
                          ? "destructive"
                          : "warning"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}

            {filteredAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center">
                    <ReceiptText className="mb-3 h-6 w-6 text-muted-foreground" />
                    <p className="font-medium text-foreground">
                      No transactions found
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try another search or payment status.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
