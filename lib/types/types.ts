// =============================================================================
// User & Authentication
// =============================================================================

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  timezone: string
  weekStartsOn: 'sunday' | 'monday'
  createdAt: string
  updatedAt: string
}

export interface GitHubConnection {
  id: string
  userId: string
  githubUsername: string
  accessToken: string // encrypted
  lastSyncedAt: string | null
  syncCursor?: string
  rateLimitRemaining?: number
  rateLimitResetAt?: string
}

// =============================================================================
// Repositories
// =============================================================================

export interface Repository {
  id: string
  githubRepoId: string
  name: string
  owner: string
  visibility: 'public' | 'private'
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

// =============================================================================
// GitHub Activity
// =============================================================================

export interface GitHubEvent {
  id: string
  userId: string
  weekId: string
  repoId: string
  repoName: string
  eventType: 'pull_request' | 'review' | 'commit'
  title: string
  date: string
  url: string
  status: string
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

// =============================================================================
// Weeks & Reviews
// =============================================================================

export interface Week {
  id: string
  userId: string
  startDate: string
  endDate: string
  status: 'open' | 'closed'
  lockedAt: string | null
}

export interface ActivitySummary {
  totalCommits: number
  pullRequests: number
  reviews: number
  reposWorkedOn: string[]
  impactScore: number
}

export interface Target {
  id: string
  text: string
  completed: boolean
}

export interface Reflections {
  wins: string
  blockers: string
  nextFocus: string
}

export interface WeeklyReview {
  id: string
  userId: string
  weekId: string
  weekStartDate: string
  weekEndDate: string
  status: 'complete' | 'incomplete'
  completedAt: string | null
  activitySummary: ActivitySummary
  reflections: Reflections
  targets: Target[]
}

// =============================================================================
// Goals & Habits
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

export interface HabitCompletion {
  id: string
  habitId: string
  weekId: string
  completed: boolean
}

// =============================================================================
// Tags
// =============================================================================

export interface Tag {
  id: string
  userId: string
  name: string
  color: string
}

export interface GoalTag {
  goalId: string
  tagId: string
}

// =============================================================================
// Trend Analytics
// =============================================================================

export interface WeeklyTrend {
  weekStartDate: string
  impactScore: number
  prsMerged: number
  reviews: number
  commits: number
}

export interface RepositoryFocus {
  repoName: string
  impactShare: number
  prsMerged: number
  reviews: number
}

export interface DayOfWeekDistribution {
  Monday: number
  Tuesday: number
  Wednesday: number
  Thursday: number
  Friday: number
  Saturday: number
  Sunday: number
}

export interface ConsistencyMetrics {
  weeklyReviewCompletionRate: number
  habitAdherenceRate: number
  goalsSetInWindow: number
  goalsCompletedInWindow: number
  goalSuccessRate: number
}

export interface Observation {
  id: string
  type: 'streak' | 'comparison' | 'pattern' | 'consistency'
  text: string
}

// =============================================================================
// Export & Reporting
// =============================================================================

export interface ShareLink {
  id: string
  url: string
  createdAt: string
  expiresAt: string | null
  views: number
  isActive: boolean
}

export interface ExportReport {
  id: string
  userId: string
  type: 'weekly' | 'range'
  format: 'pdf' | 'markdown'
  periodStart: string
  periodEnd: string
  generatedAt: string
  fileSize: string
  fileName: string
  includeDetails: boolean
  shareLink: ShareLink | null
}

export interface ReportConfig {
  reportType: 'weekly' | 'range'
  format: 'pdf' | 'markdown'
  includeDetailedGoals: boolean
  includeDetailedHabits: boolean
  selectedWeek: string | null
  selectedRangeStart: string | null
  selectedRangeEnd: string | null
}
