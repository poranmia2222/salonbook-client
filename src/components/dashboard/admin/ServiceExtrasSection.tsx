"use client"

interface ServiceExtrasSectionProps {
  values: {
    benefits: string
    includes: string
    suitableFor: string
    tags: string
  }
  onChange: (field: string, value: string) => void
  featured: boolean
  onFeaturedChange: (value: boolean) => void
  availability: boolean
  onAvailabilityChange: (value: boolean) => void
}

export function ServiceExtrasSection({
  values,
  onChange,
  featured,
  onFeaturedChange,
  availability,
  onAvailabilityChange,
}: ServiceExtrasSectionProps) {
  const fields = [
    {
      id: "benefits",
      label: "Benefits",
      placeholder: "Enhances facial features, Improves hair shape",
    },
    {
      id: "includes",
      label: "What is included",
      placeholder: "Consultation, Shampoo, Precision haircut",
    },
    {
      id: "suitableFor",
      label: "Suitable for",
      placeholder: "Women, All hair types",
    },
    {
      id: "tags",
      label: "Tags",
      placeholder: "women haircut, hair styling, beauty",
    },
  ]

  return (
    <section className="rounded-xl border border-border bg-secondary/20 p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Extra information
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Separate multiple items with commas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="text-sm font-medium text-foreground">
              {field.label}
            </label>
            <textarea
              id={field.id}
              value={values[field.id as keyof typeof values]}
              onChange={(event) => onChange(field.id, event.target.value)}
              rows={3}
              placeholder={field.placeholder}
              className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm text-foreground">
          <span>
            <span className="block font-medium">Featured service</span>
            <span className="text-xs text-muted-foreground">
              Highlight this service
            </span>
          </span>
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => onFeaturedChange(event.target.checked)}
            className="h-4 w-4 accent-[hsl(342_78%_60%)]"
          />
        </label>

        <label className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm text-foreground">
          <span>
            <span className="block font-medium">Available for booking</span>
            <span className="text-xs text-muted-foreground">
              Allow customers to book now
            </span>
          </span>
          <input
            type="checkbox"
            checked={availability}
            onChange={(event) => onAvailabilityChange(event.target.checked)}
            className="h-4 w-4 accent-[hsl(342_78%_60%)]"
          />
        </label>
      </div>
    </section>
  )
}
