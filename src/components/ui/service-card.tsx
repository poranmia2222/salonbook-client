"use client"

import Link from "next/link"
import { Service } from "@/lib/types/service"
import { cn } from "@/lib/utils"
import {
  Star,
  Clock,
  ChevronRight,
} from "lucide-react"

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const discountPrice = service.discountPrice ?? null
  const showDiscount = discountPrice !== null && discountPrice < service.price
  const effectivePrice = showDiscount ? discountPrice : service.price

  return (
    <Link
      href={`/services/${service._id}`}
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-background hover:border-primary/50 transition-all duration-300 overflow-hidden"
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.serviceName}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!service.availability && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-3 py-1 rounded-md bg-destructive text-destructive-foreground text-xs font-medium">
              Unavailable
            </span>
          </div>
        )}
        {service.featured && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
          <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium uppercase tracking-tighter">
            {service.category}
          </span>
          {service.subCategory && (
            <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium uppercase tracking-tighter">
              {service.subCategory}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
          {service.serviceName}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
          {service.description}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3">
          {showDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${service.price.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold text-foreground">
            ${effectivePrice.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            /service
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{service.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
            <span>
              {service.rating.toFixed(1)}
              {service.totalReviews > 0 ? ` (${service.totalReviews})` : ""}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {service.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              View Details
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}
