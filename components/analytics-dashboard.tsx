"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedbackController } from "@/lib/controllers/feedback-controller"
import { FeedbackChart } from "@/components/charts/feedback-chart"
import { RatingDistributionChart } from "@/components/charts/rating-distribution-chart"
import { CategoryAnalysisChart } from "@/components/charts/category-analysis-chart"
import { RecentFeedbackList } from "@/components/recent-feedback-list"
import type { AnalyticsData } from "@/lib/models/feedback-model"

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const loadAnalytics = () => {
      const data = FeedbackController.getAnalytics()
      setAnalytics(data)
    }

    loadAnalytics()
    const interval = setInterval(loadAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!analytics) {
    return <div className="text-center py-12 text-muted-foreground">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-lg">Comprehensive insights into feedback trends and patterns</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FeedbackChart />
            <RatingDistributionChart data={analytics.ratingDistribution} />
          </div>
          <CategoryAnalysisChart />
        </TabsContent>

        <TabsContent value="ratings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RatingDistributionChart data={analytics.ratingDistribution} />
            <Card>
              <CardHeader>
                <CardTitle>Rating Statistics</CardTitle>
                <CardDescription>Key metrics about rating patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Rating</span>
                  <span className="text-2xl font-bold text-primary">{analytics.averageRating}★</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Ratings</span>
                  <span className="text-2xl font-bold">{analytics.totalFeedback}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Satisfaction Rate</span>
                  <span className="text-2xl font-bold text-green-600">
                    {analytics.totalFeedback > 0
                      ? Math.round(
                          (Object.entries(analytics.ratingDistribution)
                            .filter(([rating]) => Number.parseInt(rating) >= 4)
                            .reduce((sum, [, count]) => sum + count, 0) /
                            analytics.totalFeedback) *
                            100,
                        )
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryAnalysisChart />
          <Card>
            <CardHeader>
              <CardTitle>Category Insights</CardTitle>
              <CardDescription>Performance analysis across evaluation categories</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This analysis shows how different aspects of courses, teachers, and facilities are performing based on
                student feedback. Higher ratings indicate areas of strength, while lower ratings highlight opportunities
                for improvement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <RecentFeedbackList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
