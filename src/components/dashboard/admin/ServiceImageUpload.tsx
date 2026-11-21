"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { ImagePlus, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceImageUploadProps {
  onChange: (file: File | null) => void
  error?: string
}

export function ServiceImageUpload({
  onChange,
  error,
}: ServiceImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl("")
    }

    onChange(file)
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        Service image
      </label>

      <label
        className={cn(
          "flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed bg-secondary/30 p-4 text-center transition-colors hover:border-primary/70",
          error ? "border-destructive" : "border-border"
        )}
      >
        {previewUrl ? (
          <div className="relative h-56 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="New service preview"
              className="h-full w-full rounded-lg object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center rounded-b-lg bg-black/70 px-3 py-2 text-xs text-white">
              <UploadCloud className="mr-2 h-4 w-4" />
              Choose a different image
            </div>
          </div>
        ) : (
          <>
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ImagePlus className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium text-foreground">
              Click to upload an image
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              JPG, PNG or WebP, up to 5 MB
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="sr-only"
          aria-describedby={error ? "service-image-error" : undefined}
        />
      </label>

      {error && (
        <p id="service-image-error" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
