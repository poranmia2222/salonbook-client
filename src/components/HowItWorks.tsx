export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Browse Services",
      description:
        "Explore our premium hair, nail, and spa treatments to find the perfect service for you.",
    },
    {
      number: "02",
      title: "Book Your Appointment",
      description:
        "Choose your preferred stylist, date, and time slot in just a few taps.",
    },
    {
      number: "03",
      title: "Confirm & Enjoy",
      description:
        "Confirm your booking and visit us. We'll take care of the rest.",
    },
  ]

  return (
    <section className="bg-background border-y border-border/50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <h2
            className="font-[var(--font-playfair)] text-3xl md:text-4xl font-bold text-foreground leading-[1.2] mb-6"
          >
            How It Works
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Booking your salon appointment is quick and simple. Here&rsquo;s how
            to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-border/50 bg-secondary/30 p-8"
            >
              <div className="text-primary font-[var(--font-playfair)] text-2xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
