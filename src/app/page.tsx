import { Hero } from "@/components/Hero"
import { HowItWorks } from "@/components/HowItWorks"
import { ServiceCategories } from "@/components/ServiceCategories"
import { AboutSection } from "@/components/AboutSection"
import { FeaturedServices } from "@/components/FeaturedServices"
import { getServices } from "@/lib/api/services"
import type { Service } from "@/lib/types/service"

export const instant = false

export default async function Home() {
  let services: Service[]

  try {
    services = await getServices()
  } catch {
    services = []
  }

  return (
    <div className="bg-background">
      <Hero />
      <FeaturedServices services={services} />
      <ServiceCategories services={services} />
      <HowItWorks />
      <AboutSection />
    </div>
  )
}
