"use client"

import { FormEvent, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createService } from "@/lib/api/services"
import { Service } from "@/lib/types/service"
import { ServiceDetailsSection } from "./ServiceDetailsSection"
import { ServiceExtrasSection } from "./ServiceExtrasSection"
import { ServiceImageUpload } from "./ServiceImageUpload"
import { ServiceOfferSection } from "./ServiceOfferSection"

const initialValues = {
  serviceName: "",
  category: "",
  subCategory: "",
  description: "",
  duration: "",
  price: "",
  discountPrice: "",
  preparation: "",
  aftercare: "",
  benefits: "",
  includes: "",
  suitableFor: "",
  tags: "",
}

function splitValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function AddServiceForm() {
  const [values, setValues] = useState(initialValues)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [featured, setFeatured] = useState(false)
  const [availability, setAvailability] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [imageResetKey, setImageResetKey] = useState(0)

  const handleChange = (field: string, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: "" }))
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (!values.serviceName.trim()) nextErrors.serviceName = "Service name is required"
    if (!values.category) nextErrors.category = "Category is required"
    if (!values.subCategory) nextErrors.subCategory = "Sub-category is required"
    if (!values.description.trim()) nextErrors.description = "Description is required"
    if (!values.duration || Number(values.duration) < 1)
      nextErrors.duration = "Enter a valid duration"
    if (!values.price || Number(values.price) < 0)
      nextErrors.price = "Enter a valid price"
    if (!imageFile) nextErrors.image = "Please select a service image"
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccess("")
    setSubmitError("")

    if (!validate()) return

    setSubmitting(true)

    try {
      const imageData = new FormData()
      imageData.append("image", imageFile as File)

      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: imageData,
      })
      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.message || "The image could not be uploaded")
      }

      const discountPrice =
        values.discountPrice === "" ? null : Number(values.discountPrice)

      const service: Omit<Service, "_id"> = {
        serviceName: values.serviceName.trim(),
        category: values.category,
        subCategory: values.subCategory,
        description: values.description.trim(),
        duration: Number(values.duration),
        price: Number(values.price),
        discountPrice,
        image: uploadResult.imageUrl,
        benefits: splitValues(values.benefits),
        includes: splitValues(values.includes),
        suitableFor: splitValues(values.suitableFor),
        preparation: values.preparation.trim(),
        aftercare: values.aftercare.trim(),
        rating: 0,
        totalReviews: 0,
        availability,
        featured,
        tags: splitValues(values.tags),
      }

      await createService(service)
      setSuccess("Service has been added successfully.")
      setValues(initialValues)
      setImageFile(null)
      setImageResetKey((current) => current + 1)
      setFeatured(false)
      setAvailability(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to add the service. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {submitError}
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6">
          <div className="rounded-xl border border-border bg-secondary/20 p-5 shadow-sm">
            <ServiceImageUpload
              key={imageResetKey}
              onChange={(file) => {
                setImageFile(file)
                setErrors((current) => ({ ...current, image: "" }))
              }}
              error={errors.image}
            />
          </div>
        </div>

        <div className="grid gap-5">
          <ServiceDetailsSection
            values={values}
            onChange={handleChange}
            errors={errors}
          />
          <ServiceOfferSection
            values={values}
            onChange={handleChange}
            errors={errors}
          />
          <ServiceExtrasSection
            values={values}
            onChange={handleChange}
            featured={featured}
            onFeaturedChange={setFeatured}
            availability={availability}
            onAvailabilityChange={setAvailability}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 rounded-xl border border-border bg-secondary/20 p-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValues(initialValues)
            setImageFile(null)
            setImageResetKey((current) => current + 1)
            setErrors({})
            setSubmitError("")
            setSuccess("")
          }}
          disabled={submitting}
          className="sm:min-w-28"
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="gap-2 sm:min-w-36"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Adding..." : "Add service"}
        </Button>
      </div>
    </form>
  )
}
