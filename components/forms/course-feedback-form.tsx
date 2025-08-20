"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StarRating } from "@/components/ui/star-rating"
import { FeedbackController } from "@/lib/controllers/feedback-controller"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle } from "lucide-react"

export function CourseFeedbackForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    courseId: "",
    courseName: "",
    overallRating: 0,
    categories: {
      content: 0,
      difficulty: 0,
      workload: 0,
      organization: 0,
    },
    comment: "",
  })

  const courses = FeedbackController.getCourses()

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    setFormData((prev) => ({
      ...prev,
      courseId,
      courseName: course ? `${course.code} - ${course.name}` : "",
    }))
  }

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
        type: "course",
        targetId: formData.courseId,
        targetName: formData.courseName,
        rating: formData.overallRating,
        comment: formData.comment,
        categories: formData.categories,
      })

      if (success) {
        setIsSubmitted(true)
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your course feedback!",
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
          <p className="text-muted-foreground mb-6">Thank you for helping us improve our courses.</p>
          <Button onClick={() => setIsSubmitted(false)}>Submit Another Feedback</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Select the course you want to provide feedback for</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="course">Course</Label>
            <Select onValueChange={handleCourseSelect} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Rating</CardTitle>
          <CardDescription>Rate your overall experience with this course</CardDescription>
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
          <CardDescription>Rate specific aspects of the course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { key: "content", label: "Course Content Quality" },
            { key: "difficulty", label: "Appropriate Difficulty Level" },
            { key: "workload", label: "Reasonable Workload" },
            { key: "organization", label: "Course Organization" },
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
          <CardDescription>Share any additional thoughts or suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What did you like most about this course? What could be improved?"
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
        <Button type="submit" disabled={isSubmitting || !formData.courseId || formData.overallRating === 0}>
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </div>
    </form>
  )
}
