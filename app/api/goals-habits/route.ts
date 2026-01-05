import { NextResponse } from 'next/server'
import { getMockGoalsHabitsData } from '@/lib/mock-data/goals-habits-data'

const MOCK_USER_ID = 'dev-user-1'
const MOCK_TIMEZONE = 'America/New_York'
const MOCK_WEEK_STARTS_ON = 'sunday' as const

export async function GET() {
  try {
    const data = getMockGoalsHabitsData(MOCK_USER_ID, MOCK_TIMEZONE, MOCK_WEEK_STARTS_ON)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching goals and habits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goals and habits' },
      { status: 500 }
    )
  }
}
