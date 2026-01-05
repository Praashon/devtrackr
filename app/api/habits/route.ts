import { NextResponse } from 'next/server'
import { createMockHabit } from '@/lib/mock-data/goals-habits-data'

const MOCK_USER_ID = 'dev-user-1'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description } = body
    
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'title is required and must be a string' },
        { status: 400 }
      )
    }
    
    const habit = createMockHabit(MOCK_USER_ID, {
      title,
      description: description || null,
    })
    
    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    )
  }
}
