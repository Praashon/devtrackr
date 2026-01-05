import { NextResponse } from 'next/server'
import { getCurrentWeek } from '@/lib/utils/week-calculations'
import { getMockWeek, getMockWeekAggregate, getMockUserRepositories, getMockGitHubEvents } from '@/lib/mock-data/github-data'

// Mock user ID (would come from auth session in production)
const MOCK_USER_ID = 'dev-user-1'
const MOCK_TIMEZONE = 'America/New_York'
const MOCK_WEEK_STARTS_ON = 'monday'

export async function GET() {
  try {
    // Get current week calculation
    const weekCalc = getCurrentWeek(MOCK_TIMEZONE, MOCK_WEEK_STARTS_ON)
    
    // Get week data
    const week = getMockWeek(MOCK_USER_ID, weekCalc.weekId, MOCK_TIMEZONE, MOCK_WEEK_STARTS_ON)
    if (!week) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 })
    }
    
    // Get aggregate data
    const weekAggregate = getMockWeekAggregate(week.id, MOCK_USER_ID, week.startDate, week.endDate)
    
    // Get user repositories
    const userRepositories = getMockUserRepositories(MOCK_USER_ID)
    
    // Get GitHub events
    const githubEvents = getMockGitHubEvents(week.id, week.startDate, week.endDate)
    
    return NextResponse.json({
      week,
      weekAggregate,
      userRepositories,
      githubEvents
    })
  } catch (error) {
    console.error('Error fetching current week:', error)
    return NextResponse.json(
      { error: 'Failed to fetch current week' },
      { status: 500 }
    )
  }
}
