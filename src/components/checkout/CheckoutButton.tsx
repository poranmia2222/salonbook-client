"use client"

import { useState } from "react"
import { CreditCard, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function readCheckoutResponse(payload: unknown) {
  if (typeof payload !== "object" || payload === null) {
    return { url: undefined, message: undefined }
  }

  return {
    url:
      "url" in payload && typeof payload.url === "string"
        ? payload.url
        : undefined,
    message:
      "error" in payload && typeof payload.error === "string"
        ? payload.error
        : undefined,
  }
}

export function CheckoutButton({appointmentId,}: {appointmentId: string}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId }),
      })
      const result = readCheckoutResponse(await response.json())

      if (!response.ok || !result.url) {
        throw new Error(result.message || "Unable to start checkout.")
      }

      window.location.assign(result.url)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to start checkout. Please try again."
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={startCheckout}
        disabled={isLoading || !appointmentId}
        className="h-11 w-full gap-2 shadow-sm shadow-primary/20"
      >
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <CreditCard className="h-4 w-4" aria-hidden="true" />
        )}
        {isLoading ? "Preparing secure checkout..." : "Continue to payment"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
