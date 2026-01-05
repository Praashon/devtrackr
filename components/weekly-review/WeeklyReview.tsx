'use client'

import type { WeeklyReviewProps } from '@/lib/types/weekly-review'
import { Calendar, ChevronLeft, ChevronRight, Flame, Check, Plus, X } from 'lucide-react'
import { useState } from 'react'

export function WeeklyReview({
  currentReview,
  allReviews,
  currentStreak,
  onUpdateReflection,
  onAddTarget,
  onRemoveTarget,
  onToggleTarget,
  onCompleteReview,
  onNavigateToWeek,
  onPreviousWeek,
  onNextWeek,
}: WeeklyReviewProps) {
  const [newTarget, setNewTarget] = useState('')
  const isComplete = currentReview.status === 'complete'

  const handleAddTarget = () => {
    if (newTarget.trim()) {
      onAddTarget?.(newTarget.trim())
      setNewTarget('')
    }
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    return `${startDate.toLocaleDateString('en-US', options)} – ${endDate.toLocaleDateString('en-US', options)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-orange-50/20 dark:from-slate-950 dark:via-teal-950/20 dark:to-orange-950/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header with Navigation */}
        <div className="mb-8 sm:mb-12 animate-slideDown">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onPreviousWeek}
              className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300 transform hover:scale-110"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>

            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300">
                <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {formatDateRange(currentReview.weekStartDate, currentReview.weekEndDate)}
                </h1>
              </div>
            </div>

            <button
              onClick={onNextWeek}
              className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300 transform hover:scale-110"
              aria-label="Next week"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Streak Indicator */}
          {currentStreak > 0 && (
            <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 animate-fadeIn" data-testid="streak-indicator">
              <Flame className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">
                {currentStreak} week streak
              </span>
            </div>
          )}
        </div>

        {/* Activity Summary Card */}
        <div className="mb-8 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-500/20 dark:shadow-teal-900/40 animate-scaleIn hover:scale-[1.02] transition-transform duration-300" data-testid="activity-summary">
          <h2 className="text-sm font-medium uppercase tracking-wider opacity-90 mb-4">
            This Week's Activity
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1" data-testid="commits-count">
                {currentReview.activitySummary.totalCommits}
              </div>
              <div className="text-sm opacity-80">Commits</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1" data-testid="prs-count">
                {currentReview.activitySummary.pullRequests}
              </div>
              <div className="text-sm opacity-80">Pull Requests</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1" data-testid="reviews-count">
                {currentReview.activitySummary.reviews}
              </div>
              <div className="text-sm opacity-80">Reviews</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1" data-testid="impact-score">
                {currentReview.activitySummary.impactScore}
              </div>
              <div className="text-sm opacity-80">Impact Score</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-sm opacity-80 mb-2">Repositories</div>
            <div className="flex flex-wrap gap-2">
              {currentReview.activitySummary.reposWorkedOn.map((repo) => (
                <span
                  key={repo}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-mono"
                >
                  {repo}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reflection Sections */}
        <div className="space-y-6 mb-8 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
          {/* Wins */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300">
            <label className="block text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-4">
              What went well?
            </label>
            <textarea
              value={currentReview.reflections.wins}
              onChange={(e) => onUpdateReflection?.('wins', e.target.value)}
              disabled={isComplete}
              className="w-full min-h-[120px] bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 resize-none focus:outline-none disabled:opacity-60"
              placeholder="Celebrate your wins this week..."
              data-testid="reflection-wins"
            />
          </div>

          {/* Blockers */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300">
            <label className="block text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-4">
              What blocked progress?
            </label>
            <textarea
              value={currentReview.reflections.blockers}
              onChange={(e) => onUpdateReflection?.('blockers', e.target.value)}
              disabled={isComplete}
              className="w-full min-h-[120px] bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 resize-none focus:outline-none disabled:opacity-60"
              placeholder="What got in the way this week..."
              data-testid="reflection-blockers"
            />
          </div>

          {/* Next Focus */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              What to focus on next week?
            </label>
            <textarea
              value={currentReview.reflections.nextFocus}
              onChange={(e) => onUpdateReflection?.('nextFocus', e.target.value)}
              disabled={isComplete}
              className="w-full min-h-[120px] bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 resize-none focus:outline-none disabled:opacity-60"
              placeholder="Set your focus areas for next week..."
              data-testid="reflection-nextFocus"
            />
          </div>
        </div>

        {/* Targets Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm mb-8 animate-slideInUp hover:shadow-md transition-all duration-300" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-6">
            Targets for Next Week
          </h3>

          <div className="space-y-3 mb-4" data-testid="targets-list">
            {currentReview.targets.map((target) => (
              <div
                key={target.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 group"
                data-testid="target-item"
              >
                <button
                  onClick={() => onToggleTarget?.(target.id)}
                  disabled={isComplete}
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    target.completed
                      ? 'bg-teal-500 border-teal-500'
                      : 'border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-500'
                  } disabled:opacity-60`}
                  data-testid="target-checkbox"
                >
                  {target.completed && <Check className="w-3 h-3 text-white" />}
                </button>
                <span
                  className={`flex-1 text-slate-900 dark:text-slate-100 ${
                    target.completed ? 'line-through opacity-60' : ''
                  }`}
                >
                  {target.text}
                </span>
                {!isComplete && (
                  <button
                    onClick={() => onRemoveTarget?.(target.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                    data-testid="target-remove"
                  >
                    <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {!isComplete && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTarget()}
                placeholder="Add a target..."
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                data-testid="target-input"
              />
              <button
                onClick={handleAddTarget}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-colors flex items-center gap-2"
                data-testid="target-add-button"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Complete Review Button */}
        {!isComplete && (
          <button
            onClick={onCompleteReview}
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg shadow-teal-500/30 dark:shadow-teal-900/50 transition-all hover:shadow-xl hover:shadow-teal-500/40 dark:hover:shadow-teal-900/60"
            data-testid="complete-review-button"
          >
            Complete This Week's Review
          </button>
        )}

        {isComplete && (
          <div className="text-center py-6 bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200/50 dark:border-teal-800/50" data-testid="review-completed">
            <div className="inline-flex items-center gap-2 text-teal-700 dark:text-teal-400 font-medium">
              <Check className="w-5 h-5" />
              Review completed on{' '}
              {new Date(currentReview.completedAt!).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
