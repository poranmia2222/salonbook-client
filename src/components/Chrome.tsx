"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function Chrome({ children }: { children: React.ReactNode }) {
  const [isDashboard, setIsDashboard] = useState(false)

  useEffect(() => {
    setIsDashboard(typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard"))
  }, [])

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Footer />}
    </>
  )
}
