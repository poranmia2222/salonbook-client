import { ArrowLeft, Scissors } from "lucide-react"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Page Not Found - SalonBook",
  description: "The page you requested could not be found.",
}

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader className="items-center px-6 pb-4 pt-8">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
            <Scissors className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Error 404
          </p>
          <CardTitle className="mt-2 text-2xl sm:text-3xl">
            Page not found
          </CardTitle>
          <CardDescription className="mx-auto mt-2 max-w-sm leading-6">
            This page may have moved or the address may be incorrect.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Button>
            <Button href="/services" variant="outline">
              Browse services
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
