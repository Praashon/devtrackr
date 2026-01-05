// =============================================================================
// Mock Data Layer for Goals & Habits
// =============================================================================

import type { Goal, Habit, GoalsHabitsData } from '@/lib/types/goals-habits'
import { getCurrentWeek } from '@/lib/utils/week-calculations'

// In-memory storage (resets on server restart)
let mockGoals: Goal[] = [
  {
    id: 'goal-1',
    userId: 'dev-user-1',
    title: 'Complete DevTrackr weekly review feature',
    description: 'Ship the complete weekly review workflow with reflection prompts, activity summary, and target setting',
    status: 'completed',
    targetDate: '2025-12-28',
    createdDate: '2025-12-01',
    completedDate: '2025-12-27',
    createdFromReview: null,
  },
  {
    id: 'goal-2',
    userId: 'dev-user-1',
    title: 'Refactor data model layer',
    description: 'Clean up the data fetching logic, add proper error handling, and improve TypeScript types across all sections',
    status: 'active',
    targetDate: '2026-01-15',
    createdDate: '2025-12-22',
    completedDate: null,
    createdFromReview: 'review-2025-w52',
  },
  {
    id: 'goal-3',
    userId: 'dev-user-1',
    title: 'Set up CI monitoring dashboard',
    description: 'Create a dashboard to track CI pipeline health and catch flaky tests early',
    status: 'active',
    targetDate: '2026-01-31',
    createdDate: '2025-12-22',
    completedDate: null,
    createdFromReview: 'review-2025-w52',
  },
  {
    id: 'goal-4',
    userId: 'dev-user-1',
    title: 'Learn Rust fundamentals',
    description: 'Complete the Rust book and build a small CLI tool to practice ownership concepts',
    status: 'active',
    targetDate: '2026-03-01',
    createdDate: '2025-12-10',
    completedDate: null,
    createdFromReview: null,
  },
  {
    id: 'goal-5',
    userId: 'dev-user-1',
    title: 'Migrate authentication to OAuth',
    description: null,
    status: 'archived',
    targetDate: '2025-11-30',
    createdDate: '2025-10-15',
    completedDate: '2025-11-28',
    createdFromReview: null,
  },
]

let mockHabits: Habit[] = [
  {
    id: 'habit-1',
    userId: 'dev-user-1',
    title: 'Write tests for every PR',
    description: 'Maintain test coverage by writing unit tests for all new features and bug fixes before merging',
    createdDate: '2025-11-01',
    weeklyProgress: [
      { weekStartDate: '2025-11-04', completed: true },
      { weekStartDate: '2025-11-11', completed: true },
      { weekStartDate: '2025-11-18', completed: false },
      { weekStartDate: '2025-11-25', completed: true },
      { weekStartDate: '2025-12-02', completed: true },
      { weekStartDate: '2025-12-09', completed: true },
      { weekStartDate: '2025-12-16', completed: true },
      { weekStartDate: '2025-12-23', completed: true },
      { weekStartDate: '2025-12-30', completed: false },
    ],
  },
  {
    id: 'habit-2',
    userId: 'dev-user-1',
    title: 'Complete weekly review by Sunday',
    description: 'Finish the weekly review ritual every Sunday evening to maintain consistency and clarity',
    createdDate: '2025-11-15',
    weeklyProgress: [
      { weekStartDate: '2025-11-18', completed: true },
      { weekStartDate: '2025-11-25', completed: false },
      { weekStartDate: '2025-12-02', completed: true },
      { weekStartDate: '2025-12-09', completed: true },
      { weekStartDate: '2025-12-16', completed: true },
      { weekStartDate: '2025-12-23', completed: true },
      { weekStartDate: '2025-12-30', completed: false },
    ],
  },
  {
    id: 'habit-3',
    userId: 'dev-user-1',
    title: 'Read technical content',
    description: 'Spend time each week reading blog posts, documentation, or technical books to stay current',
    createdDate: '2025-12-01',
    weeklyProgress: [
      { weekStartDate: '2025-12-02', completed: true },
      { weekStartDate: '2025-12-09', completed: false },
      { weekStartDate: '2025-12-16', completed: true },
      { weekStartDate: '2025-12-23', completed: true },
      { weekStartDate: '2025-12-30', completed: true },
    ],
  },
  {
    id: 'habit-4',
    userId: 'dev-user-1',
    title: 'Code review for teammates',
    description: 'Dedicate time each week to reviewing pull requests and providing thoughtful feedback',
    createdDate: '2025-10-20',
    weeklyProgress: [
      { weekStartDate: '2025-11-04', completed: true },
      { weekStartDate: '2025-11-11', completed: true },
      { weekStartDate: '2025-11-18', completed: true },
      { weekStartDate: '2025-11-25', completed: false },
      { weekStartDate: '2025-12-02', completed: false },
      { weekStartDate: '2025-12-09', completed: true },
      { weekStartDate: '2025-12-16', completed: true },
      { weekStartDate: '2025-12-23', completed: true },
      { weekStartDate: '2025-12-30', completed: true },
    ],
  },
  {
    id: 'habit-5',
    userId: 'dev-user-1',
    title: 'Commit to open source',
    description: 'Make at least one contribution to an open source project each week',
    createdDate: '2025-12-15',
    weeklyProgress: [
      { weekStartDate: '2025-12-16', completed: false },
      { weekStartDate: '2025-12-23', completed: true },
      { weekStartDate: '2025-12-30', completed: false },
    ],
  },
]

// =============================================================================
// Mock Data Functions
// =============================================================================

export function getMockGoals(userId: string): Goal[] {
  return mockGoals.filter((g) => g.userId === userId)
}

export function getMockHabits(userId: string): Habit[] {
  return mockHabits.filter((h) => h.userId === userId)
}

export function getMockGoalsHabitsData(userId: string, timezone: string, weekStartsOn: 'sunday' | 'monday'): GoalsHabitsData {
  const currentWeek = getCurrentWeek(timezone, weekStartsOn)
  
  return {
    goals: getMockGoals(userId),
    habits: getMockHabits(userId),
    currentWeekStart: currentWeek.startDate,
  }
}

export function createMockGoal(
  userId: string,
  data: Omit<Goal, 'id' | 'userId' | 'createdDate' | 'completedDate' | 'createdFromReview'>
): Goal {
  const newGoal: Goal = {
    id: `goal-${Date.now()}`,
    userId,
    ...data,
    createdDate: new Date().toISOString().split('T')[0],
    completedDate: null,
    createdFromReview: null,
  }
  mockGoals.push(newGoal)
  return newGoal
}

export function updateMockGoal(goalId: string, updates: Partial<Goal>): Goal | null {
  const index = mockGoals.findIndex((g) => g.id === goalId)
  if (index === -1) return null
  
  mockGoals[index] = { ...mockGoals[index], ...updates }
  return mockGoals[index]
}

export function deleteMockGoal(goalId: string): boolean {
  const index = mockGoals.findIndex((g) => g.id === goalId)
  if (index === -1) return false
  
  mockGoals.splice(index, 1)
  return true
}

export function archiveMockGoal(goalId: string): Goal | null {
  return updateMockGoal(goalId, { status: 'archived' })
}

export function createMockHabit(
  userId: string,
  data: Omit<Habit, 'id' | 'userId' | 'createdDate' | 'weeklyProgress'>
): Habit {
  const newHabit: Habit = {
    id: `habit-${Date.now()}`,
    userId,
    ...data,
    createdDate: new Date().toISOString().split('T')[0],
    weeklyProgress: [],
  }
  mockHabits.push(newHabit)
  return newHabit
}

export function updateMockHabit(habitId: string, updates: Partial<Habit>): Habit | null {
  const index = mockHabits.findIndex((h) => h.id === habitId)
  if (index === -1) return null
  
  mockHabits[index] = { ...mockHabits[index], ...updates }
  return mockHabits[index]
}

export function deleteMockHabit(habitId: string): boolean {
  const index = mockHabits.findIndex((h) => h.id === habitId)
  if (index === -1) return false
  
  mockHabits.splice(index, 1)
  return true
}

export function toggleMockHabitWeek(habitId: string, weekStartDate: string, completed: boolean): Habit | null {
  const index = mockHabits.findIndex((h) => h.id === habitId)
  if (index === -1) return null
  
  const habit = mockHabits[index]
  const progressIndex = habit.weeklyProgress.findIndex((p) => p.weekStartDate === weekStartDate)
  
  if (progressIndex >= 0) {
    // Update existing entry
    habit.weeklyProgress[progressIndex] = { weekStartDate, completed }
  } else {
    // Add new entry
    habit.weeklyProgress.push({ weekStartDate, completed })
    // Sort by date (oldest first)
    habit.weeklyProgress.sort((a, b) => a.weekStartDate.localeCompare(b.weekStartDate))
  }
  
  return habit
}
