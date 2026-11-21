"use client"

import { Input } from "@/components/ui/input"

interface ServiceOfferSectionProps {
  values: {
    duration: string
    price: string
    discountPrice: string
    preparation: string
    aftercare: string
  }
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

export function ServiceOfferSection({
  values,
  onChange,
  errors,
}: ServiceOfferSectionProps) {
  return (
    <section className="rounded-xl border border-border bg-secondary/20 p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Pricing and care
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the appointment details and client instructions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="duration" className="text-sm font-medium text-foreground">
            Duration (minutes)
          </label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={values.duration}
            onChange={(event) => onChange("duration", event.target.value)}
            placeholder="45"
            className="mt-2 h-11 text-foreground placeholder:text-muted-foreground"
          />
          {errors.duration && (
            <p className="mt-1 text-xs text-destructive">{errors.duration}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="text-sm font-medium text-foreground">
            Regular price
          </label>
          <Input
            id="price"
            type="number"
            min="0"
            value={values.price}
            onChange={(event) => onChange("price", event.target.value)}
            placeholder="800"
            className="mt-2 h-11 text-foreground placeholder:text-muted-foreground"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-destructive">{errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="discountPrice" className="text-sm font-medium text-foreground">
            Discount price
          </label>
          <Input
            id="discountPrice"
            type="number"
            min="0"
            value={values.discountPrice}
            onChange={(event) => onChange("discountPrice", event.target.value)}
            placeholder="699"
            className="mt-2 h-11 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="preparation" className="text-sm font-medium text-foreground">
            Preparation
          </label>
          <textarea
            id="preparation"
            value={values.preparation}
            onChange={(event) => onChange("preparation", event.target.value)}
            rows={3}
            placeholder="What should the customer do before the appointment?"
            className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="aftercare" className="text-sm font-medium text-foreground">
            Aftercare
          </label>
          <textarea
            id="aftercare"
            value={values.aftercare}
            onChange={(event) => onChange("aftercare", event.target.value)}
            rows={3}
            placeholder="How should the customer maintain results?"
            className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
    </section>
  )
}
