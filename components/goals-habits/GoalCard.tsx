import type { Goal } from '@/lib/types/goals-habits'
import { Calendar, Archive, Trash2, MoreVertical, Edit } from 'lucide-react'
import { useState } from 'react'

interface GoalCardProps {
  goal: Goal
  onEdit?: (goal: Goal) => void
  onDelete?: (goalId: string) => void
  onArchive?: (goalId: string) => void
}

export function GoalCard({ goal, onEdit, onDelete, onArchive }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const getWeeksInfo = () => {
    if (goal.status === 'completed' && goal.completedDate) {
      const completed = new Date(goal.completedDate)
      return `Completed ${completed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
    
    if (goal.targetDate) {
      const target = new Date(goal.targetDate)
      const today = new Date()
      const diffTime = target.getTime() - today.getTime()
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
      
      if (diffWeeks < 0) {
        return `${Math.abs(diffWeeks)} weeks overdue`
      } else if (diffWeeks === 0) {
        return 'Due this week'
      } else {
        return `${diffWeeks} weeks remaining`
      }
    }
    
    const created = new Date(goal.createdDate)
    const today = new Date()
    const diffTime = today.getTime() - created.getTime()
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
    return `${diffWeeks} weeks active`
  }

  const statusColors = {
    active: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    completed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    archived: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
  }

  return (
    <div data-testid="goal-card" className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/50 dark:border-slate-800/50 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300 group transform hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {goal.title}
          </h3>
          {goal.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {goal.description}
            </p>
          )}
        </div>
        
        <div className="relative flex items-center gap-2">
          <span data-testid="goal-status" className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${statusColors[goal.status]}`}>
            {goal.status}
          </span>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
              <button
                onClick={() => {
                  onEdit?.(goal)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              {goal.status === 'active' && (
                <button
                  onClick={() => {
                    onArchive?.(goal.id)
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              )}
              <button
                onClick={() => {
                  onDelete?.(goal.id)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-red-600 dark:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
        <Calendar className="w-4 h-4" />
        <span>{getWeeksInfo()}</span>
      </div>
    </div>
  )
}
