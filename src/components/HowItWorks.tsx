import { CalendarCheck, Search, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Browse Services",
      description:
        "Explore our premium hair, nail, and spa treatments to find the perfect service for you.",
      icon: Search,
    },
    {
      number: "02",
      title: "Book Your Appointment",
      description:
        "Choose your preferred stylist, date, and time slot in just a few taps.",
      icon: CalendarCheck,
    },
    {
      number: "03",
      title: "Confirm & Enjoy",
      description:
        "Confirm your booking and visit us. We'll take care of the rest.",
      icon: Sparkles,
    },
  ]

  return (
    <section
      id="how-it-works"
      className="border-y border-border/50 bg-secondary/20 py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="mb-2 text-sm font-medium text-primary">Simple booking</p>
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold leading-[1.2] text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Booking your salon appointment is quick and simple. Here&rsquo;s how
            to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <Card
              key={number}
              className="relative overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-[var(--font-playfair)] text-3xl font-bold text-border">
                    {number}
                  </span>
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
