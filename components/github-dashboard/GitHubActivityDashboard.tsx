import type { GitHubActivityDashboardProps } from '@/lib/types/github-dashboard'
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { RepositoryStatsTable } from './RepositoryStatsTable'
import { DailyDistributionChart } from './DailyDistributionChart'
import { InsightsSection } from './InsightsSection'

export function GitHubActivityDashboard({
  week,
  weekAggregate,
  userRepositories,
  githubEvents,
  showExcluded = false,
  onPreviousWeek,
  onNextWeek,
  onDrillDownRepo,
  onDrillDownMetric,
  onManageRepositories,
  onToggleRepository,
  onToggleShowExcluded,
}: GitHubActivityDashboardProps) {
  // Filter repositories based on showExcluded flag
  const displayedRepos = weekAggregate.repositoryStats.filter(stat => {
    const userRepo = userRepositories.find(ur => ur.repoId === stat.repoId)
    return userRepo && (showExcluded || userRepo.included)
  })

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${endDate.toLocaleDateString('en-US', options)}`
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header with week navigation */}
        <header className="mb-8 animate-slideDown">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={onPreviousWeek}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-all duration-300 transform hover:scale-110"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              
              <div>
                <h1 className="font-serif text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {formatDateRange(week.startDate, week.endDate)}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded transition-all duration-300 ${
                    week.status === 'open' 
                      ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {week.status}
                  </span>
                </div>
              </div>

              <button
                onClick={onNextWeek}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-all duration-300 transform hover:scale-110"
                aria-label="Next week"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <button
              onClick={onManageRepositories}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              <Settings className="w-4 h-4" />
              <span>Manage Repos</span>
            </button>
          </div>
        </header>

        {/* Insights section */}
        {weekAggregate.insights.length > 0 && (
          <InsightsSection insights={weekAggregate.insights} />
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-scaleIn" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              PRs Merged
            </div>
            <div className="text-3xl font-mono font-semibold text-teal-800 dark:text-teal-200">
              {weekAggregate.totalPrsMerged}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Reviews
            </div>
            <div className="text-3xl font-mono font-semibold text-teal-800 dark:text-teal-200">
              {weekAggregate.totalReviews}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Commits
            </div>
            <div className="text-3xl font-mono font-light text-slate-500 dark:text-slate-400">
              {weekAggregate.totalCommits}
            </div>
          </div>
        </div>

        {/* Daily distribution chart */}
        <div className="mb-8 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="font-serif text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
            Daily Distribution
          </h2>
          <DailyDistributionChart data={weekAggregate.dailyDistribution} />
        </div>

        {/* Repository breakdown */}
        <div className="animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-medium text-slate-900 dark:text-slate-100">
              Repository Breakdown
            </h2>
            <button
              onClick={onToggleShowExcluded}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-300 transform hover:scale-105"
            >
              {showExcluded ? 'Hide' : 'Show'} excluded repos
            </button>
          </div>
          
          <RepositoryStatsTable
            stats={displayedRepos}
            userRepositories={userRepositories}
            showExcluded={showExcluded}
            onDrillDownRepo={onDrillDownRepo}
            onDrillDownMetric={onDrillDownMetric}
          />
        </div>
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

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  )
}
