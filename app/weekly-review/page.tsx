'use client'

import { useState, useEffect } from 'react'
import { WeeklyReview } from '@/components/weekly-review'
import type { WeeklyReview as WeeklyReviewType, Reflections } from '@/lib/types/weekly-review'

export default function WeeklyReviewPage() {
  const [allReviews, setAllReviews] = useState<WeeklyReviewType[]>([])
  const [currentWeekId, setCurrentWeekId] = useState<string>('')
  const [currentStreak, setCurrentStreak] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching weekly reviews...')
      const response = await fetch('/api/weekly-reviews')
      console.log('Response status:', response.status)
      if (!response.ok) {
        throw new Error('Failed to fetch weekly reviews')
      }
      const result = await response.json()
      console.log('Fetched data:', result)
      setAllReviews(result.reviews)
      setCurrentWeekId(result.currentWeekId)
      setCurrentStreak(result.currentStreak)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentReview = (): WeeklyReviewType | null => {
    return allReviews.find(r => r.weekId === currentWeekId) || null
  }

  // Update reflection handler
  const handleUpdateReflection = async (field: keyof Reflections, value: string) => {
    const currentReview = getCurrentReview()
    if (!currentReview) return

    try {
      const response = await fetch(`/api/weekly-reviews/${currentWeekId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reflections: { [field]: value },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update reflection')
      }

      const updated = await response.json()
      setAllReviews(prev => prev.map(r => r.id === updated.id ? updated : r))
    } catch (err) {
      console.error('Error updating reflection:', err)
      setError(err instanceof Error ? err.message : 'Failed to update reflection')
    }
  }

  // Add target handler
  const handleAddTarget = async (text: string) => {
    const currentReview = getCurrentReview()
    if (!currentReview) return

    try {
      const response = await fetch(`/api/weekly-reviews/${currentWeekId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-target', text }),
      })

      if (!response.ok) {
        throw new Error('Failed to add target')
      }

      const updated = await response.json()
      setAllReviews(prev => prev.map(r => r.id === updated.id ? updated : r))
    } catch (err) {
      console.error('Error adding target:', err)
      setError(err instanceof Error ? err.message : 'Failed to add target')
    }
  }

  // Remove target handler
  const handleRemoveTarget = async (targetId: string) => {
    const currentReview = getCurrentReview()
    if (!currentReview) return

    try {
      const response = await fetch(`/api/weekly-reviews/${currentWeekId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove-target', targetId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove target')
      }

      const updated = await response.json()
      setAllReviews(prev => prev.map(r => r.id === updated.id ? updated : r))
    } catch (err) {
      console.error('Error removing target:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove target')
    }
  }

  // Toggle target handler
  const handleToggleTarget = async (targetId: string) => {
    const currentReview = getCurrentReview()
    if (!currentReview) return

    try {
      const response = await fetch(`/api/weekly-reviews/${currentWeekId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-target', targetId }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle target')
      }

      const updated = await response.json()
      setAllReviews(prev => prev.map(r => r.id === updated.id ? updated : r))
    } catch (err) {
      console.error('Error toggling target:', err)
      setError(err instanceof Error ? err.message : 'Failed to toggle target')
    }
  }

  // Complete review handler
  const handleCompleteReview = async () => {
    const currentReview = getCurrentReview()
    if (!currentReview) return

    try {
      const response = await fetch(`/api/weekly-reviews/${currentWeekId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to complete review')
      }

      const result = await response.json()
      setAllReviews(prev => prev.map(r => r.id === result.review.id ? result.review : r))
      setCurrentStreak(result.currentStreak)
    } catch (err) {
      console.error('Error completing review:', err)
      alert(err instanceof Error ? err.message : 'Failed to complete review')
    }
  }

  // Navigate to previous week
  const handlePreviousWeek = async () => {
    try {
      // Fetch all reviews to find the previous week
      const allWeekIds = allReviews.map(r => r.weekId).sort()
      const currentIndex = allWeekIds.indexOf(currentWeekId)
      if (currentIndex > 0) {
        setCurrentWeekId(allWeekIds[currentIndex - 1])
      }
    } catch (err) {
      console.error('Error navigating to previous week:', err)
    }
  }

  // Navigate to next week
  const handleNextWeek = async () => {
    try {
      // Fetch all reviews to find the next week
      const allWeekIds = allReviews.map(r => r.weekId).sort()
      const currentIndex = allWeekIds.indexOf(currentWeekId)
      if (currentIndex < allWeekIds.length - 1) {
        setCurrentWeekId(allWeekIds[currentIndex + 1])
      }
    } catch (err) {
      console.error('Error navigating to next week:', err)
    }
  }

  // Navigate to specific week
  const handleNavigateToWeek = (reviewId: string) => {
    const review = allReviews.find(r => r.id === reviewId)
    if (review) {
      setCurrentWeekId(review.weekId)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-slate-600 dark:text-slate-400">Loading weekly review...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const currentReview = getCurrentReview()
  if (!currentReview) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-slate-600 dark:text-slate-400">No review found for this week</div>
      </div>
    )
  }

  return (
    <WeeklyReview
      currentReview={currentReview}
      allReviews={allReviews}
      currentStreak={currentStreak}
      onUpdateReflection={handleUpdateReflection}
      onAddTarget={handleAddTarget}
      onRemoveTarget={handleRemoveTarget}
      onToggleTarget={handleToggleTarget}
      onCompleteReview={handleCompleteReview}
      onPreviousWeek={handlePreviousWeek}
      onNextWeek={handleNextWeek}
      onNavigateToWeek={handleNavigateToWeek}
    />
  )
}
