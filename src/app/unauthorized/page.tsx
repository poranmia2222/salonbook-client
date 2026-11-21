import type { Metadata } from "next"
import { ArrowLeft, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Access Denied - SalonBook",
  description: "You don't have permission to access this page.",
}

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="items-center px-6 pb-4 pt-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-destructive">
            Error 403
          </p>
          <CardTitle className="mt-2 text-2xl">Access denied</CardTitle>
          <CardDescription className="mt-2 max-w-sm leading-6">
            You don&apos;t have permission to view this page. Sign in with an
            authorized account or return home.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col justify-center gap-3 pb-8 sm:flex-row">
          <Button href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Button>
          <Button href="/sign-in" variant="outline">
            Sign in
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
