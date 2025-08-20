"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartConfig = {
  count: {
    label: "Number of Ratings",
    color: "hsl(var(--chart-1))",
  },
}

interface RatingDistributionChartProps {
  data: { [key: number]: number }
}

export function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  const chartData = Array.from({ length: 5 }, (_, i) => ({
    rating: `${i + 1} Star${i + 1 > 1 ? "s" : ""}`,
    count: data[i + 1] || 0,
    fill: "hsl(var(--chart-1))",
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
        <CardDescription>How ratings are distributed across all feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="rating"
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
