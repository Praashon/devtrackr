import { NextResponse } from 'next/server'
import { createMockGoal } from '@/lib/mock-data/goals-habits-data'

const MOCK_USER_ID = 'dev-user-1'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, status, targetDate } = body
    
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'title is required and must be a string' },
        { status: 400 }
      )
    }
    
    if (!status || !['active', 'completed', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'status is required and must be one of: active, completed, archived' },
        { status: 400 }
      )
    }
    
    if (!targetDate || typeof targetDate !== 'string') {
      return NextResponse.json(
        { error: 'targetDate is required and must be a string' },
        { status: 400 }
      )
    }
    
    const goal = createMockGoal(MOCK_USER_ID, {
      title,
      description: description || null,
      status,
      targetDate,
    })
    
    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}
