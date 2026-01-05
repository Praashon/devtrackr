import { AppLayout } from '@/components/AppLayout'

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-serif font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Export & Reports
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Coming soon: Generate shareable reports in Markdown/PDF format.
        </p>
      </div>
    </AppLayout>
  )
}
