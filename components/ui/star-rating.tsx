"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  maxRating?: number
  size?: "sm" | "md" | "lg"
  readonly?: boolean
}

export function StarRating({ rating, onRatingChange, maxRating = 5, size = "md", readonly = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const handleClick = (newRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  const handleMouseEnter = (newRating: number) => {
    if (!readonly) {
      setHoverRating(newRating)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1
        const isActive = starRating <= (hoverRating || rating)

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "transition-colors duration-150",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
              sizeClasses[size],
            )}
            onClick={() => handleClick(starRating)}
            onMouseEnter={() => handleMouseEnter(starRating)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            <Star
              className={cn(
                "transition-colors duration-150",
                isActive ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                sizeClasses[size],
              )}
            />
          </button>
        )
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  )
}
