"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient, useSession } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function AvatarDropdown() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user as { role?: string } | undefined
  const profileHref =
    user?.role === "admin"
      ? "/dashboard/admin/profile"
      : "/dashboard/customer/profile"
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState("")

  const handleSignout = async () => {
    setIsSigningOut(true)
    setSignOutError("")

    try {
      const { error } = await authClient.signOut()

      if (error) {
        setSignOutError(error.message ?? "Unable to sign out. Please try again.")
        setMenuOpen(true)
        return
      }

      router.replace("/sign-in")
      router.refresh()
    } catch (error) {
      setSignOutError(
        error instanceof Error ? error.message : "Unable to sign out. Please try again."
      )
      setMenuOpen(true)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full border border-border bg-secondary p-1"
            aria-label="Open profile menu"
          >
            <Avatar>
              <AvatarImage
                src={session?.user.image as string}
                alt={session?.user.name || "Profile"}
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-48 border border-border bg-secondary p-1.5 shadow-2xl"
      >
        <DropdownMenuGroup className="p-0 text-white">
          <DropdownMenuItem className="cursor-pointer px-3 py-2">

            <h2>{session?.user.name}</h2>
          </DropdownMenuItem>
          <DropdownMenuItem><Link href={'/dashboard'}>Dashboard</Link></DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={profileHref}>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleSignout}
            disabled={isSigningOut}
            variant="destructive"
          >
            {isSigningOut ? "Signing out..." : "Log out"}
          </DropdownMenuItem>
          {signOutError && (
            <p className="px-3 py-2 text-sm text-destructive" role="alert">
              {signOutError}
            </p>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
