import { NextResponse } from 'next/server'
import { toggleMockRepository } from '@/lib/mock-data/github-data'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ repoId: string }> }
) {
  try {
    const { repoId } = await params
    const body = await request.json()
    const { included } = body
    
    if (typeof included !== 'boolean') {
      return NextResponse.json(
        { error: 'included must be a boolean' },
        { status: 400 }
      )
    }
    
    const repository = toggleMockRepository(repoId, included)
    
    if (!repository) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(repository)
  } catch (error) {
    console.error('Error toggling repository:', error)
    return NextResponse.json(
      { error: 'Failed to toggle repository' },
      { status: 500 }
    )
  }
}
