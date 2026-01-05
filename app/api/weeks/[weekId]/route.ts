import { NextResponse } from 'next/server'
import { getMockWeek, getMockWeekAggregate, getMockUserRepositories, getMockGitHubEvents } from '@/lib/mock-data/github-data'

// Mock user data (would come from auth session in production)
const MOCK_USER_ID = 'dev-user-1'
const MOCK_TIMEZONE = 'America/New_York'
const MOCK_WEEK_STARTS_ON = 'monday'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ weekId: string }> }
) {
  try {
    const { weekId } = await params
    
    // Get week data
    const week = getMockWeek(MOCK_USER_ID, weekId, MOCK_TIMEZONE, MOCK_WEEK_STARTS_ON)
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
    console.error('Error fetching week:', error)
    return NextResponse.json(
      { error: 'Failed to fetch week' },
      { status: 500 }
    )
  }
}
