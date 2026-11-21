"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Calendar,
  User,
  Shield,
  Plus,
  CreditCard,
  Users,
  LogOut,
  Scissors,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const CUSTOMER_NAV: NavItem[] = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/customer/my-appointments",
    label: "My Appointments",
    icon: Calendar,
  },
  { href: "/dashboard/customer/profile", label: "My Profile", icon: User },
]

const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  {
    href: "/dashboard/admin/manage-service",
    label: "Manage Services",
    icon: Shield,
  },
  {
    href: "/dashboard/admin/add-service",
    label: "Add/Update Service",
    icon: Plus,
  },
  {
    href: "/dashboard/admin/manage-appointment",
    label: "Manage Appointments",
    icon: Calendar,
  },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
  { href: "/dashboard/admin/profile", label: "My Profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  const user = session?.user as
    | { name?: string | null; email?: string | null; image?: string | null; role?: string }
    | undefined
  const isAdmin = user?.role === "admin"
  const navItems = isAdmin ? ADMIN_NAV : CUSTOMER_NAV
const router = useRouter()
  const handleSignout=()=>{
    signOut()
    router.replace("/sign-in")
  }

  return (
    <aside
      className={cn(
        "flex-shrink-0 border-r border-border bg-secondary text-foreground min-h-[100vh]",
        "transition-all duration-300 overflow-hidden",
        collapsed ? "w-16" : "w-64"
      )}
      aria-label="Dashboard navigation"
    >
      {/* Top: brand + collapse toggle */}
      <div className="flex h-14 items-center justify-between px-3 border-b border-border shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Go to home page"
        >
          <Scissors className="h-5 w-5 text-primary" aria-hidden="true" />
          {!collapsed && (
            <span className="font-[var(--font-playfair)] text-sm font-semibold text-foreground tracking-tight">
              SalonBook
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")} />
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom: user profile */}
      <div className="mt-auto px-3 py-4 border-t border-border shrink-0">
        <div className="flex items-center gap-3 px-1">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image as string} alt={user?.name || "Profile"} />
            <AvatarFallback>
              {(user?.name?.charAt(0) || user?.email?.charAt(0) || "P").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            {!collapsed && (
              <>
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || "Customer"}
                </p>
                <p className="text-xs text-muted-foreground truncate capitalize">
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </p>
              </>
            )}
          </div>
        </div>
        <Button
          onClick={handleSignout}
          variant="outline"
          size="sm"
          className={cn("w-full mt-2", collapsed && "justify-center px-2")}
        >
          {!collapsed && "Sign out"}
          <LogOut className={cn("h-4 w-4", collapsed && "ml-0")} />
        </Button>
      </div>
    </aside>
  )
}
