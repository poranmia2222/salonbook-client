import Link from "next/link"
import {
  Flower2,
  Hand,
  Heart,
  Palette,
  Sparkles,
  Scissors,
} from "lucide-react"
import type { Service } from "@/lib/types/service"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const categoryCards = [
  {
    name: "Hair",
    description: "Cuts, styling and color",
    icon: Scissors,
    tone: "bg-primary/10 text-primary",
  },
  {
    name: "Nails",
    description: "Manicure and nail art",
    icon: Hand,
    tone: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  {
    name: "Makeup",
    description: "Everyday and occasion looks",
    icon: Palette,
    tone: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400",
  },
  {
    name: "Spa",
    description: "Massage and relaxation",
    icon: Flower2,
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  {
    name: "Skincare",
    description: "Facials and skin treatments",
    icon: Sparkles,
    tone: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  },
  {
    name: "Bridal",
    description: "Complete bridal packages",
    icon: Heart,
    tone: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  },
]

export function ServiceCategories({
  services,
}: {
  services: Service[]
}) {
  return (
    <section className="border-y border-border/50 bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium text-primary">
            Find your perfect service
          </p>
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-foreground md:text-4xl">
            Browse by category
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryCards.map(({ name, description, icon: Icon, tone }) => {
            const count = services.filter(
              (service) =>
                service.category.toLowerCase() === name.toLowerCase()
            ).length

            return (
              <Link
                key={name}
                href={`/services?category=${encodeURIComponent(name)}`}
                className="group"
              >
                <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/50">
                  <CardHeader className="flex-row items-center gap-4 space-y-0">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <CardTitle className="text-lg">{name}</CardTitle>
                      <CardDescription className="mt-1">
                        {count} {count === 1 ? "service" : "services"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
