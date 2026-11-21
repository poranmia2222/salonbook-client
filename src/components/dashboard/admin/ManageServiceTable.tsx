"use client"

import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Service } from "@/lib/types/service"
import { ServiceTableActions } from "./ServiceTableActions"
import { EditServiceModal } from "./EditServiceModal"

interface ManageServiceTableProps {
  initialServices: Service[]
}

export function ManageServiceTable({
  initialServices,
}: ManageServiceTableProps) {
  const [services, setServices] = useState(initialServices)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [editingService, setEditingService] = useState<Service | null>(null)

  const categories = useMemo(
    () =>
      ["all", ...Array.from(new Set(services.map((service) => service.category)))],
    [services]
  )

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase()

    return services.filter((service) => {
      const matchesCategory =
        category === "all" || service.category === category
      const matchesSearch =
        !query ||
        service.serviceName.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.subCategory.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [category, search, services])

  const removeService = (serviceId: string) => {
    setServices((current) =>
      current.filter((service) => service._id !== serviceId)
    )
  }

  const replaceService = (updatedService: Service) => {
    setServices((current) =>
      current.map((service) =>
        service._id === updatedService._id ? updatedService : service
      )
    )
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl">Manage services</CardTitle>
            <CardDescription className="mt-2">
              {services.length} {services.length === 1 ? "service" : "services"} listed
            </CardDescription>
          </div>
          <Button href="/dashboard/admin/add-service" className="gap-2">
            <Plus className="h-4 w-4" />
            Add service
          </Button>
        </CardHeader>
      </Card>

      <Card className="mb-5">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-2">
            <Label htmlFor="service-search">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="service-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or category..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
                className="bg-background text-foreground"
              >
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-72">Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt=""
                      className="h-12 w-12 rounded-lg border border-border object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {service.serviceName}
                      </p>
                      <p className="mt-1 max-w-72 truncate text-xs text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground">{service.category}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {service.subCategory}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-foreground">
                    ${service.discountPrice ?? service.price}
                  </p>
                  {service.discountPrice && (
                    <p className="mt-1 text-xs text-muted-foreground line-through">
                      ${service.price}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-foreground">
                  {service.duration} min
                </TableCell>
                <TableCell>
                  <Badge variant={service.availability ? "success" : "outline"}>
                    {service.availability ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ServiceTableActions
                    service={service}
                    onEdit={() => setEditingService(service)}
                    onDelete={removeService}
                  />
                </TableCell>
              </TableRow>
            ))}

            {filteredServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <p className="font-medium text-foreground">No services found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try another search or category.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSaved={(updatedService) => {
            replaceService(updatedService)
            setEditingService(null)
          }}
        />
      )}
    </>
  )
}
