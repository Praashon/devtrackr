import { AppLayout } from '@/components/AppLayout'

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-serif font-semibold text-slate-900 dark:text-slate-100 mb-4">
          GitHub Activity Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Coming soon: View your aggregated GitHub activity, PRs, reviews, and commits.
        </p>
      </div>
    </AppLayout>
  )
}
