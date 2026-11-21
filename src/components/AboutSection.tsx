import Image from "next/image"
import { Award, Heart, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  const highlights = [
    { label: "Experienced team", icon: Award },
    { label: "Personal care", icon: Heart },
    { label: "Happy clients", icon: Users },
  ]

  return (
    <section id="about" className="bg-background py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-border">
          <Image
            src="/banner_images/its-dilman-U0ahbhEeUdE-unsplash.jpg"
            alt="Professional salon interior"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-primary">About SalonBook</p>
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold leading-tight text-foreground md:text-4xl">
            Beauty care, made personal
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            SalonBook brings trusted beauty professionals and thoughtfully
            designed salon experiences together in one simple place. Every
            visit is planned around your style, comfort, and needs.
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Browse clear services, choose a convenient appointment, and enjoy
            professional care from consultation to finishing.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {highlights.map(({ label, icon: Icon }) => (
              <Card key={label} className="bg-secondary/20">
                <CardContent className="flex items-center gap-3 p-4">
                  <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
