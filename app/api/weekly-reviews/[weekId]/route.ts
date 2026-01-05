// PATCH /api/weekly-reviews/[weekId] - Update review reflections and targets
// POST /api/weekly-reviews/[weekId]/complete - Complete review
import { NextResponse } from 'next/server'
import {
  getMockReviewByWeekId,
  updateMockReviewReflections,
  updateMockReviewTargets,
  addMockReviewTarget,
  removeMockReviewTarget,
  toggleMockReviewTarget,
  completeMockReview,
  calculateStreak,
  getMockWeeklyReviews,
} from '@/lib/mock-data/weekly-review-data'
import type { UpdateReviewRequest, CompleteReviewResponse } from '@/lib/types/weekly-review'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  try {
    const userId = 'dev-user-1'
    const { weekId } = await params
    const body: UpdateReviewRequest = await request.json()
    
    const review = getMockReviewByWeekId(weekId, userId)
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }
    
    let updated = review
    
    // Update reflections if provided
    if (body.reflections) {
      const result = updateMockReviewReflections(review.id, userId, body.reflections)
      if (result) updated = result
    }
    
    // Update targets if provided
    if (body.targets) {
      const result = updateMockReviewTargets(review.id, userId, body.targets)
      if (result) updated = result
    }
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

// Complete review endpoint
export async function POST(
  request: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  try {
    const userId = 'dev-user-1'
    const { weekId } = await params
    const { action, text, targetId } = await request.json()
    
    if (action === 'complete') {
      const review = getMockReviewByWeekId(weekId, userId)
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }
      
      // Validate: must have at least one reflection filled and one target
      const hasReflections =
        review.reflections.wins.trim() ||
        review.reflections.blockers.trim() ||
        review.reflections.nextFocus.trim()
      
      if (!hasReflections) {
        return NextResponse.json(
          { error: 'Please fill in at least one reflection before completing' },
          { status: 400 }
        )
      }
      
      if (review.targets.length === 0) {
        return NextResponse.json(
          { error: 'Please add at least one target before completing' },
          { status: 400 }
        )
      }
      
      const completed = completeMockReview(review.id, userId)
      if (!completed) {
        return NextResponse.json({ error: 'Failed to complete review' }, { status: 500 })
      }
      
      const allReviews = getMockWeeklyReviews(userId)
      const currentStreak = calculateStreak(allReviews)
      
      const response: CompleteReviewResponse = {
        review: completed,
        currentStreak,
      }
      
      return NextResponse.json(response)
    }
    
    if (action === 'add-target') {
      const review = getMockReviewByWeekId(weekId, userId)
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }
      
      const updated = addMockReviewTarget(review.id, userId, text)
      return NextResponse.json(updated)
    }
    
    if (action === 'remove-target') {
      const review = getMockReviewByWeekId(weekId, userId)
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }
      
      const updated = removeMockReviewTarget(review.id, userId, targetId)
      return NextResponse.json(updated)
    }
    
    if (action === 'toggle-target') {
      const review = getMockReviewByWeekId(weekId, userId)
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 })
      }
      
      const updated = toggleMockReviewTarget(review.id, userId, targetId)
      return NextResponse.json(updated)
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing review action:', error)
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 })
  }
}
