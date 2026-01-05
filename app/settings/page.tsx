'use client'

import { useCurrentUser } from '@/lib/contexts/AuthContext'

export default function SettingsPage() {
  const { user, preferences } = useCurrentUser()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Manage your account preferences and integrations
        </p>
      </div>

      {/* Current User Info */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400">User ID:</span>
            <span className="ml-2 font-mono text-sm text-slate-900 dark:text-slate-100">{user?.id}</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Timezone:</span>
            <span className="ml-2 text-sm text-slate-900 dark:text-slate-100">{preferences.timezone}</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400">Week starts on:</span>
            <span className="ml-2 text-sm text-slate-900 dark:text-slate-100">
              {preferences.weekStartsOn === 'sunday' ? 'Sunday' : 'Monday'}
            </span>
          </div>
        </div>
      </div>

      {/* GitHub Integration (Stubbed for Phase 2) */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          GitHub Integration
        </h2>
        
        <div className="rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-teal-800 dark:text-teal-300">
                Phase 1: Mock Data Mode
              </h3>
              <div className="mt-2 text-sm text-teal-700 dark:text-teal-400">
                <p>
                  The GitHub Activity Dashboard currently uses mock data. Real GitHub OAuth integration
                  will be available in Phase 2 once OAuth credentials and database infrastructure are configured.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Connection Status
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Mock user - No real GitHub connection
              </p>
            </div>
            <button
              disabled
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-md cursor-not-allowed"
            >
              Connect GitHub (Phase 2)
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Repository Sync Settings
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Configure how often DevTrackr syncs your GitHub activity (available in Phase 2)
            </p>
            <div className="space-y-2 opacity-50">
              <label className="flex items-center">
                <input type="radio" disabled className="mr-2" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Real-time (via webhooks)</span>
              </label>
              <label className="flex items-center">
                <input type="radio" disabled className="mr-2" checked readOnly />
                <span className="text-sm text-slate-600 dark:text-slate-300">Hourly</span>
              </label>
              <label className="flex items-center">
                <input type="radio" disabled className="mr-2" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Daily</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 2 Info */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Phase 2: Real Integration
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Real GitHub OAuth and database persistence will be implemented once the following are ready:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>GitHub OAuth app credentials (CLIENT_ID, CLIENT_SECRET)</li>
          <li>PostgreSQL database instance</li>
          <li>NextAuth.js configuration</li>
          <li>Background job infrastructure for GitHub API sync</li>
        </ul>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
          See <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono text-xs">PHASE-2-INTEGRATION.md</code> for detailed integration plan.
        </p>
      </div>
    </div>
  )
}
