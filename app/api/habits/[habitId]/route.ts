import { NextResponse } from 'next/server'
import { updateMockHabit, deleteMockHabit } from '@/lib/mock-data/goals-habits-data'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  try {
    const { habitId } = await params
    const body = await request.json()
    
    const habit = updateMockHabit(habitId, body)
    
    if (!habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error updating habit:', error)
    return NextResponse.json(
      { error: 'Failed to update habit' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  try {
    const { habitId } = await params
    
    const success = deleteMockHabit(habitId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return NextResponse.json(
      { error: 'Failed to delete habit' },
      { status: 500 }
    )
  }
}
