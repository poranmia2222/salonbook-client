import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/ui/service-card"
import type { Service } from "@/lib/types/service"

export function FeaturedServices({ services }: { services: Service[] }) {
  const featuredServices = services
    .filter((service) => service.availability)
    .sort(
      (left, right) =>
        Number(right.featured) - Number(left.featured) ||
        right.rating - left.rating
    )
    .slice(0, 6)

  return (
    <section className="border-y border-border/50 bg-secondary/20 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Handpicked for you
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-foreground md:text-4xl">
              Featured services
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Explore salon picks and popular treatments, all in one place.
            </p>
          </div>
          <Button href="/services" variant="outline" className="w-fit gap-2">
            Browse all services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {featuredServices.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={service._id ?? `${service.serviceName}-${index}`}
                service={service}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-border bg-background px-5 py-8 text-center text-sm text-muted-foreground">
            Featured services are coming soon. Browse our full service list in the meantime.
          </p>
        )}
      </div>
    </section>
  )
}
