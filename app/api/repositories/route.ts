import { NextResponse } from 'next/server'
import { getMockUserRepositories } from '@/lib/mock-data/github-data'

const MOCK_USER_ID = 'dev-user-1'

export async function GET() {
  try {
    const repositories = getMockUserRepositories(MOCK_USER_ID)
    return NextResponse.json(repositories)
  } catch (error) {
    console.error('Error fetching repositories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}
