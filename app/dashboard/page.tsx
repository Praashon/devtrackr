'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'
import { GitHubActivityDashboard } from '@/components/github-dashboard'
import { DrillDownPanel } from '@/components/github-dashboard/DrillDownPanel'
import { RepositoryManagementModal } from '@/components/github-dashboard/RepositoryManagementModal'
import type { Week, WeekAggregate, UserRepository, GitHubEvent } from '@/lib/types/github-dashboard'
import { getPreviousWeek, getNextWeek } from '@/lib/utils/week-calculations'

interface DashboardData {
  week: Week
  weekAggregate: WeekAggregate
  userRepositories: UserRepository[]
  githubEvents: GitHubEvent[]
}

// Mock user preferences (would come from auth context in production)
const MOCK_TIMEZONE = 'America/New_York'
const MOCK_WEEK_STARTS_ON = 'monday'

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showExcluded, setShowExcluded] = useState(false)
  
  // Drill-down state
  const [drillDownOpen, setDrillDownOpen] = useState(false)
  const [drillDownTitle, setDrillDownTitle] = useState('')
  const [drillDownEvents, setDrillDownEvents] = useState<GitHubEvent[]>([])
  
  // Repository management state
  const [repoModalOpen, setRepoModalOpen] = useState(false)
  
  // Fetch current week data on mount
  useEffect(() => {
    fetchCurrentWeek()
  }, [])
  
  const fetchCurrentWeek = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/weeks/current')
      if (!response.ok) {
        throw new Error('Failed to fetch current week')
      }
      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchWeek = async (weekId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/weeks/${weekId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch week')
      }
      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  const handlePreviousWeek = () => {
    if (!data) return
    const prevWeek = getPreviousWeek(data.week.startDate, MOCK_TIMEZONE, MOCK_WEEK_STARTS_ON)
    fetchWeek(prevWeek.weekId)
  }
  
  const handleNextWeek = () => {
    if (!data) return
    const nextWeek = getNextWeek(data.week.startDate, MOCK_TIMEZONE, MOCK_WEEK_STARTS_ON)
    fetchWeek(nextWeek.weekId)
  }
  
  const handleDrillDownRepo = (repoId: string) => {
    if (!data) return
    const repoEvents = data.githubEvents.filter(e => e.repoId === repoId)
    const repo = data.userRepositories.find(r => r.repoId === repoId)
    
    setDrillDownTitle(repo ? `${repo.repoName} - All Activity` : 'Repository Activity')
    setDrillDownEvents(repoEvents)
    setDrillDownOpen(true)
  }
  
  const handleDrillDownMetric = (repoId: string, metricType: 'prs' | 'reviews' | 'commits') => {
    if (!data) return
    
    const typeMap = {
      prs: 'pull_request',
      reviews: 'review',
      commits: 'commit'
    }
    
    const filteredEvents = data.githubEvents.filter(
      e => e.repoId === repoId && e.eventType === typeMap[metricType]
    )
    
    const repo = data.userRepositories.find(r => r.repoId === repoId)
    const metricLabel = metricType === 'prs' ? 'Pull Requests' : metricType.charAt(0).toUpperCase() + metricType.slice(1)
    
    setDrillDownTitle(repo ? `${repo.repoName} - ${metricLabel}` : metricLabel)
    setDrillDownEvents(filteredEvents)
    setDrillDownOpen(true)
  }
  
  const handleToggleRepository = async (repoId: string, included: boolean) => {
    try {
      const response = await fetch(`/api/repositories/${repoId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ included })
      })
      
      if (!response.ok) {
        throw new Error('Failed to toggle repository')
      }
      
      // Refresh data
      if (data) {
        fetchWeek(data.week.id)
      }
    } catch (err) {
      console.error('Error toggling repository:', err)
    }
  }
  
  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-slate-600 dark:text-slate-400">Loading...</div>
        </div>
      </AppLayout>
    )
  }
  
  if (error) {
    return (
      <AppLayout>
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </div>
      </AppLayout>
    )
  }
  
  if (!data) {
    return (
      <AppLayout>
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-slate-600 dark:text-slate-400">No data available</div>
        </div>
      </AppLayout>
    )
  }
  
  return (
    <AppLayout>
      <GitHubActivityDashboard
        week={data.week}
        weekAggregate={data.weekAggregate}
        userRepositories={data.userRepositories}
        githubEvents={data.githubEvents}
        showExcluded={showExcluded}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onDrillDownRepo={handleDrillDownRepo}
        onDrillDownMetric={handleDrillDownMetric}
        onManageRepositories={() => setRepoModalOpen(true)}
        onToggleShowExcluded={() => setShowExcluded(!showExcluded)}
      />
      
      <DrillDownPanel
        isOpen={drillDownOpen}
        onClose={() => setDrillDownOpen(false)}
        title={drillDownTitle}
        events={drillDownEvents}
      />
      
      <RepositoryManagementModal
        isOpen={repoModalOpen}
        onClose={() => setRepoModalOpen(false)}
        repositories={data.userRepositories}
        onToggleRepository={handleToggleRepository}
      />
    </AppLayout>
  )
}

