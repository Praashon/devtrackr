import { AppLayout } from '@/components/AppLayout'

export default function GoalsHabitsPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-serif font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Goals & Habits
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Coming soon: Track your goals and habits with weekly progress and streaks.
        </p>
      </div>
    </AppLayout>
  )
}
