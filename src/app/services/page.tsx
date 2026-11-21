"use client"

import { Suspense, useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getServices } from "@/lib/api/services"
import { ServiceCard } from "@/components/ui/service-card"
import { Service } from "@/lib/types/service"
import { AlertCircle, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

function ServicesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [sortBy, setSortBy] = useState<string>("default")
  const categoryFilter = searchParams.get("category") || "all"

  useEffect(() => {
    let mounted = true
    getServices()
      .then((data: Service[]) => {
        if (mounted) {
          setServices(data)
          setError(null)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load services. Please try again."
          )
          setLoading(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [retryCount])

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(services.map((s) => s.category)))],
    [services]
  )
  const [search, setSearch] = useState("")
const filteredAndSortedServices = useMemo(() => {
  const query = search.trim().toLowerCase()

  let result = services.filter((service) => {
    const matchesSearch =
      !query ||
      (service.serviceName || "").toLowerCase().includes(query) ||
      (service.category || "").toLowerCase().includes(query) ||
      (service.description || "").toLowerCase().includes(query)

    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  if (sortBy === "price-low") {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (sortBy === "price-high") {
    result = [...result].sort((a, b) => b.price - a.price)
  }

  return result
}, [services, categoryFilter, sortBy, search])

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    setRetryCount((count) => count + 1)
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-[60vh] max-w-7xl items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-8 w-32 rounded-full bg-secondary animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading services...</p>
            <p className="text-xs text-muted-foreground">
              This usually only takes a moment.
            </p>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              onChange={(event) => {
                const params = new URLSearchParams(searchParams.toString())
                if (event.target.value === "all") {
                  params.delete("category")
                } else {
                  params.set("category", event.target.value)
                }
                router.push(params.size ? `/services?${params.toString()}` : "/services")
              }}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="default">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="flex flex-col items-center rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center"
          >
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              We couldn&apos;t load the services
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              {error}
            </p>
            <Button
              onClick={handleRetry}
              className="mt-5 gap-2"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
          </div>
        ) : filteredAndSortedServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {services.length === 0
                ? "No services available yet"
                : "No services match this category"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {services.length === 0
                ? "Please check back soon."
                : "Choose another category to see more services."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background min-h-screen py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  )
}
