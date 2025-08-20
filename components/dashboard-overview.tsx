"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, BookOpen, Star, BarChart3, TrendingUp } from "lucide-react"
import { FeedbackController } from "@/lib/controllers/feedback-controller"
import { FeedbackChart } from "@/components/charts/feedback-chart"
import { RatingDistributionChart } from "@/components/charts/rating-distribution-chart"
import { CategoryAnalysisChart } from "@/components/charts/category-analysis-chart"
import type { AnalyticsData } from "@/lib/models/feedback-model"

export function DashboardOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = () => {
      try {
        const data = FeedbackController.getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()
    // Refresh data every 30 seconds to show real-time updates
    const interval = setInterval(loadAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return <div className="text-center py-12 text-muted-foreground">Failed to load analytics data</div>
  }

  const stats = [
    {
      title: "Total Feedback",
      value: analytics.totalFeedback.toString(),
      description: "Feedback submissions",
      icon: MessageSquare,
      color: "text-chart-1",
      change: "+12%",
    },
    {
      title: "Courses Rated",
      value: analytics.coursesRated.toString(),
      description: "Courses evaluated",
      icon: BookOpen,
      color: "text-chart-2",
      change: "+8%",
    },
    {
      title: "Teachers Rated",
      value: analytics.teachersRated.toString(),
      description: "Teachers evaluated",
      icon: Users,
      color: "text-chart-3",
      change: "+15%",
    },
    {
      title: "Average Rating",
      value: analytics.averageRating.toFixed(1),
      description: "Overall satisfaction",
      icon: Star,
      color: "text-chart-4",
      change: "+0.2",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedbackChart />
        <RatingDistributionChart data={analytics.ratingDistribution} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CategoryAnalysisChart />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started by submitting your first feedback or exploring analytics</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1">
            <MessageSquare className="mr-2 h-4 w-4" />
            Submit Course Feedback
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Users className="mr-2 h-4 w-4" />
            Rate a Teacher
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Detailed Analytics
          </Button>
        </CardContent>
      </Card>

      {/* MVC Architecture Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
          <CardDescription>
            This system follows MVC (Model-View-Controller) pattern for clean separation of concerns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Model</h3>
              <p className="text-sm text-muted-foreground">
                Data management with LocalStorage for feedback, courses, and analytics
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-primary mb-2">View</h3>
              <p className="text-sm text-muted-foreground">
                React components for UI presentation and user interactions
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-primary mb-2">Controller</h3>
              <p className="text-sm text-muted-foreground">Business logic handling user actions and data flow</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
