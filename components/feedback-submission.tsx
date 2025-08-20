"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Building } from "lucide-react"
import { CourseFeedbackForm } from "@/components/forms/course-feedback-form"
import { TeacherFeedbackForm } from "@/components/forms/teacher-feedback-form"
import { FacilityFeedbackForm } from "@/components/forms/facility-feedback-form"

export function FeedbackSubmission() {
  const [selectedType, setSelectedType] = useState<"course" | "teacher" | "facility" | null>(null)

  const feedbackTypes = [
    {
      id: "course" as const,
      title: "Course Feedback",
      description: "Rate and review your courses, curriculum, and learning experience",
      icon: BookOpen,
      color: "text-chart-1",
    },
    {
      id: "teacher" as const,
      title: "Teacher Evaluation",
      description: "Provide feedback on teaching methods, communication, and support",
      icon: Users,
      color: "text-chart-2",
    },
    {
      id: "facility" as const,
      title: "Facility Review",
      description: "Share thoughts on classrooms, labs, library, and campus facilities",
      icon: Building,
      color: "text-chart-3",
    },
  ]

  if (selectedType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Submit Feedback</h1>
            <p className="text-muted-foreground">{feedbackTypes.find((t) => t.id === selectedType)?.description}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedType(null)}>
            Back to Selection
          </Button>
        </div>

        {selectedType === "course" && <CourseFeedbackForm />}
        {selectedType === "teacher" && <TeacherFeedbackForm />}
        {selectedType === "facility" && <FacilityFeedbackForm />}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Submit Feedback</h1>
        <p className="text-muted-foreground text-lg">Choose the type of feedback you'd like to provide</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feedbackTypes.map((type) => {
          const Icon = type.icon
          return (
            <Card
              key={type.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/20"
              onClick={() => setSelectedType(type.id)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
                  <Icon className={`h-8 w-8 ${type.color}`} />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription className="text-center">{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why Your Feedback Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-2">Improve Quality</div>
              <p className="text-sm text-muted-foreground">
                Help enhance the quality of education and campus facilities
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-2">Drive Change</div>
              <p className="text-sm text-muted-foreground">Your input directly influences institutional decisions</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-2">Build Community</div>
              <p className="text-sm text-muted-foreground">
                Foster a collaborative environment for continuous improvement
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
