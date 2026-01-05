import { NextResponse } from 'next/server'
import { toggleMockHabitWeek } from '@/lib/mock-data/goals-habits-data'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  try {
    const { habitId } = await params
    const body = await request.json()
    const { weekStartDate, completed } = body
    
    if (!weekStartDate || typeof weekStartDate !== 'string') {
      return NextResponse.json(
        { error: 'weekStartDate is required and must be a string' },
        { status: 400 }
      )
    }
    
    if (typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'completed must be a boolean' },
        { status: 400 }
      )
    }
    
    const habit = toggleMockHabitWeek(habitId, weekStartDate, completed)
    
    if (!habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error toggling habit week:', error)
    return NextResponse.json(
      { error: 'Failed to toggle habit week' },
      { status: 500 }
    )
  }
}
