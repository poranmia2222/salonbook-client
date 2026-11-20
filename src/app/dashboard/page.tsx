"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"

export default function DashboardPage() {
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
    router.replace(role === "admin" ? "/dashboard/admin" : "/dashboard/customer")
  }, [isPending, router, session])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <p className="text-muted-foreground">Opening dashboard...</p>
    </div>
  )
}
