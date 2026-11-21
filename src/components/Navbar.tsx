"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, Moon, Sun, X, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient, useSession } from "@/lib/auth-client"
import { AvatarDropdown } from "./ProfileAvatar"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/#about", label: "About" },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  )
  const isLoggedIn = !!session?.user

  const toggleTheme = () => {
    const nextIsDark = !isDark
    setIsDark(nextIsDark)
    document.documentElement.classList.toggle("dark", nextIsDark)
    document.documentElement.style.colorScheme = nextIsDark ? "dark" : "light"
    localStorage.setItem("theme", nextIsDark ? "dark" : "light")
  }

  const isActiveLink = (href: string) =>
    href === "/"
      ? pathname === "/"
      : href.startsWith("/#")
        ? false
        : pathname === href

  return (
    <nav className="relative z-20 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side: Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="SalonBook home"
            >
              <Scissors className="h-5 w-5 text-primary" aria-hidden="true" />
              <span
                className="font-[var(--font-playfair)] text-xl font-semibold text-foreground tracking-tight"
              >
                SalonBook
              </span>
            </Link>
          </div>

          {/* Middle: Navigation links */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActiveLink(link.href)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Auth actions */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Light theme" : "Dark theme"}
            >
              {isDark ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            {isLoggedIn && session?.user ? (
              <div className="hidden md:flex items-center gap-3">
                <p className="font-medium text-foreground">{session?.user.name}</p><AvatarDropdown/>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Sign in
                </Link>
                <Button href="/sign-up">Sign up</Button>
              </div>
            )}

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-muted-foreground hover:text-primary p-1"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 flex items-start">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-full md:w-80 bg-background border-l border-border shadow-2xl flex flex-col max-h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="SalonBook home"
              >
                <Scissors className="h-5 w-5 text-primary" aria-hidden="true" />
                <span
                  className="font-[var(--font-playfair)] text-xl font-semibold text-foreground tracking-tight"
                >
                  SalonBook
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-sm font-medium px-3 py-2.5 rounded-md ${
                    isActiveLink(link.href)
                      ? "bg-secondary text-primary-foreground"
                      : "text-primary hover:bg-secondary hover:text-primary-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-6 space-y-3">
                {isLoggedIn && session?.user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        void authClient.signOut()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Sign in
                    </Link>
                    <Button href="/sign-up" className="w-full">
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </nav>
  )
}
