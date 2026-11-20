"use client"

import { getServiceById } from "@/lib/api/services"
import { Service } from "@/lib/types/service"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock3,
  RefreshCw,
  Star,
} from "lucide-react"
import { Suspense, use, useEffect, useState, type FormEvent } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "@/lib/auth-client"
import { useToast } from "@/components/ui/use-toast"
import { bookAppointment } from "@/lib/action/appointment"

function ServiceLoading() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-32 rounded-full bg-secondary animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading service...</p>
      </div>
    </div>
  )
}

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={<ServiceLoading />}>
      <ServiceDetailsContent params={params} />
    </Suspense>
  )
}

function ServiceDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [service, setService] = useState<Service | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { data: session } = useSession()
  const { toast } = useToast()
  const user = session?.user as
    | {
      id: string
      name?: string | null
      email?: string | null
      role?: string
    }
    | undefined

  useEffect(() => {
    let mounted = true
    const fetchService = async () => {
      try {
        const data = await getServiceById(id)
        if (mounted) {
          setService(data)
          setLoading(false)
          if (!data) {
            setError("Service not found")
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load service")
          setLoading(false)
        }
      }
    }
    fetchService()
    return () => {
      mounted = false
    }
  }, [id, retryCount])

  if (loading) {
    return <ServiceLoading />
  }

  if (error || !service) {
    const isNotFound = error === "Service not found"

    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold text-foreground">
            {isNotFound ? "Service not found" : "Unable to load service"}
          </h1>
          <p className="text-muted-foreground">
            {error || "The service you are looking for does not exist."}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {!isNotFound && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setError(null)
                  setLoading(true)
                  setRetryCount((count) => count + 1)
                }}
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </Button>
            )}
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ChevronLeft className="h-4 w-4" /> Back to services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const discountPrice = service.discountPrice ?? null
  const showDiscount = discountPrice !== null && discountPrice < service.price
  const effectivePrice = showDiscount ? discountPrice : service.price
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in before requesting an appointment.",
      });
      return;
    }

    if (user.role !== "customer") {
      toast({
        variant: "destructive",
        title: "Customer account required",
        description: "Only customers can request an appointment.",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Exclude the service MongoDB _id
    const { _id, ...serviceData } = service;
    const serviceId = _id
    const appointmentData = {
      ...data,
      ...serviceData,
      serviceId:serviceId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      totalPrice: effectivePrice,
      status: "pending",
      payment: 'unpaid'
    };

    try {
      console.log("Appointment payload:", appointmentData);

      await bookAppointment(appointmentData);

      toast({
        title: "Appointment requested",
        description: `Your request for ${service.serviceName} has been submitted.`,
      });
    } catch (err) {
      console.error("Appointment submission error:", err);

      toast({
        variant: "destructive",
        title: "Request failed",
        description:
          err instanceof Error
            ? err.message
            : "Unable to request an appointment.",
      });
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <nav className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to services
        </Link>
      </nav>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-secondary shadow-xl shadow-black/20">
          <div className="aspect-[16/8] max-h-[520px] min-h-56 w-full overflow-hidden sm:aspect-[16/7]">
            <img
              src={service.image}
              alt={service.serviceName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-6">
            {service.featured && (
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                <Star className="h-3.5 w-3.5 fill-current" />
                Featured service
              </span>
            )}
            {!service.availability && (
              <span className="ml-auto rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-destructive shadow-lg backdrop-blur">
                Currently unavailable
              </span>
            )}
          </div>
        </div>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <Card className="overflow-hidden border-border bg-secondary/30">
              <CardContent className="space-y-5 p-5 sm:p-7">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {service.category}
                  </span>
                  {service.subCategory && (
                    <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {service.subCategory}
                    </span>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {service.serviceName}
                  </h1>
                  <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    {showDiscount && (
                      <span className="text-base text-muted-foreground line-through">
                        ${service.price.toFixed(2)}
                      </span>
                    )}
                    <span className="text-3xl font-bold tracking-tight text-foreground">
                      ${effectivePrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per service
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4 text-primary" />
                      {service.duration} min
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                      {service.rating.toFixed(1)}
                      {service.totalReviews > 0 && ` (${service.totalReviews})`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(service.benefits?.length > 0 ||
              service.includes?.length > 0 ||
              service.suitableFor?.length > 0 ||
              service.tags?.length > 0 ||
              service.preparation ||
              service.aftercare) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {service.benefits?.length > 0 && (
                    <Card className="border-border bg-background">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Benefits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {service.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span className="text-sm leading-6 text-muted-foreground">
                                {benefit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {service.includes?.length > 0 && (
                    <Card className="border-border bg-background">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">What&rsquo;s included</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {service.includes.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span className="text-sm leading-6 text-muted-foreground">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {service.suitableFor?.length > 0 && (
                    <Card className="border-border bg-background">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Suitable for</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {service.suitableFor.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {service.tags?.length > 0 && (
                    <Card className="border-border bg-background">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Service tags</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

            {(service.preparation || service.aftercare) && (
              <Card className="border-border bg-background">
                <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                  {service.preparation && (
                    <div>
                      <h2 className="font-semibold text-foreground">Before your visit</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {service.preparation}
                      </p>
                    </div>
                  )}
                  {service.aftercare && (
                    <div>
                      <h2 className="font-semibold text-foreground">Aftercare</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {service.aftercare}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="border-border bg-secondary/30 lg:sticky lg:top-6">
            <CardHeader className="space-y-2 pb-4">
              <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Book an appointment</CardTitle>
              <CardDescription>
                Select a date and time that works for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appointment-date">Preferred date</Label>
                  <Input
                    id="appointment-date"
                    name="date"
                    type="date"
                    required
                    disabled={!service.availability}
                    className="[color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment-time">Preferred time</Label>
                  <Input
                    id="appointment-time"
                    name="time"
                    type="time"
                    required
                    disabled={!service.availability}
                    className="[color-scheme:dark]"
                  />
                </div>
                <div className="rounded-lg border border-border bg-background/70 p-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Service total</span>
                    <span className="font-semibold text-foreground">
                      ${effectivePrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {service.duration} minutes · {service.serviceName}
                  </p>
                </div>
                <Button
                  type="submit"
                  className="h-11 w-full gap-2"
                  disabled={!service.availability}
                >
                  <CalendarDays className="h-4 w-4" />
                  {service.availability ? "Request appointment" : "Unavailable"}
                </Button>
                <p className="text-center text-xs leading-5 text-muted-foreground">
                  Appointment requests are subject to salon availability.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
