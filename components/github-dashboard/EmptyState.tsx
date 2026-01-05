'use client'

import { Github } from 'lucide-react'

interface EmptyStateProps {
  type: 'no-connection' | 'no-activity' | 'syncing'
  onConnect?: () => void
}

export function EmptyState({ type, onConnect }: EmptyStateProps) {
  if (type === 'no-connection') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 text-center">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Github className="w-8 h-8 text-teal-700 dark:text-teal-300" />
          </div>
          
          <h2 className="font-serif text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Connect Your GitHub Account
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Connect GitHub to automatically sync your pull requests, reviews, and commits. 
            Your activity will be aggregated into weekly signals to help you understand your progress.
          </p>
          
          <button
            onClick={onConnect}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium transition-colors transform hover:scale-105"
          >
            Connect GitHub
          </button>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            We only request read access to your public repositories and activity
          </p>
        </div>
      </div>
    )
  }
  
  if (type === 'syncing') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 text-center">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Github className="w-8 h-8 text-teal-700 dark:text-teal-300 animate-spin" />
          </div>
          
          <h2 className="font-serif text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Syncing GitHub Activity
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400">
            We're fetching your recent activity from GitHub. This usually takes a few seconds...
          </p>
        </div>
      </div>
    )
  }
  
  if (type === 'no-activity') {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 text-center">
        <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No Activity This Week
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400">
          No GitHub activity recorded for this week yet. Activity will appear here after your next sync or when you create PRs, reviews, or commits.
        </p>
      </div>
    )
  }
  
  return null
}
