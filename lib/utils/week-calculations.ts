import { addDays, startOfWeek, endOfWeek, parseISO, formatISO, isWithinInterval } from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

export interface WeekCalculation {
  startDate: string
  endDate: string
  weekId: string
}

/**
 * Calculate week boundaries based on user timezone and week-start preference
 */
export function calculateWeek(
  date: Date,
  timezone: string,
  weekStartsOn: 'sunday' | 'monday'
): WeekCalculation {
  // Convert to user's timezone
  const zonedDate = toZonedTime(date, timezone)
  
  // Calculate week boundaries
  const weekStart = startOfWeek(zonedDate, {
    weekStartsOn: weekStartsOn === 'sunday' ? 0 : 1
  })
  
  const weekEnd = endOfWeek(zonedDate, {
    weekStartsOn: weekStartsOn === 'sunday' ? 0 : 1
  })
  
  // Convert back to UTC for storage
  const startDate = fromZonedTime(weekStart, timezone)
  const endDate = fromZonedTime(weekEnd, timezone)
  
  // Generate week ID (format: week-YYYY-MM-DD based on start date)
  const weekId = `week-${formatISO(startDate, { representation: 'date' })}`
  
  return {
    startDate: formatISO(startDate, { representation: 'date' }),
    endDate: formatISO(endDate, { representation: 'date' }),
    weekId
  }
}

/**
 * Get current week based on user preferences
 */
export function getCurrentWeek(timezone: string, weekStartsOn: 'sunday' | 'monday'): WeekCalculation {
  return calculateWeek(new Date(), timezone, weekStartsOn)
}

/**
 * Navigate to previous week
 */
export function getPreviousWeek(
  currentStartDate: string,
  timezone: string,
  weekStartsOn: 'sunday' | 'monday'
): WeekCalculation {
  const current = parseISO(currentStartDate)
  const previousDate = addDays(current, -7)
  return calculateWeek(previousDate, timezone, weekStartsOn)
}

/**
 * Navigate to next week
 */
export function getNextWeek(
  currentStartDate: string,
  timezone: string,
  weekStartsOn: 'sunday' | 'monday'
): WeekCalculation {
  const current = parseISO(currentStartDate)
  const nextDate = addDays(current, 7)
  return calculateWeek(nextDate, timezone, weekStartsOn)
}

/**
 * Check if a date falls within a week
 */
export function isDateInWeek(date: string, weekStart: string, weekEnd: string): boolean {
  return isWithinInterval(parseISO(date), {
    start: parseISO(weekStart),
    end: parseISO(weekEnd)
  })
}

/**
 * Determine if a week is open (current or future) or closed (past)
 */
export function getWeekStatus(weekStartDate: string, timezone: string): 'open' | 'closed' {
  const today = toZonedTime(new Date(), timezone)
  const weekStart = toZonedTime(parseISO(weekStartDate), timezone)
  
  return weekStart <= today ? 'open' : 'closed'
}
