import type { Habit } from '@/lib/types/goals-habits'
import { Check, Trash2, TrendingUp, Edit, MoreVertical } from 'lucide-react'
import { useState } from 'react'

interface HabitCardProps {
  habit: Habit
  currentWeekStart: string
  onToggleWeek?: (habitId: string, weekStartDate: string, completed: boolean) => void
  onEdit?: (habit: Habit) => void
  onDelete?: (habitId: string) => void
}

export function HabitCard({ habit, currentWeekStart, onToggleWeek, onEdit, onDelete }: HabitCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  // Find current week progress
  const currentWeekProgress = habit.weeklyProgress.find(
    (p) => p.weekStartDate === currentWeekStart
  )
  const isCheckedThisWeek = currentWeekProgress?.completed ?? false

  // Calculate streak (consecutive weeks from most recent)
  const calculateStreak = () => {
    let streak = 0
    const sorted = [...habit.weeklyProgress].sort(
      (a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime()
    )
    
    for (const week of sorted) {
      if (week.completed) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  // Calculate completion rate (percentage of last 12 weeks)
  const calculateCompletionRate = () => {
    const recentWeeks = habit.weeklyProgress.slice(-12)
    if (recentWeeks.length === 0) return 0
    const completed = recentWeeks.filter((w) => w.completed).length
    return Math.round((completed / recentWeeks.length) * 100)
  }

  // Get last 8 weeks for mini trend visualization
  const getRecentTrend = () => {
    return habit.weeklyProgress.slice(-8)
  }

  const streak = calculateStreak()
  const completionRate = calculateCompletionRate()
  const recentTrend = getRecentTrend()

  return (
    <div data-testid="habit-card" className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/50 dark:border-slate-800/50 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300 group transform hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            data-testid="habit-checkbox"
            onClick={() => onToggleWeek?.(habit.id, currentWeekStart, !isCheckedThisWeek)}
            className={`flex-shrink-0 mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
              isCheckedThisWeek
                ? 'bg-teal-500 border-teal-500'
                : 'border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-500'
            }`}
          >
            {isCheckedThisWeek && <Check className="w-4 h-4 text-white" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {habit.description}
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            onBlur={() => setTimeout(() => setShowMenu(false), 200)}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
              <button
                onClick={() => {
                  onEdit?.(habit)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete?.(habit.id)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 mb-3">
        {streak > 0 && (
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {streak}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Week Streak
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            {completionRate}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Complete
          </div>
        </div>
      </div>

      {/* Mini Trend Visualization */}
      <div className="flex items-center gap-1.5">
        <TrendingUp className="w-4 h-4 text-slate-400 dark:text-slate-600 mr-1" />
        {recentTrend.map((week, idx) => (
          <div
            key={idx}
            className={`h-8 w-full rounded-sm ${
              week.completed
                ? 'bg-teal-200 dark:bg-teal-800/50'
                : 'bg-slate-100 dark:bg-slate-800'
            }`}
            title={week.weekStartDate}
          />
        ))}
      </div>
    </div>
  )
}
