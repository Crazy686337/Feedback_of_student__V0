"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { FeedbackController } from "@/lib/controllers/feedback-controller"

const chartConfig = {
  course: {
    label: "Course Feedback",
    color: "hsl(var(--chart-1))",
  },
  teacher: {
    label: "Teacher Evaluations",
    color: "hsl(var(--chart-2))",
  },
  facility: {
    label: "Facility Reviews",
    color: "hsl(var(--chart-3))",
  },
}

export function FeedbackChart() {
  const [chartData, setChartData] = useState<Array<{ type: string; count: number; fill: string }>>([])

  useEffect(() => {
    const loadChartData = () => {
      const allFeedback = FeedbackController.getAllFeedback()

      const courseFeedback = allFeedback.filter((f) => f.type === "course").length
      const teacherFeedback = allFeedback.filter((f) => f.type === "teacher").length
      const facilityFeedback = allFeedback.filter((f) => f.type === "facility").length

      setChartData([
        {
          type: "Courses",
          count: courseFeedback,
          fill: chartConfig.course.color,
        },
        {
          type: "Teachers",
          count: teacherFeedback,
          fill: chartConfig.teacher.color,
        },
        {
          type: "Facilities",
          count: facilityFeedback,
          fill: chartConfig.facility.color,
        },
      ])
    }

    loadChartData()
    const interval = setInterval(loadChartData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback by Category</CardTitle>
        <CardDescription>Distribution of feedback across different categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="type"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" strokeWidth={2} radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
