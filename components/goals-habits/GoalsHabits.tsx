import type { GoalsHabitsProps, Goal, Habit } from '@/lib/types/goals-habits'
import { GoalCard } from './GoalCard'
import { HabitCard } from './HabitCard'
import { GoalModal } from './GoalModal'
import { HabitModal } from './HabitModal'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export function GoalsHabits({
  goals,
  habits,
  currentWeekStart,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
  onArchiveGoal,
  onCreateHabit,
  onUpdateHabit,
  onDeleteHabit,
  onToggleHabitWeek,
}: GoalsHabitsProps) {
  const [showArchivedGoals, setShowArchivedGoals] = useState(false)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [habitModalOpen, setHabitModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>()
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>()

  const activeGoals = goals.filter((g) => g.status === 'active')
  const completedGoals = goals.filter((g) => g.status === 'completed')
  const archivedGoals = goals.filter((g) => g.status === 'archived')

  const handleOpenCreateGoal = () => {
    setEditingGoal(undefined)
    setGoalModalOpen(true)
  }

  const handleOpenEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalModalOpen(true)
  }

  const handleOpenCreateHabit = () => {
    setEditingHabit(undefined)
    setHabitModalOpen(true)
  }

  const handleOpenEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setHabitModalOpen(true)
  }

  const handleSaveGoal = (goalData: any) => {
    if (editingGoal) {
      onUpdateGoal?.(editingGoal.id, goalData)
    } else {
      onCreateGoal?.(goalData)
    }
  }

  const handleSaveHabit = (habitData: any) => {
    if (editingHabit) {
      onUpdateHabit?.(editingHabit.id, habitData)
    } else {
      onCreateHabit?.(habitData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-orange-50/10 dark:from-slate-950 dark:via-teal-950/10 dark:to-orange-950/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Goals Section */}
        <section className="mb-12 animate-slideInLeft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Goals
            </h2>
            <button
              onClick={handleOpenCreateGoal}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300 text-sm font-medium transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Goal
            </button>
          </div>

          {activeGoals.length === 0 && completedGoals.length === 0 && archivedGoals.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200/50 dark:border-slate-800/50 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No goals yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Create your first goal to track progress on time-bound targets.
                </p>
                <button
                  onClick={handleOpenCreateGoal}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
                >
                  Create Your First Goal
                </button>
              </div>
            </div>
          )}

          {activeGoals.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Active
              </h3>
              {activeGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleOpenEditGoal}
                  onDelete={onDeleteGoal}
                  onArchive={onArchiveGoal}
                />
              ))}
            </div>
          )}

          {completedGoals.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Completed
              </h3>
              {completedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleOpenEditGoal}
                  onDelete={onDeleteGoal}
                  onArchive={onArchiveGoal}
                />
              ))}
            </div>
          )}

          {archivedGoals.length > 0 && (
            <div className="space-y-3">
              <button
                onClick={() => setShowArchivedGoals(!showArchivedGoals)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Archived ({archivedGoals.length})
                {showArchivedGoals ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showArchivedGoals && (
                <div className="space-y-3">
                  {archivedGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onEdit={handleOpenEditGoal}
                      onDelete={onDeleteGoal}
                      onArchive={onArchiveGoal}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Habits Section */}
        <section className="animate-slideInRight">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Habits
            </h2>
            <button
              onClick={handleOpenCreateHabit}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300 text-sm font-medium transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Habit
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200/50 dark:border-slate-800/50 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No habits yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Create your first habit to track weekly consistency.
                </p>
                <button
                  onClick={handleOpenCreateHabit}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
                >
                  Create Your First Habit
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  currentWeekStart={currentWeekStart}
                  onToggleWeek={onToggleHabitWeek}
                  onEdit={handleOpenEditHabit}
                  onDelete={onDeleteHabit}
                />
              ))}
            </div>
          )}
        </section>

        {/* Modals */}
        <GoalModal
          goal={editingGoal}
          isOpen={goalModalOpen}
          onClose={() => setGoalModalOpen(false)}
          onSave={handleSaveGoal}
        />
        <HabitModal
          habit={editingHabit}
          isOpen={habitModalOpen}
          onClose={() => setHabitModalOpen(false)}
          onSave={handleSaveHabit}
        />
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9); }
          50% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-popIn {
          animation: popIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
