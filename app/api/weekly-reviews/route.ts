// GET /api/weekly-reviews - Get all reviews for current user
import { NextResponse } from 'next/server'
import {
  getMockWeeklyReviews,
  getCurrentWeekId,
  calculateStreak,
  getOrCreateReviewForWeek,
  getWeekBoundaries,
} from '@/lib/mock-data/weekly-review-data'
import type { WeeklyReviewsResponse } from '@/lib/types/weekly-review'

export async function GET() {
  try {
    // Mock user and preferences
    const userId = 'dev-user-1'
    const weekStartsOn = 'sunday' as const
    const timezone = 'America/New_York'
    
    // Get current week ID
    const currentWeekId = getCurrentWeekId(weekStartsOn, timezone)
    const boundaries = getWeekBoundaries(new Date(), weekStartsOn, timezone)
    
    // Mock activity summary (in real app, fetch from GitHub API)
    const activitySummary = {
      totalCommits: 15,
      pullRequests: 2,
      reviews: 3,
      reposWorkedOn: ['devtrackr'],
      impactScore: 62,
    }
    
    // Ensure current week review exists
    getOrCreateReviewForWeek(
      userId,
      currentWeekId,
      boundaries.start,
      boundaries.end,
      activitySummary
    )
    
    // Get all reviews
    const reviews = getMockWeeklyReviews(userId)
    const currentStreak = calculateStreak(reviews)
    
    const response: WeeklyReviewsResponse = {
      reviews,
      currentWeekId,
      currentStreak,
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching weekly reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly reviews' },
      { status: 500 }
    )
  }
}
