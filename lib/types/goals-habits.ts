// =============================================================================
// Goals & Habits Types
// =============================================================================

export interface Goal {
  id: string
  userId: string
  title: string
  description: string | null
  status: 'active' | 'completed' | 'archived'
  targetDate: string | null
  createdDate: string
  completedDate: string | null
  createdFromReview: string | null
}

export interface HabitWeeklyProgress {
  weekStartDate: string
  completed: boolean
}

export interface Habit {
  id: string
  userId: string
  title: string
  description: string | null
  createdDate: string
  weeklyProgress: HabitWeeklyProgress[]
}

// =============================================================================
// API Response Types
// =============================================================================

export interface GoalsHabitsData {
  goals: Goal[]
  habits: Habit[]
  currentWeekStart: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface GoalsHabitsProps {
  goals: Goal[]
  habits: Habit[]
  currentWeekStart: string
  onCreateGoal?: (goal: Omit<Goal, 'id' | 'userId' | 'createdDate' | 'completedDate' | 'createdFromReview'>) => void
  onUpdateGoal?: (goalId: string, updates: Partial<Goal>) => void
  onDeleteGoal?: (goalId: string) => void
  onArchiveGoal?: (goalId: string) => void
  onCreateHabit?: (habit: Omit<Habit, 'id' | 'userId' | 'createdDate' | 'weeklyProgress'>) => void
  onUpdateHabit?: (habitId: string, updates: Partial<Habit>) => void
  onDeleteHabit?: (habitId: string) => void
  onToggleHabitWeek?: (habitId: string, weekStartDate: string, completed: boolean) => void
}
