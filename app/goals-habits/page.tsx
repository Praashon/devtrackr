'use client'

import { useState, useEffect } from 'react'
import { GoalsHabits } from '@/components/goals-habits'
import type { Goal, Habit, GoalsHabitsData } from '@/lib/types/goals-habits'

export default function GoalsHabitsPage() {
  const [data, setData] = useState<GoalsHabitsData | null>(null)
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
      const response = await fetch('/api/goals-habits')
      if (!response.ok) {
        throw new Error('Failed to fetch goals and habits')
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Goal handlers
  const handleCreateGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'createdDate' | 'completedDate' | 'createdFromReview'>) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
      })
      if (!response.ok) {
        throw new Error('Failed to create goal')
      }
      await fetchData() // Refresh data
    } catch (err) {
      console.error('Error creating goal:', err)
      setError(err instanceof Error ? err.message : 'Failed to create goal')
    }
  }

  const handleUpdateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error('Failed to update goal')
      }
      await fetchData() // Refresh data
    } catch (err) {
      console.error('Error updating goal:', err)
      setError(err instanceof Error ? err.message : 'Failed to update goal')
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return
    
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete goal')
      }
      await fetchData() // Refresh data
    } catch (err) {
      console.error('Error deleting goal:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete goal')
    }
  }

  const handleArchiveGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' }),
      })
      if (!response.ok) {
        throw new Error('Failed to archive goal')
      }
      await fetchData() // Refresh data
    } catch (err) {
      console.error('Error archiving goal:', err)
      setError(err instanceof Error ? err.message : 'Failed to archive goal')
    }
  }

  // Habit handlers
  const handleCreateHabit = async (habitData: Omit<Habit, 'id' | 'userId' | 'createdDate' | 'weeklyProgress'>) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData),
      })
      if (!response.ok) {
        throw new Error('Failed to create habit')
      }
      await fetchData() // Refresh data
    } catch (err) {
      console.error('Error creating habit:', err)
      setError(err instanceof Error ? err.message : 'Failed to create habit')
    }
  }

  const handleUpdateHabit = async (habitId: string, updates: Partial<Habit>) => {
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error('Failed to update habit')
      }
      await fetchData() // Refresh data
    } catch (err) {
      console.error('Error updating habit:', err)
      setError(err instanceof Error ? err.message : 'Failed to update habit')
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return
    
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete habit')
      }
      await fetchData() // Refresh data
    } catch (err) {
      console.error('Error deleting habit:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete habit')
    }
  }

  const handleToggleHabitWeek = async (habitId: string, weekStartDate: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekStartDate, completed }),
      })
      if (!response.ok) {
        throw new Error('Failed to toggle habit')
      }
      await fetchData() // Refresh data
    } catch (err) {
      console.error('Error toggling habit:', err)
      setError(err instanceof Error ? err.message : 'Failed to toggle habit')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Loading goals and habits...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-6">
        <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error loading data</h3>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">No data available</p>
      </div>
    )
  }

  return (
    <GoalsHabits
      goals={data.goals}
      habits={data.habits}
      currentWeekStart={data.currentWeekStart}
      onCreateGoal={handleCreateGoal}
      onUpdateGoal={handleUpdateGoal}
      onDeleteGoal={handleDeleteGoal}
      onArchiveGoal={handleArchiveGoal}
      onCreateHabit={handleCreateHabit}
      onUpdateHabit={handleUpdateHabit}
      onDeleteHabit={handleDeleteHabit}
      onToggleHabitWeek={handleToggleHabitWeek}
    />
  )
}

