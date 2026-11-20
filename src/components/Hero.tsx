"use client"

import Link from "next/link"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const images = [
  "/banner_images/luckas-spalinger-lEaGWixL66s-unsplash.jpg",
  "/banner_images/its-dilman-U0ahbhEeUdE-unsplash.jpg",
  "/banner_images/mostafa-meraji-5npGPG0sSVk-unsplash.jpg",
  "/banner_images/vahid-kanani-4-QaKPwndmw-unsplash.jpg",
]

export function Hero() {
  const [current, setCurrent] = useState(0)

  const goTo = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6">
        <div
          className="grid min-h-[688px] grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1fr_480px] lg:gap-16 lg:py-16"
        >
          {/* Left: Content */}
          <div className="flex flex-col justify-center lg:py-4">
            <div
              className={cn(
                "mb-7 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em]",
                "border-primary/30 bg-primary/5 text-primary"
              )}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              New season, new look
            </div>

            <h1 className="mb-6 font-[var(--font-geist-sans)] text-[40px] font-bold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[50px]">
              Elevate Your Beauty,<br />
              <span className="text-transparent bg-clip-text gradient-text">
                One Booking Away
              </span>
            </h1>

            <p className="mb-8 max-w-[500px] text-base leading-7 text-muted-foreground md:text-[17px]">
              Premium salon services crafted just for you. From precision haircuts
              to relaxing spa treatments, look and feel your absolute best.
            </p>

            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Button
                href="/services"
                size="lg"
                className="flex h-[42px] w-full items-center justify-center gap-2 px-6 sm:w-auto"
              >
                Browse Services <ArrowRight className="h-5 w-5" />
              </Button>
              <Link
                href="/about"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Learn more
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>500+ Happy Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>4.9★ Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>Open 7 Days a Week</span>
              </div>
            </div>
          </div>

          {/* Right: Image slider */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div
              className={cn(
                "relative w-full max-w-[480px] overflow-hidden rounded-xl border border-border",
                "aspect-[4/5]"
              )}
            >
              <div className="relative h-full w-full">
                {images.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`Salon banner ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={cn(
                      "object-cover transition-opacity duration-1000 ease-in-out absolute inset-0",
                      i === current
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0"
                    )}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                ))}

                {/* Slide indicator dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300",
                        i === current
                          ? "bg-primary w-8"
                          : "bg-white/30 hover:bg-white/50"
                      )}
                      aria-label={`Slide ${i + 1}`}
                      aria-pressed={i === current}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
