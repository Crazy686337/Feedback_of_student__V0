// Model layer - Data structures and LocalStorage management
export interface FeedbackData {
  id: string
  type: "course" | "teacher" | "facility"
  targetId: string
  targetName: string
  rating: number
  comment: string
  categories: {
    [key: string]: number
  }
  timestamp: Date
  studentId?: string
}

export interface Course {
  id: string
  name: string
  code: string
  instructor: string
  semester: string
}

export interface Teacher {
  id: string
  name: string
  department: string
  courses: string[]
}

export interface AnalyticsData {
  totalFeedback: number
  averageRating: number
  coursesRated: number
  teachersRated: number
  ratingDistribution: { [key: number]: number }
  categoryAverages: { [key: string]: number }
}

export class FeedbackModel {
  private static readonly STORAGE_KEY = "student_feedback_data"
  private static readonly COURSES_KEY = "courses_data"
  private static readonly TEACHERS_KEY = "teachers_data"

  static getFeedbackData(): FeedbackData[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  static saveFeedback(feedback: FeedbackData): void {
    if (typeof window === "undefined") return
    const existingData = this.getFeedbackData()
    existingData.push(feedback)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData))
  }

  static getCourses(): Course[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.COURSES_KEY)
    return data ? JSON.parse(data) : this.getDefaultCourses()
  }

  static getTeachers(): Teacher[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.TEACHERS_KEY)
    return data ? JSON.parse(data) : this.getDefaultTeachers()
  }

  static getAnalytics(): AnalyticsData {
    const feedbackData = this.getFeedbackData()

    if (feedbackData.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        coursesRated: 0,
        teachersRated: 0,
        ratingDistribution: {},
        categoryAverages: {},
      }
    }

    const totalFeedback = feedbackData.length
    const averageRating = feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
    const coursesRated = new Set(feedbackData.filter((f) => f.type === "course").map((f) => f.targetId)).size
    const teachersRated = new Set(feedbackData.filter((f) => f.type === "teacher").map((f) => f.targetId)).size

    const ratingDistribution: { [key: number]: number } = {}
    feedbackData.forEach((f) => {
      ratingDistribution[f.rating] = (ratingDistribution[f.rating] || 0) + 1
    })

    return {
      totalFeedback,
      averageRating: Math.round(averageRating * 10) / 10,
      coursesRated,
      teachersRated,
      ratingDistribution,
      categoryAverages: {},
    }
  }

  private static getDefaultCourses(): Course[] {
    return [
      {
        id: "1",
        name: "Introduction to Computer Science",
        code: "CS101",
        instructor: "Dr. Smith",
        semester: "Fall 2024",
      },
      { id: "2", name: "Data Structures", code: "CS201", instructor: "Prof. Johnson", semester: "Fall 2024" },
      { id: "3", name: "Web Development", code: "CS301", instructor: "Dr. Brown", semester: "Fall 2024" },
    ]
  }

  private static getDefaultTeachers(): Teacher[] {
    return [
      { id: "1", name: "Dr. Smith", department: "Computer Science", courses: ["CS101"] },
      { id: "2", name: "Prof. Johnson", department: "Computer Science", courses: ["CS201"] },
      { id: "3", name: "Dr. Brown", department: "Computer Science", courses: ["CS301"] },
    ]
  }
}
