"use client"

import { useEffect, useState, useMemo } from "react"
import { getServices } from "@/lib/api/services"
import { ServiceCard } from "@/components/ui/service-card"
import { Service } from "@/lib/types/service"
import { Search } from "lucide-react"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("default")

  useEffect(() => {
    let mounted = true
    getServices()
      .then((data: Service[]) => {
        if (mounted) {
          setServices(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) {
          setLoading(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [])

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(services.map((s) => s.category)))],
    [services]
  )

  const filteredAndSortedServices = useMemo(() => {
    let result = services

    if (categoryFilter !== "all") {
      result = result.filter((s) => s.category === categoryFilter)
    }

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [services, categoryFilter, sortBy])

  if (loading) {
    return (
      <div className="bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-32 rounded-full bg-secondary animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Services
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Explore our salon services and book your next appointment.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-secondary/40 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_220px_240px] lg:items-end">
          <div className="flex min-w-0 flex-col gap-2 sm:col-span-2 lg:col-span-1">
            <label htmlFor="service-search" className="text-xs font-medium text-muted-foreground">
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="service-search"
                type="text"
                placeholder="Search services..."
                className="h-11 w-full rounded-lg border border-input bg-background px-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="service-category" className="text-xs font-medium text-muted-foreground">
              Category
            </label>
            <select
              id="service-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="service-sort" className="text-xs font-medium text-muted-foreground">
              Sort by
            </label>
            <select
              id="service-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="default">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </div>
    </div>
  )
}
