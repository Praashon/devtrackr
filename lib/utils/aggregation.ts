import type { GitHubEvent, WeekAggregate, DailyActivity, RepositoryStats } from '@/lib/types/github-dashboard'

// Weighting formula: PR=10, Review=5, Commit=1
const WEIGHTS = {
  pull_request: 10,
  review: 5,
  commit: 1
} as const

/**
 * Calculate weighted score for events
 */
export function calculateWeightedScore(events: GitHubEvent[]): number {
  return events.reduce((total, event) => {
    return total + (WEIGHTS[event.eventType] || 0)
  }, 0)
}

/**
 * Group events by repository
 */
function groupEventsByRepo(events: GitHubEvent[]): Map<string, GitHubEvent[]> {
  const grouped = new Map<string, GitHubEvent[]>()
  
  events.forEach(event => {
    if (!grouped.has(event.repoId)) {
      grouped.set(event.repoId, [])
    }
    grouped.get(event.repoId)!.push(event)
  })
  
  return grouped
}

/**
 * Group events by day of week
 */
function groupEventsByDay(events: GitHubEvent[], weekStart: string): DailyActivity[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dailyMap = new Map<string, number>()
  
  // Initialize all days
  const startDate = new Date(weekStart)
  days.forEach((day, index) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + index)
    const dateStr = date.toISOString().split('T')[0]
    dailyMap.set(dateStr, 0)
  })
  
  // Aggregate events by day
  events.forEach(event => {
    const eventDate = event.date.split('T')[0] // Get date portion
    const currentScore = dailyMap.get(eventDate) || 0
    const eventWeight = WEIGHTS[event.eventType] || 0
    dailyMap.set(eventDate, currentScore + eventWeight)
  })
  
  // Convert to array
  const distribution: DailyActivity[] = []
  const entries = Array.from(dailyMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  
  entries.forEach(([date, activity], index) => {
    distribution.push({
      day: days[index] || days[0],
      date,
      activity
    })
  })
  
  return distribution
}

/**
 * Calculate repository stats
 */
function calculateRepositoryStats(repoEvents: Map<string, GitHubEvent[]>): RepositoryStats[] {
  const stats: RepositoryStats[] = []
  
  repoEvents.forEach((events, repoId) => {
    if (events.length === 0) return
    
    const mergedPrs = events.filter(e => e.eventType === 'pull_request' && e.status === 'merged').length
    const reviews = events.filter(e => e.eventType === 'review').length
    const commits = events.filter(e => e.eventType === 'commit').length
    const weightedScore = calculateWeightedScore(events)
    
    stats.push({
      repoId,
      repoName: events[0].repoName,
      repoOwner: events[0].repoName.split('/')[0] || 'unknown', // Fallback
      mergedPrs,
      reviews,
      commits,
      weightedScore,
      impactRank: 0 // Will be assigned after sorting
    })
  })
  
  // Sort by weighted score descending and assign ranks
  stats.sort((a, b) => b.weightedScore - a.weightedScore)
  stats.forEach((stat, index) => {
    stat.impactRank = index + 1
  })
  
  return stats
}

/**
 * Generate insights based on weekly data
 */
export function generateInsights(
  repositoryStats: RepositoryStats[],
  dailyDistribution: DailyActivity[],
  totalPrsMerged: number,
  totalReviews: number
): string[] {
  const insights: string[] = []
  
  // Primary focus repo (highest weighted score)
  if (repositoryStats.length > 0 && repositoryStats[0].weightedScore > 0) {
    const topRepo = repositoryStats[0]
    const totalScore = repositoryStats.reduce((sum, r) => sum + r.weightedScore, 0)
    const percentage = Math.round((topRepo.weightedScore / totalScore) * 100)
    
    if (percentage > 40) {
      insights.push(`Primary focus: ${topRepo.repoName} (${percentage}% of weighted activity)`)
    }
  }
  
  // Mid-week concentration
  const midWeekActivity = dailyDistribution.slice(1, 4).reduce((sum, d) => sum + d.activity, 0)
  const totalActivity = dailyDistribution.reduce((sum, d) => sum + d.activity, 0)
  
  if (totalActivity > 0 && midWeekActivity / totalActivity > 0.6) {
    insights.push('Activity concentrated mid-week (Tue-Thu)')
  }
  
  // Review-heavy week
  if (totalReviews > totalPrsMerged && totalReviews > 5) {
    insights.push(`Review-heavy week: ${totalReviews} reviews vs ${totalPrsMerged} PRs merged`)
  }
  
  // PR-heavy week
  if (totalPrsMerged > totalReviews && totalPrsMerged > 5) {
    insights.push(`PR-focused week: ${totalPrsMerged} PRs merged vs ${totalReviews} reviews`)
  }
  
  // Low activity weekend
  const weekendActivity = dailyDistribution.slice(5).reduce((sum, d) => sum + d.activity, 0)
  if (totalActivity > 0 && weekendActivity / totalActivity < 0.1) {
    insights.push('Strong work-life balance: minimal weekend activity')
  }
  
  return insights.slice(0, 3) // Max 3 insights
}

/**
 * Compute weekly aggregate from raw GitHub events
 */
export function computeWeekAggregate(
  weekId: string,
  userId: string,
  events: GitHubEvent[],
  weekStart: string
): WeekAggregate {
  const totalPrsMerged = events.filter(e => e.eventType === 'pull_request' && e.status === 'merged').length
  const totalReviews = events.filter(e => e.eventType === 'review').length
  const totalCommits = events.filter(e => e.eventType === 'commit').length
  const weightedScore = calculateWeightedScore(events)
  
  const repoEvents = groupEventsByRepo(events)
  const repositoryStats = calculateRepositoryStats(repoEvents)
  const dailyDistribution = groupEventsByDay(events, weekStart)
  const insights = generateInsights(repositoryStats, dailyDistribution, totalPrsMerged, totalReviews)
  
  return {
    weekId,
    userId,
    totalPrsMerged,
    totalReviews,
    totalCommits,
    weightedScore,
    insights,
    dailyDistribution,
    repositoryStats
  }
}
