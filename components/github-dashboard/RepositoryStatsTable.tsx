import type { RepositoryStats } from '@/lib/types/github-dashboard'
import type { UserRepository } from '@/lib/types/github-dashboard'

interface RepositoryStatsTableProps {
  stats: RepositoryStats[]
  userRepositories: UserRepository[]
  showExcluded: boolean
  onDrillDownRepo?: (repoId: string) => void
  onDrillDownMetric?: (repoId: string, metricType: 'prs' | 'reviews' | 'commits') => void
}

export function RepositoryStatsTable({
  stats,
  userRepositories,
  showExcluded,
  onDrillDownRepo,
  onDrillDownMetric,
}: RepositoryStatsTableProps) {
  const getRepoStatus = (repoId: string) => {
    const userRepo = userRepositories.find(ur => ur.repoId === repoId)
    return userRepo?.excluded ? 'excluded' : 'included'
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-lg transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Repository
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                PRs Merged
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Reviews
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Commits
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Impact
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {stats.map((stat, index) => {
              const isExcluded = getRepoStatus(stat.repoId) === 'excluded'
              const rowClasses = isExcluded 
                ? 'opacity-50 animate-fadeIn' 
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 animate-fadeIn'

              return (
                <tr key={stat.repoId} className={rowClasses} style={{ animationDelay: `${index * 0.05}s` }}>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDrillDownRepo?.(stat.repoId)}
                      className="text-left group"
                    >
                      <div className="font-mono text-sm text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-all duration-300 transform group-hover:translate-x-1">
                        {stat.repoName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {stat.repoOwner}
                      </div>
                      {isExcluded && (
                        <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          excluded
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDrillDownMetric?.(stat.repoId, 'prs')}
                      className="font-mono text-base font-semibold text-teal-800 dark:text-teal-200 hover:text-teal-700 dark:hover:text-teal-300 transition-all duration-300 transform hover:scale-110"
                    >
                      {stat.mergedPrs}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDrillDownMetric?.(stat.repoId, 'reviews')}
                      className="font-mono text-base font-semibold text-teal-800 dark:text-teal-200 hover:text-teal-700 dark:hover:text-teal-300 transition-all duration-300 transform hover:scale-110"
                    >
                      {stat.reviews}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDrillDownMetric?.(stat.repoId, 'commits')}
                      className="font-mono text-base font-light text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-300 transform hover:scale-110"
                    >
                      {stat.commits}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                      {stat.weightedScore}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {stats.length === 0 && (
        <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
          No activity this week
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  )
}
