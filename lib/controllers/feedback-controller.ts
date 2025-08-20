// Controller layer - Business logic and data flow management
import { FeedbackModel, type FeedbackData, type AnalyticsData } from "@/lib/models/feedback-model"

export class FeedbackController {
  static submitFeedback(feedbackData: Omit<FeedbackData, "id" | "timestamp">): boolean {
    try {
      const feedback: FeedbackData = {
        ...feedbackData,
        id: this.generateId(),
        timestamp: new Date(),
      }

      FeedbackModel.saveFeedback(feedback)
      return true
    } catch (error) {
      console.error("Error submitting feedback:", error)
      return false
    }
  }

  static getAllFeedback(): FeedbackData[] {
    return FeedbackModel.getFeedbackData()
  }

  static getFeedbackByType(type: "course" | "teacher" | "facility"): FeedbackData[] {
    return FeedbackModel.getFeedbackData().filter((f) => f.type === type)
  }

  static getFeedbackByTarget(targetId: string): FeedbackData[] {
    return FeedbackModel.getFeedbackData().filter((f) => f.targetId === targetId)
  }

  static getAnalytics(): AnalyticsData {
    return FeedbackModel.getAnalytics()
  }

  static getCourses() {
    return FeedbackModel.getCourses()
  }

  static getTeachers() {
    return FeedbackModel.getTeachers()
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}
