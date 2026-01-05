import { NextResponse } from 'next/server'
import { getMockGitHubConnection } from '@/lib/mock-data/github-data'

export async function GET() {
  try {
    const connection = getMockGitHubConnection()
    return NextResponse.json(connection)
  } catch (error) {
    console.error('Error fetching GitHub connection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub connection' },
      { status: 500 }
    )
  }
}
