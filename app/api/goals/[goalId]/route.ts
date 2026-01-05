import { NextResponse } from 'next/server'
import { updateMockGoal, deleteMockGoal, archiveMockGoal } from '@/lib/mock-data/goals-habits-data'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const { goalId } = await params
    const body = await request.json()
    
    const goal = updateMockGoal(goalId, body)
    
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(goal)
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const { goalId } = await params
    
    const success = deleteMockGoal(goalId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const { goalId } = await params
    const body = await request.json()
    const { action } = body
    
    if (action !== 'archive') {
      return NextResponse.json(
        { error: 'Invalid action. Only "archive" is supported' },
        { status: 400 }
      )
    }
    
    const goal = archiveMockGoal(goalId)
    
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(goal)
  } catch (error) {
    console.error('Error archiving goal:', error)
    return NextResponse.json(
      { error: 'Failed to archive goal' },
      { status: 500 }
    )
  }
}
