
"use client"

import { useState } from "react"
import { LockKeyhole, LockKeyholeOpen, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { authClient } from "@/lib/auth-client"
import type { User } from "@/lib/types/service"

interface UserTableActionsProps {
  user: User
}

export function UserTableActions({ user }: UserTableActionsProps) {
  const [loading, setLoading] = useState(false)
  const [banned, setBanned] = useState(user.banned ?? user.blocked ?? false)
  const router = useRouter()
  const { toast } = useToast()
  const userId = user.id || user._id

  const handleBlockUser = async () => {
    if (user.role === "admin") {
      toast({
        title: "Action not allowed",
        description: "You cannot block an admin.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await authClient.admin.banUser({
        userId,
        banReason: "Blocked by administrator",
      })

      if (error) throw new Error(error.message)

      setBanned(true)
      toast({
        title: "User blocked",
        description: `${user.name} has been blocked successfully.`,
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Unable to block user",
        description:
          error instanceof Error ? error.message : "Failed to block user.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnblockUser = async () => {
    setLoading(true)

    try {
      const { error } = await authClient.admin.unbanUser({
        userId,
      })

      if (error) throw new Error(error.message)

      setBanned(false)
      toast({
        title: "User unblocked",
        description: `${user.name} has been unblocked successfully.`,
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Unable to unblock user",
        description:
          error instanceof Error ? error.message : "Failed to unblock user.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (user.role === "admin") {
    return (
      <div className="flex justify-end">
        <Button variant="outline" size="sm" disabled>
          Admin
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-end gap-2">
      {!banned ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBlockUser}
          disabled={loading}
          className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Block ${user.name}`}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LockKeyhole className="h-3.5 w-3.5" />
          )}
          {loading ? "Processing..." : "Block"}
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUnblockUser}
          disabled={loading}
          className="gap-1.5 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
          aria-label={`Unblock ${user.name}`}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LockKeyholeOpen className="h-3.5 w-3.5" />
          )}
          {loading ? "Processing..." : "Unblock"}
        </Button>
      )}
    </div>
  )
}
