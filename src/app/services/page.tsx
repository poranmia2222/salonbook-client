"use client"

import { useEffect, useState } from "react"
import { getServices } from "@/lib/api/services"
import { ServiceCard } from "@/components/ui/service-card"
import { Service } from "@/lib/types/service"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </div>
    </div>
  )
}
