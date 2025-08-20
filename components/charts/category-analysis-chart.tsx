"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { FeedbackController } from "@/lib/controllers/feedback-controller"

const chartConfig = {
  average: {
    label: "Average Rating",
    color: "hsl(var(--chart-2))",
  },
}

export function CategoryAnalysisChart() {
  const [chartData, setChartData] = useState<Array<{ category: string; average: number; fill: string }>>([])

  useEffect(() => {
    const loadCategoryData = () => {
      const allFeedback = FeedbackController.getAllFeedback()

      if (allFeedback.length === 0) {
        setChartData([])
        return
      }

      // Collect all category ratings
      const categoryTotals: { [key: string]: { sum: number; count: number } } = {}

      allFeedback.forEach((feedback) => {
        Object.entries(feedback.categories).forEach(([category, rating]) => {
          if (!categoryTotals[category]) {
            categoryTotals[category] = { sum: 0, count: 0 }
          }
          categoryTotals[category].sum += rating
          categoryTotals[category].count += 1
        })
      })

      // Calculate averages and format for chart
      const data = Object.entries(categoryTotals).map(([category, totals]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        average: Math.round((totals.sum / totals.count) * 10) / 10,
        fill: "hsl(var(--chart-2))",
      }))

      setChartData(data)
    }

    loadCategoryData()
    const interval = setInterval(loadCategoryData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Performance Analysis</CardTitle>
        <CardDescription>Average ratings across different evaluation categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis tickLine={false} axisLine={false} domain={[0, 5]} tickFormatter={(value) => `${value}★`} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(value) => [`${value}★`, "Average Rating"]} />}
              />
              <Bar dataKey="average" strokeWidth={2} radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
