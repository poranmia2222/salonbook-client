"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"

export default function CustomerPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (isPending) {
      return
    }

    if (!session) {
      router.replace("/sign-in")
      return
    }

    const role = (session.user as typeof session.user & { role?: string }).role

    // Only customers can access the customer dashboard
    if (role === "admin") {
      router.replace("/dashboard/admin")
      return
    }
  }, [isPending, router, session])

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  // While a redirect is in flight, render nothing to avoid a content flash
  if (!session) {
    return null
  }

  const role = (session.user as typeof session.user & { role?: string }).role
  if (role === "admin") {
    return null
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground">
        Customer Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your appointments and profile.
      </p>
    </>
  )
}
