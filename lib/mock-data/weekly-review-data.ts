// Mock Weekly Review Data Layer
// Provides in-memory storage for weekly reviews with CRUD operations
// Data resets on server restart (session-based persistence only)

import { startOfWeek, endOfWeek, format, parseISO, addWeeks, subWeeks } from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import type { WeeklyReview, Target, Reflections, ActivitySummary } from '@/lib/types/weekly-review'

// In-memory storage
let weeklyReviews: WeeklyReview[] = [
  {
    id: 'review-2025-w52',
    userId: 'dev-user-1',
    weekId: 'week-2025-12-22',
    weekStartDate: '2025-12-22',
    weekEndDate: '2025-12-28',
    status: 'complete',
    completedAt: '2025-12-28T18:30:00Z',
    createdDate: '2025-12-22',
    activitySummary: {
      totalCommits: 28,
      pullRequests: 3,
      reviews: 5,
      reposWorkedOn: ['devtrackr', 'api-gateway', 'design-system'],
      impactScore: 82,
    },
    reflections: {
      wins: 'Shipped the new authentication flow ahead of schedule. Got positive feedback from the team on code review quality. Finally debugged that elusive race condition in the API gateway.',
      blockers: 'Spent too much time context-switching between projects. The CI pipeline was flaky and cost me 3 hours of debugging.',
      nextFocus: 'Focus on completing the weekly review UI this week. Block out dedicated deep work time for the data model refactor. Set up better CI monitoring.',
    },
    targets: [
      { id: 't1', text: 'Complete Weekly Review UI component', completed: true },
      { id: 't2', text: 'Refactor data model layer', completed: false },
      { id: 't3', text: 'Set up CI monitoring dashboard', completed: false },
    ],
  },
  {
    id: 'review-2025-w51',
    userId: 'dev-user-1',
    weekId: 'week-2025-12-15',
    weekStartDate: '2025-12-15',
    weekEndDate: '2025-12-21',
    status: 'complete',
    completedAt: '2025-12-21T16:45:00Z',
    createdDate: '2025-12-15',
    activitySummary: {
      totalCommits: 35,
      pullRequests: 4,
      reviews: 7,
      reposWorkedOn: ['devtrackr', 'mobile-app'],
      impactScore: 91,
    },
    reflections: {
      wins: 'Had a really productive week with consistent commits. Mentored a junior dev on React patterns. Made significant progress on the mobile app redesign.',
      blockers: 'Meeting overload on Tuesday and Wednesday disrupted flow state. Unclear requirements for the settings page delayed implementation.',
      nextFocus: 'Ship authentication flow. Reduce meeting time by declining non-essential ones. Get clarification on settings requirements before starting.',
    },
    targets: [
      { id: 't4', text: 'Complete auth flow implementation', completed: true },
      { id: 't5', text: 'Review mobile app PR from Sarah', completed: true },
      { id: 't6', text: 'Document API endpoints', completed: false },
    ],
  },
  {
    id: 'review-2025-w50',
    userId: 'dev-user-1',
    weekId: 'week-2025-12-08',
    weekStartDate: '2025-12-08',
    weekEndDate: '2025-12-14',
    status: 'complete',
    completedAt: '2025-12-14T20:15:00Z',
    createdDate: '2025-12-08',
    activitySummary: {
      totalCommits: 22,
      pullRequests: 2,
      reviews: 4,
      reposWorkedOn: ['devtrackr'],
      impactScore: 68,
    },
    reflections: {
      wins: 'Pushed through some difficult TypeScript type issues. Got the data fetching layer working smoothly with error handling.',
      blockers: 'Lower energy week, maybe burned out from last sprint. Struggled with motivation mid-week.',
      nextFocus: 'Take it easier but maintain consistency. Focus on small wins. Start the mobile app redesign.',
    },
    targets: [
      { id: 't7', text: 'Start mobile app redesign', completed: true },
      { id: 't8', text: 'Write unit tests for data layer', completed: true },
      { id: 't9', text: 'Plan architecture for notifications', completed: false },
    ],
  },
  {
    id: 'review-2025-w49',
    userId: 'dev-user-1',
    weekId: 'week-2025-12-01',
    weekStartDate: '2025-12-01',
    weekEndDate: '2025-12-07',
    status: 'incomplete',
    completedAt: null,
    createdDate: '2025-12-01',
    activitySummary: {
      totalCommits: 18,
      pullRequests: 2,
      reviews: 3,
      reposWorkedOn: ['devtrackr', 'docs'],
      impactScore: 55,
    },
    reflections: {
      wins: '',
      blockers: '',
      nextFocus: '',
    },
    targets: [],
  },
]

// Helper: Generate week ID from date
export function getWeekId(date: Date, weekStartsOn: 'sunday' | 'monday'): string {
  const startDay = weekStartsOn === 'sunday' ? 0 : 1
  const weekStart = startOfWeek(date, { weekStartsOn: startDay })
  return `week-${format(weekStart, 'yyyy-MM-dd')}`
}

// Helper: Get week boundaries
export function getWeekBoundaries(
  date: Date,
  weekStartsOn: 'sunday' | 'monday',
  timezone: string
): { start: string; end: string } {
  const startDay = weekStartsOn === 'sunday' ? 0 : 1
  const zonedDate = toZonedTime(date, timezone)
  const weekStart = startOfWeek(zonedDate, { weekStartsOn: startDay })
  const weekEnd = endOfWeek(zonedDate, { weekStartsOn: startDay })
  
  return {
    start: format(fromZonedTime(weekStart, timezone), 'yyyy-MM-dd'),
    end: format(fromZonedTime(weekEnd, timezone), 'yyyy-MM-dd'),
  }
}

// Helper: Calculate streak (consecutive completed weeks from most recent)
export function calculateStreak(reviews: WeeklyReview[]): number {
  const completed = reviews
    .filter(r => r.status === 'complete')
    .sort((a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime())
  
  if (completed.length === 0) return 0
  
  let streak = 0
  for (let i = 0; i < completed.length; i++) {
    const current = parseISO(completed[i].weekStartDate)
    if (i === 0) {
      streak = 1
    } else {
      const previous = parseISO(completed[i - 1].weekStartDate)
      const weeksBetween = Math.round((previous.getTime() - current.getTime()) / (7 * 24 * 60 * 60 * 1000))
      if (weeksBetween === 1) {
        streak++
      } else {
        break
      }
    }
  }
  
  return streak
}

// Helper: Get or create review for a specific week
export function getOrCreateReviewForWeek(
  userId: string,
  weekId: string,
  weekStartDate: string,
  weekEndDate: string,
  activitySummary: ActivitySummary
): WeeklyReview {
  const existing = weeklyReviews.find(r => r.userId === userId && r.weekId === weekId)
  
  if (existing) {
    // Update activity summary with latest data
    existing.activitySummary = activitySummary
    return existing
  }
  
  // Create new incomplete review
  const newReview: WeeklyReview = {
    id: `review-${weekId}`,
    userId,
    weekId,
    weekStartDate,
    weekEndDate,
    status: 'incomplete',
    completedAt: null,
    createdDate: format(new Date(), 'yyyy-MM-dd'),
    activitySummary,
    reflections: {
      wins: '',
      blockers: '',
      nextFocus: '',
    },
    targets: [],
  }
  
  weeklyReviews.push(newReview)
  return newReview
}

// Get all reviews for a user
export function getMockWeeklyReviews(userId: string): WeeklyReview[] {
  return weeklyReviews
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime())
}

// Get specific review by ID
export function getMockWeeklyReview(reviewId: string, userId: string): WeeklyReview | null {
  return weeklyReviews.find(r => r.id === reviewId && r.userId === userId) || null
}

// Get review by week ID
export function getMockReviewByWeekId(weekId: string, userId: string): WeeklyReview | null {
  return weeklyReviews.find(r => r.weekId === weekId && r.userId === userId) || null
}

// Update review reflections
export function updateMockReviewReflections(
  reviewId: string,
  userId: string,
  reflections: Partial<Reflections>
): WeeklyReview | null {
  const review = weeklyReviews.find(r => r.id === reviewId && r.userId === userId)
  if (!review) return null
  
  review.reflections = {
    ...review.reflections,
    ...reflections,
  }
  
  return review
}

// Update review targets
export function updateMockReviewTargets(
  reviewId: string,
  userId: string,
  targets: Target[]
): WeeklyReview | null {
  const review = weeklyReviews.find(r => r.id === reviewId && r.userId === userId)
  if (!review) return null
  
  review.targets = targets
  return review
}

// Add target to review
export function addMockReviewTarget(
  reviewId: string,
  userId: string,
  text: string
): WeeklyReview | null {
  const review = weeklyReviews.find(r => r.id === reviewId && r.userId === userId)
  if (!review) return null
  
  const newTarget: Target = {
    id: `target-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text,
    completed: false,
  }
  
  review.targets.push(newTarget)
  return review
}

// Remove target from review
export function removeMockReviewTarget(
  reviewId: string,
  userId: string,
  targetId: string
): WeeklyReview | null {
  const review = weeklyReviews.find(r => r.id === reviewId && r.userId === userId)
  if (!review) return null
  
  review.targets = review.targets.filter(t => t.id !== targetId)
  return review
}

// Toggle target completion
export function toggleMockReviewTarget(
  reviewId: string,
  userId: string,
  targetId: string
): WeeklyReview | null {
  const review = weeklyReviews.find(r => r.id === reviewId && r.userId === userId)
  if (!review) return null
  
  const target = review.targets.find(t => t.id === targetId)
  if (!target) return null
  
  target.completed = !target.completed
  return review
}

// Complete review
export function completeMockReview(reviewId: string, userId: string): WeeklyReview | null {
  const review = weeklyReviews.find(r => r.id === reviewId && r.userId === userId)
  if (!review) return null
  
  review.status = 'complete'
  review.completedAt = new Date().toISOString()
  
  return review
}

// Get current week ID
export function getCurrentWeekId(weekStartsOn: 'sunday' | 'monday', timezone: string): string {
  const now = toZonedTime(new Date(), timezone)
  return getWeekId(now, weekStartsOn)
}

// Navigate to adjacent week
export function getAdjacentWeekId(
  currentWeekId: string,
  direction: 'previous' | 'next',
  weekStartsOn: 'sunday' | 'monday'
): string {
  const weekStartDate = parseISO(currentWeekId.replace('week-', ''))
  const targetDate = direction === 'previous' ? subWeeks(weekStartDate, 1) : addWeeks(weekStartDate, 1)
  return getWeekId(targetDate, weekStartsOn)
}
