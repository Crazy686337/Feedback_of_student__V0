"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { FeedbackController } from "@/lib/controllers/feedback-controller"
import type { FeedbackData } from "@/lib/models/feedback-model"
import { formatDistanceToNow } from "date-fns"

export function RecentFeedbackList() {
  const [recentFeedback, setRecentFeedback] = useState<FeedbackData[]>([])

  useEffect(() => {
    const loadRecentFeedback = () => {
      const allFeedback = FeedbackController.getAllFeedback()
      const sorted = allFeedback
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
      setRecentFeedback(sorted)
    }

    loadRecentFeedback()
    const interval = setInterval(loadRecentFeedback, 30000)
    return () => clearInterval(interval)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-blue-100 text-blue-800"
      case "teacher":
        return "bg-green-100 text-green-800"
      case "facility":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (recentFeedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Latest feedback submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No feedback submitted yet. Be the first to share your thoughts!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
        <CardDescription>Latest feedback submissions from students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentFeedback.map((feedback) => (
            <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className={getTypeColor(feedback.type)}>
                    {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                  </Badge>
                  <h4 className="font-medium">{feedback.targetName}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <StarRating rating={feedback.rating} readonly size="sm" />
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(feedback.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
              {feedback.comment && <p className="text-sm text-muted-foreground line-clamp-2">{feedback.comment}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
