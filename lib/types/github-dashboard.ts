// =============================================================================
// Data Types
// =============================================================================

export interface Week {
  id: string
  userId: string
  startDate: string
  endDate: string
  status: 'open' | 'closed'
  lockedAt: string | null
}

export interface DailyActivity {
  day: string
  date: string
  activity: number
}

export interface RepositoryStats {
  repoId: string
  repoName: string
  repoOwner: string
  mergedPrs: number
  reviews: number
  commits: number
  weightedScore: number
  impactRank: number
}

export interface WeekAggregate {
  weekId: string
  userId: string
  totalPrsMerged: number
  totalReviews: number
  totalCommits: number
  weightedScore: number
  insights: string[]
  dailyDistribution: DailyActivity[]
  repositoryStats: RepositoryStats[]
}

export interface UserRepository {
  id: string
  userId: string
  repoId: string
  repoName: string
  repoOwner: string
  included: boolean
  excluded: boolean
  defaultCategory: string
}

export interface GitHubEvent {
  id: string
  weekId: string
  repoId: string
  repoName: string
  eventType: 'pull_request' | 'review' | 'commit'
  title: string
  date: string
  url: string
  status: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface GitHubActivityDashboardProps {
  /** The current week being displayed */
  week: Week
  /** Computed weekly aggregate data including stats, distribution, and insights */
  weekAggregate: WeekAggregate
  /** User repository preferences for inclusion/exclusion */
  userRepositories: UserRepository[]
  /** Raw GitHub events for drill-down views */
  githubEvents: GitHubEvent[]
  /** Whether to show excluded repositories in a dimmed state */
  showExcluded?: boolean
  /** Called when user navigates to the previous week */
  onPreviousWeek?: () => void
  /** Called when user navigates to the next week */
  onNextWeek?: () => void
  /** Called when user clicks on a repository to drill down */
  onDrillDownRepo?: (repoId: string) => void
  /** Called when user clicks on a metric (PRs, reviews, commits) to drill down */
  onDrillDownMetric?: (repoId: string, metricType: 'prs' | 'reviews' | 'commits') => void
  /** Called when user opens the manage repositories modal */
  onManageRepositories?: () => void
  /** Called when user toggles a repository's inclusion/exclusion */
  onToggleRepository?: (repoId: string, included: boolean) => void
  /** Called when user toggles the "show excluded" option */
  onToggleShowExcluded?: () => void
}
