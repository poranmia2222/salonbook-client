"use client"

import { useEffect, useState, useMemo } from "react"
import { getServices } from "@/lib/api/services"
import { ServiceCard } from "@/components/ui/service-card"
import { Service } from "@/lib/types/service"

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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Our Services
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore our salon services and book your next appointment.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-auto max-w-md">
            <input
              type="text"
              placeholder="Search services..."
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="default">Sort by Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
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
