'use client'

import { X } from 'lucide-react'
import type { UserRepository } from '@/lib/types/github-dashboard'

interface RepositoryManagementModalProps {
  isOpen: boolean
  onClose: () => void
  repositories: UserRepository[]
  onToggleRepository: (repoId: string, included: boolean) => void
}

export function RepositoryManagementModal({
  isOpen,
  onClose,
  repositories,
  onToggleRepository
}: RepositoryManagementModalProps) {
  if (!isOpen) return null
  
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-serif text-xl font-semibold text-slate-900 dark:text-slate-100">
              Manage Repositories
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
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Toggle repositories to include or exclude them from your dashboard and analytics.
            </p>
            
            <div className="space-y-2">
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {repo.repoName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {repo.repoOwner}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Category: {repo.defaultCategory}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onToggleRepository(repo.repoId, !repo.included)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all transform hover:scale-105 ${
                      repo.included
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {repo.included ? 'Included' : 'Excluded'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors transform hover:scale-105"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
