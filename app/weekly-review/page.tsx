import { AppLayout } from '@/components/AppLayout'

export default function WeeklyReviewPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-serif font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Weekly Review
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Coming soon: Guided weekly reflection workflow with auto-generated summaries and target setting.
        </p>
      </div>
    </AppLayout>
  )
}
