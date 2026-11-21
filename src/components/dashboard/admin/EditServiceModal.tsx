"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { ImagePlus, Loader2, UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateService } from "@/lib/api/services"
import { Service } from "@/lib/types/service"

interface EditServiceModalProps {
  service: Service
  onClose: () => void
  onSaved: (service: Service) => void
}

export function EditServiceModal({
  service,
  onClose,
  onSaved,
}: EditServiceModalProps) {
  const [values, setValues] = useState({
    serviceName: service.serviceName,
    category: service.category,
    subCategory: service.subCategory,
    description: service.description,
    duration: String(service.duration),
    price: String(service.price),
    discountPrice: service.discountPrice ? String(service.discountPrice) : "",
    availability: service.availability,
    featured: service.featured,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleChange = (field: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setImageFile(file)

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(file ? URL.createObjectURL(file) : "")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!service._id) return

    setSaving(true)
    setError("")

    try {
      let imageUrl = service.image

      if (imageFile) {
        const imageData = new FormData()
        imageData.append("image", imageFile)

        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: imageData,
        })
        const uploadResult = await uploadResponse.json()

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.message || "The image could not be uploaded"
          )
        }

        imageUrl = uploadResult.imageUrl
      }

      const updatedService = await updateService(service._id, {
        serviceName: values.serviceName.trim(),
        category: values.category,
        subCategory: values.subCategory,
        description: values.description.trim(),
        duration: Number(values.duration),
        price: Number(values.price),
        discountPrice:
          values.discountPrice === "" ? null : Number(values.discountPrice),
        availability: values.availability,
        featured: values.featured,
        image: imageUrl,
      })
      onSaved({
        ...service,
        ...updatedService,
        serviceName: values.serviceName.trim(),
        category: values.category,
        subCategory: values.subCategory,
        description: values.description.trim(),
        duration: Number(values.duration),
        price: Number(values.price),
        discountPrice:
          values.discountPrice === "" ? null : Number(values.discountPrice),
        availability: values.availability,
        featured: values.featured,
        image: imageUrl,
      })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save this service."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-service-title"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto"
      >
        <Card className="shadow-2xl">
          <CardHeader className="flex-row items-start justify-between space-y-0 border-b border-border">
            <div>
              <CardTitle id="edit-service-title" className="text-xl">
                Edit service
              </CardTitle>
              <CardDescription className="mt-2">
                Update the service information.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="grid gap-4 pt-5">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}

          <div>
            <Label className="mb-2 block">Service image</Label>
            <label className="group relative flex h-52 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-background transition-colors hover:border-primary/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl || service.image}
                alt={values.serviceName || "Service"}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/70 px-3 py-2.5 text-xs font-medium text-white">
                {previewUrl ? (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    New image selected
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4" />
                    Click to reupload image
                  </>
                )}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
            <p className="mt-1.5 text-xs text-muted-foreground">
              JPG, PNG or WebP, up to 5 MB
            </p>
          </div>

          <div>
            <Label htmlFor="edit-name">
              Service name
            </Label>
            <Input
              id="edit-name"
              value={values.serviceName}
              onChange={(event) => handleChange("serviceName", event.target.value)}
              className="mt-2"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-category">
                Category
              </Label>
              <Input
                id="edit-category"
                value={values.category}
                onChange={(event) => handleChange("category", event.target.value)}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-subcategory">
                Sub-category
              </Label>
              <Input
                id="edit-subcategory"
                value={values.subCategory}
                onChange={(event) => handleChange("subCategory", event.target.value)}
                className="mt-2"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-description">
              Description
            </Label>
            <textarea
              id="edit-description"
              value={values.description}
              onChange={(event) => handleChange("description", event.target.value)}
              rows={4}
              className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="edit-duration">
                Duration
              </Label>
              <Input
                id="edit-duration"
                type="number"
                min="1"
                value={values.duration}
                onChange={(event) => handleChange("duration", event.target.value)}
                className="mt-2 [color-scheme:dark]"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-price">
                Price
              </Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                value={values.price}
                onChange={(event) => handleChange("price", event.target.value)}
                className="mt-2 [color-scheme:dark]"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-discount">
               After Discount Price
              </Label>
              <Input
                id="edit-discount"
                type="number"
                min="0"
                value={values.discountPrice}
                onChange={(event) => handleChange("discountPrice", event.target.value)}
                className="mt-2 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Label className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <span>Available for booking</span>
              <input
                type="checkbox"
                checked={values.availability}
                onChange={(event) =>
                  handleChange("availability", event.target.checked)
                }
                className="h-4 w-4 accent-[hsl(342_78%_60%)]"
              />
            </Label>
            <Label className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <span>Featured service</span>
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(event) =>
                  handleChange("featured", event.target.checked)
                }
                className="h-4 w-4 accent-[hsl(342_78%_60%)]"
              />
            </Label>
          </div>
          </CardContent>

          <CardFooter className="justify-end gap-3 border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
