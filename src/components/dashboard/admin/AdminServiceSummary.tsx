import { Scissors } from "lucide-react"
import type { Service } from "@/lib/types/service"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AdminServiceSummary({ services }: { services: Service[] }) {
  const categories = Array.from(
    services.reduce((counts, service) => {
      counts.set(service.category, (counts.get(service.category) || 0) + 1)
      return counts
    }, new Map<string, number>())
  ).sort((first, second) => second[1] - first[1])

  const featuredCount = services.filter((service) => service.featured).length
  const availableCount = services.filter((service) => service.availability).length

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Service summary</CardTitle>
          <CardDescription className="mt-2">
            Services by category
          </CardDescription>
        </div>
        <Scissors className="h-5 w-5 text-primary" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="mb-5 flex flex-wrap gap-2">
          <Badge variant="success">{availableCount} available</Badge>
          <Badge variant="outline">{featuredCount} featured</Badge>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No service categories yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map(([category, count]) => (
              <div
                key={category}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">
                  {category}
                </span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
