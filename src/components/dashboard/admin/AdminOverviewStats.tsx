import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Scissors,
} from "lucide-react"
import { OverviewStatCard } from "./OverviewStatCard"

interface AdminOverviewStatsProps {
  servicesCount: number
  appointmentsCount: number
  paidRevenue: number
  pendingCount: number
}

export function AdminOverviewStats({
  servicesCount,
  appointmentsCount,
  paidRevenue,
  pendingCount,
}: AdminOverviewStatsProps) {
  const stats = [
    {
      title: "Total services",
      value: servicesCount,
      description: "Active salon listings",
      icon: Scissors,
      tone: "bg-primary/10 text-primary",
    },
    {
      title: "Appointments",
      value: appointmentsCount,
      description: "All booking requests",
      icon: CalendarDays,
      tone: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Pending",
      value: pendingCount,
      description: "Waiting for review",
      icon: Clock3,
      tone: "bg-amber-500/10 text-amber-300",
    },
    {
      title: "Paid revenue",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(paidRevenue),
      description: "From paid appointments",
      icon: CircleDollarSign,
      tone: "bg-emerald-500/10 text-emerald-300",
    },
  ]

  return (
    <section
      aria-label="Dashboard summary"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <OverviewStatCard key={stat.title} {...stat} />
      ))}
    </section>
  )
}
