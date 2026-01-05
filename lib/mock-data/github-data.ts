import type { Week, WeekAggregate, UserRepository, GitHubEvent } from '@/lib/types/github-dashboard'
import { calculateWeek, getWeekStatus } from '@/lib/utils/week-calculations'
import { computeWeekAggregate } from '@/lib/utils/aggregation'

// Mock GitHub connection state
export interface MockGitHubConnection {
  connected: boolean
  githubUsername: string | null
  lastSyncedAt: string | null
  syncInProgress: boolean
}

// In-memory storage (will be replaced with database later)
const mockConnection: MockGitHubConnection = {
  connected: true,
  githubUsername: 'alexmorgan',
  lastSyncedAt: new Date().toISOString(),
  syncInProgress: false
}

const mockRepositories: UserRepository[] = [
  {
    id: 'user-repo-001',
    userId: 'dev-user-1',
    repoId: 'repo-001',
    repoName: 'devtrackr-api',
    repoOwner: 'alexmorgan',
    included: true,
    excluded: false,
    defaultCategory: 'core-product'
  },
  {
    id: 'user-repo-002',
    userId: 'dev-user-1',
    repoId: 'repo-002',
    repoName: 'devtrackr-web',
    repoOwner: 'alexmorgan',
    included: true,
    excluded: false,
    defaultCategory: 'core-product'
  },
  {
    id: 'user-repo-003',
    userId: 'dev-user-1',
    repoId: 'repo-003',
    repoName: 'docs',
    repoOwner: 'alexmorgan',
    included: true,
    excluded: false,
    defaultCategory: 'documentation'
  },
  {
    id: 'user-repo-004',
    userId: 'dev-user-1',
    repoId: 'repo-004',
    repoName: 'design-system',
    repoOwner: 'company-org',
    included: true,
    excluded: false,
    defaultCategory: 'external'
  },
  {
    id: 'user-repo-005',
    userId: 'dev-user-1',
    repoId: 'repo-005',
    repoName: 'experimental-scripts',
    repoOwner: 'alexmorgan',
    included: false,
    excluded: true,
    defaultCategory: 'experimental'
  },
  {
    id: 'user-repo-006',
    userId: 'dev-user-1',
    repoId: 'repo-006',
    repoName: 'legacy-app',
    repoOwner: 'alexmorgan',
    included: false,
    excluded: true,
    defaultCategory: 'archived'
  }
]

// Generate mock events for a given week
function generateMockEvents(weekId: string, weekStart: string, weekEnd: string): GitHubEvent[] {
  // Only generate events for the current/recent week
  const now = new Date()
  const weekStartDate = new Date(weekStart)
  const daysSinceWeekStart = Math.floor((now.getTime() - weekStartDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // No events for future weeks
  if (daysSinceWeekStart < 0) {
    return []
  }
  
  // Generate sample events
  return [
    {
      id: 'evt-001',
      weekId,
      repoId: 'repo-001',
      repoName: 'devtrackr-api',
      eventType: 'pull_request',
      title: 'Add weekly aggregate calculation endpoint',
      date: `${weekStart}T14:30:00Z`,
      url: 'https://github.com/alexmorgan/devtrackr-api/pull/142',
      status: 'merged'
    },
    {
      id: 'evt-002',
      weekId,
      repoId: 'repo-001',
      repoName: 'devtrackr-api',
      eventType: 'pull_request',
      title: 'Fix timezone handling in week boundaries',
      date: `${weekStart}T10:15:00Z`,
      url: 'https://github.com/alexmorgan/devtrackr-api/pull/143',
      status: 'merged'
    },
    {
      id: 'evt-003',
      weekId,
      repoId: 'repo-001',
      repoName: 'devtrackr-api',
      eventType: 'review',
      title: 'Review: Update authentication middleware',
      date: `${weekStart}T16:45:00Z`,
      url: 'https://github.com/alexmorgan/devtrackr-api/pull/140#review-12345',
      status: 'approved'
    },
    {
      id: 'evt-004',
      weekId,
      repoId: 'repo-002',
      repoName: 'devtrackr-web',
      eventType: 'pull_request',
      title: 'Implement dashboard weekly navigation',
      date: `${weekStart}T09:00:00Z`,
      url: 'https://github.com/alexmorgan/devtrackr-web/pull/87',
      status: 'merged'
    },
    {
      id: 'evt-005',
      weekId,
      repoId: 'repo-002',
      repoName: 'devtrackr-web',
      eventType: 'review',
      title: 'Review: Update design tokens',
      date: `${weekStart}T13:20:00Z`,
      url: 'https://github.com/alexmorgan/devtrackr-web/pull/86#review-23456',
      status: 'approved'
    },
    {
      id: 'evt-006',
      weekId,
      repoId: 'repo-003',
      repoName: 'docs',
      eventType: 'pull_request',
      title: 'Document weekly aggregate API endpoints',
      date: `${weekStart}T11:30:00Z`,
      url: 'https://github.com/alexmorgan/docs/pull/24',
      status: 'merged'
    },
    {
      id: 'evt-007',
      weekId,
      repoId: 'repo-001',
      repoName: 'devtrackr-api',
      eventType: 'commit',
      title: 'Update dependencies',
      date: `${weekStart}T15:00:00Z`,
      url: 'https://github.com/alexmorgan/devtrackr-api/commit/abc123',
      status: 'committed'
    },
    {
      id: 'evt-008',
      weekId,
      repoId: 'repo-001',
      repoName: 'devtrackr-api',
      eventType: 'commit',
      title: 'Fix typo in README',
      date: `${weekStart}T08:30:00Z`,
      url: 'https://github.com/alexmorgan/devtrackr-api/commit/def456',
      status: 'committed'
    }
  ]
}

/**
 * Get mock GitHub connection status
 */
export function getMockGitHubConnection(): MockGitHubConnection {
  return mockConnection
}

/**
 * Get mock week data
 */
export function getMockWeek(
  userId: string,
  weekId: string,
  timezone: string,
  weekStartsOn: 'sunday' | 'monday'
): Week | null {
  // Calculate the requested week
  const weekCalc = calculateWeek(new Date(), timezone, weekStartsOn)
  
  // For simplicity, we'll derive from weekId
  // In a real app, this would query the database
  const startDate = weekId.replace('week-', '')
  const calc = calculateWeek(new Date(startDate), timezone, weekStartsOn)
  
  return {
    id: calc.weekId,
    userId,
    startDate: calc.startDate,
    endDate: calc.endDate,
    status: getWeekStatus(calc.startDate, timezone),
    lockedAt: null
  }
}

/**
 * Get mock week aggregate
 */
export function getMockWeekAggregate(
  weekId: string,
  userId: string,
  weekStart: string,
  weekEnd: string
): WeekAggregate {
  const events = generateMockEvents(weekId, weekStart, weekEnd)
  return computeWeekAggregate(weekId, userId, events, weekStart)
}

/**
 * Get mock user repositories
 */
export function getMockUserRepositories(userId: string): UserRepository[] {
  return mockRepositories.filter(repo => repo.userId === userId)
}

/**
 * Get mock GitHub events for a week
 */
export function getMockGitHubEvents(weekId: string, weekStart: string, weekEnd: string): GitHubEvent[] {
  return generateMockEvents(weekId, weekStart, weekEnd)
}

/**
 * Toggle repository inclusion/exclusion
 */
export function toggleMockRepository(repoId: string, included: boolean): UserRepository | null {
  const repo = mockRepositories.find(r => r.repoId === repoId)
  if (repo) {
    repo.included = included
    repo.excluded = !included
    return repo
  }
  return null
}

/**
 * Filter events by repository (for drill-down)
 */
export function getMockEventsByRepo(
  weekId: string,
  repoId: string,
  weekStart: string,
  weekEnd: string
): GitHubEvent[] {
  const allEvents = generateMockEvents(weekId, weekStart, weekEnd)
  return allEvents.filter(event => event.repoId === repoId)
}

/**
 * Filter events by metric type (for drill-down)
 */
export function getMockEventsByMetric(
  weekId: string,
  repoId: string,
  metricType: 'prs' | 'reviews' | 'commits',
  weekStart: string,
  weekEnd: string
): GitHubEvent[] {
  const allEvents = generateMockEvents(weekId, weekStart, weekEnd)
  const typeMap = {
    prs: 'pull_request',
    reviews: 'review',
    commits: 'commit'
  }
  
  return allEvents.filter(
    event => event.repoId === repoId && event.eventType === typeMap[metricType]
  )
}
