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

export function TeacherFeedbackForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    teacherId: "",
    teacherName: "",
    overallRating: 0,
    categories: {
      teaching: 0,
      communication: 0,
      availability: 0,
      fairness: 0,
      knowledge: 0,
    },
    comment: "",
  })

  const teachers = FeedbackController.getTeachers()

  const handleTeacherSelect = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    setFormData((prev) => ({
      ...prev,
      teacherId,
      teacherName: teacher ? teacher.name : "",
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
        type: "teacher",
        targetId: formData.teacherId,
        targetName: formData.teacherName,
        rating: formData.overallRating,
        comment: formData.comment,
        categories: formData.categories,
      })

      if (success) {
        setIsSubmitted(true)
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your teacher evaluation!",
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
          <h2 className="text-2xl font-bold mb-2">Evaluation Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-6">Thank you for helping us improve our teaching quality.</p>
          <Button onClick={() => setIsSubmitted(false)}>Submit Another Evaluation</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
          <CardDescription>Select the teacher you want to evaluate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="teacher">Teacher</Label>
            <Select onValueChange={handleTeacherSelect} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.department}
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
          <CardDescription>Rate your overall experience with this teacher</CardDescription>
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
          <CardTitle>Detailed Evaluation</CardTitle>
          <CardDescription>Rate specific aspects of the teacher's performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { key: "teaching", label: "Teaching Effectiveness" },
            { key: "communication", label: "Communication Skills" },
            { key: "availability", label: "Availability & Support" },
            { key: "fairness", label: "Fair Assessment" },
            { key: "knowledge", label: "Subject Knowledge" },
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
          <CardDescription>
            Share specific feedback about the teacher's strengths and areas for improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What teaching methods worked well? How could the teacher improve?"
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
        <Button type="submit" disabled={isSubmitting || !formData.teacherId || formData.overallRating === 0}>
          {isSubmitting ? "Submitting..." : "Submit Evaluation"}
        </Button>
      </div>
    </form>
  )
}
