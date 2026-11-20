"use client"

import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <ChromeContent>{children}</ChromeContent>
    </Suspense>
  )
}

function ChromeContent({ children }: { children: React.ReactNode }) {
  const isDashboard = usePathname().startsWith("/dashboard")
  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  )
}
