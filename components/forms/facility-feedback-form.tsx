"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StarRating } from "@/components/ui/star-rating"
import { FeedbackController } from "@/lib/controllers/feedback-controller"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle } from "lucide-react"

export function FacilityFeedbackForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    facilityType: "",
    facilityName: "",
    overallRating: 0,
    categories: {
      cleanliness: 0,
      accessibility: 0,
      equipment: 0,
      comfort: 0,
    },
    comment: "",
  })

  const facilityTypes = [
    { value: "classroom", label: "Classroom" },
    { value: "laboratory", label: "Laboratory" },
    { value: "library", label: "Library" },
    { value: "cafeteria", label: "Cafeteria" },
    { value: "restroom", label: "Restroom" },
    { value: "parking", label: "Parking" },
    { value: "sports", label: "Sports Facility" },
    { value: "other", label: "Other" },
  ]

  const handleCategoryRating = (category: string, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: rating,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = FeedbackController.submitFeedback({
        type: "facility",
        targetId: `${formData.facilityType}-${Date.now()}`,
        targetName: formData.facilityName || formData.facilityType,
        rating: formData.overallRating,
        comment: formData.comment,
        categories: formData.categories,
      })

      if (success) {
        setIsSubmitted(true)
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your facility feedback!",
        })
      } else {
        throw new Error("Failed to submit feedback")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Feedback Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-6">Thank you for helping us improve our facilities.</p>
          <Button onClick={() => setIsSubmitted(false)}>Submit Another Feedback</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Facility Information</CardTitle>
          <CardDescription>Tell us about the facility you want to review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facilityType">Facility Type</Label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, facilityType: value }))} required>
              <SelectTrigger>
                <SelectValue placeholder="Select facility type" />
              </SelectTrigger>
              <SelectContent>
                {facilityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="facilityName">Specific Location/Name (Optional)</Label>
            <Input
              id="facilityName"
              placeholder="e.g., Room 101, Main Library, North Parking Lot"
              value={formData.facilityName}
              onChange={(e) => setFormData((prev) => ({ ...prev, facilityName: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Rating</CardTitle>
          <CardDescription>Rate your overall experience with this facility</CardDescription>
        </CardHeader>
        <CardContent>
          <StarRating
            rating={formData.overallRating}
            onRatingChange={(rating) => setFormData((prev) => ({ ...prev, overallRating: rating }))}
            size="lg"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Ratings</CardTitle>
          <CardDescription>Rate specific aspects of the facility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { key: "cleanliness", label: "Cleanliness & Maintenance" },
            { key: "accessibility", label: "Accessibility" },
            { key: "equipment", label: "Equipment & Resources" },
            { key: "comfort", label: "Comfort & Environment" },
          ].map((category) => (
            <div key={category.key} className="flex items-center justify-between">
              <Label className="text-sm font-medium">{category.label}</Label>
              <StarRating
                rating={formData.categories[category.key as keyof typeof formData.categories]}
                onRatingChange={(rating) => handleCategoryRating(category.key, rating)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Comments</CardTitle>
          <CardDescription>Share specific feedback about what works well and what needs improvement</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What do you like about this facility? What improvements would you suggest?"
            value={formData.comment}
            onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.facilityType || formData.overallRating === 0}>
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </form>
  )
}
