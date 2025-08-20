"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { DashboardOverview } from "@/components/dashboard-overview"
import { FeedbackSubmission } from "@/components/feedback-submission"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "feedback":
        return <FeedbackSubmission />
      case "analytics":
        return <AnalyticsDashboard />
      case "settings":
        return <div className="text-center py-12 text-muted-foreground">Settings coming soon...</div>
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Student Feedback System</h1>
            <p className="text-muted-foreground text-lg">
              Share your thoughts on courses, teachers, and facilities to help improve our academic environment
            </p>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  )
}
