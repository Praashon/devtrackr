// Weekly Review Types

export interface ActivitySummary {
  totalCommits: number
  pullRequests: number
  reviews: number
  reposWorkedOn: string[]
  impactScore: number
}

export interface Target {
  id: string
  text: string
  completed: boolean
}

export interface Reflections {
  wins: string
  blockers: string
  nextFocus: string
}

export interface WeeklyReview {
  id: string
  userId: string
  weekId: string // Format: "week-YYYY-MM-DD" (week start date)
  weekStartDate: string // ISO date string
  weekEndDate: string // ISO date string
  status: 'complete' | 'incomplete'
  completedAt: string | null // ISO timestamp
  createdDate: string // ISO date string
  activitySummary: ActivitySummary
  reflections: Reflections
  targets: Target[]
}

// API Response Types
export interface WeeklyReviewsResponse {
  reviews: WeeklyReview[]
  currentWeekId: string
  currentStreak: number
}

export interface UpdateReviewRequest {
  reflections?: Partial<Reflections>
  targets?: Target[]
}

export interface CompleteReviewResponse {
  review: WeeklyReview
  currentStreak: number
}

// Component Props
export interface WeeklyReviewProps {
  currentReview: WeeklyReview
  allReviews: WeeklyReview[]
  currentStreak: number
  onUpdateReflection?: (field: keyof Reflections, value: string) => void
  onAddTarget?: (text: string) => void
  onRemoveTarget?: (targetId: string) => void
  onToggleTarget?: (targetId: string) => void
  onCompleteReview?: () => void
  onNavigateToWeek?: (reviewId: string) => void
  onPreviousWeek?: () => void
  onNextWeek?: () => void
}
