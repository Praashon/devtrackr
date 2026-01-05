'use client'

import { X } from 'lucide-react'
import type { GitHubEvent } from '@/lib/types/github-dashboard'

interface DrillDownPanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  events: GitHubEvent[]
}

export function DrillDownPanel({ isOpen, onClose, title, events }: DrillDownPanelProps) {
  if (!isOpen) return null
  
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-xl z-50 transform transition-transform">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {events.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                No events found
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 flex-1">
                        {event.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                        event.eventType === 'pull_request'
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200'
                          : event.eventType === 'review'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {event.eventType}
                      </span>
                    </div>
                    
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </div>
                    
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-700 dark:text-teal-300 hover:underline font-mono"
                    >
                      View on GitHub →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
