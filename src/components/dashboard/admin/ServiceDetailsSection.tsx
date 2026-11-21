"use client"

import { Input } from "@/components/ui/input"

export const CATEGORY_OPTIONS = {
  Hair: ["Haircut", "Hair Color", "Hair Treatment", "Styling"],
  Nails: ["Manicure", "Pedicure", "Nail Art", "Gel & Extensions"],
  Makeup: ["Bridal Makeup", "Party Makeup", "Basic Makeup", "Makeup Lesson"],
  Spa: ["Facial", "Body Treatment", "Massage", "Spa Package"],
  Skincare: ["Facial", "Skin Treatment", "Waxing", "Threading"],
  Bridal: ["Bridal Package", "Bridal Makeup", "Pre-Wedding Care"],
} as const

interface ServiceDetailsSectionProps {
  values: {
    serviceName: string
    category: string
    subCategory: string
    description: string
  }
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

const fieldClass =
  "mt-2 min-h-11 rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"

export function ServiceDetailsSection({
  values,
  onChange,
  errors,
}: ServiceDetailsSectionProps) {
  const subCategories =
    CATEGORY_OPTIONS[values.category as keyof typeof CATEGORY_OPTIONS] || []

  return (
    <section className="rounded-xl border border-border bg-secondary/20 p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">Basic details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add the main information customers will see.
        </p>
      </div>

      <div className="grid gap-5">
        <div>
          <label htmlFor="serviceName" className="text-sm font-medium text-foreground">
            Service name
          </label>
          <Input
            id="serviceName"
            value={values.serviceName}
            onChange={(event) => onChange("serviceName", event.target.value)}
            placeholder="Women's Haircut & Styling"
            className={fieldClass}
          />
          {errors.serviceName && (
            <p className="mt-1 text-xs text-destructive">{errors.serviceName}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              Category
            </label>
            <select
              id="category"
              value={values.category}
              onChange={(event) => {
                onChange("category", event.target.value)
                onChange("subCategory", "")
              }}
              className={`${fieldClass} h-11 w-full rounded-lg border px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            >
              <option value="" className="bg-background text-foreground">
                Select category
              </option>
              {Object.keys(CATEGORY_OPTIONS).map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-background text-foreground"
                >
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="subCategory" className="text-sm font-medium text-foreground">
              Sub-category
            </label>
            <select
              id="subCategory"
              value={values.subCategory}
              onChange={(event) => onChange("subCategory", event.target.value)}
              disabled={!values.category}
              className={`${fieldClass} h-11 w-full rounded-lg border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            >
              <option value="" className="bg-background text-foreground">
                Select sub-category
              </option>
              {subCategories.map((subCategory) => (
                <option
                  key={subCategory}
                  value={subCategory}
                  className="bg-background text-foreground"
                >
                  {subCategory}
                </option>
              ))}
            </select>
            {errors.subCategory && (
              <p className="mt-1 text-xs text-destructive">
                {errors.subCategory}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            value={values.description}
            onChange={(event) => onChange("description", event.target.value)}
            rows={5}
            placeholder="Describe what makes this service special..."
            className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-destructive">{errors.description}</p>
          )}
        </div>
      </div>
    </section>
  )
}
