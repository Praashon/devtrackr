import type { DailyActivity } from '@/lib/types/github-dashboard'

interface DailyDistributionChartProps {
  data: DailyActivity[]
}

export function DailyDistributionChart({ data }: DailyDistributionChartProps) {
  const maxActivity = Math.max(...data.map(d => d.activity), 1)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-end justify-between gap-3 h-48">
        {data.map((day, index) => {
          const height = (day.activity / maxActivity) * 100
          const isLowActivity = day.activity < maxActivity * 0.2

          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2 animate-barGrow" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-full flex items-end justify-center h-40">
                <div
                  className={`w-full rounded-t transition-all duration-300 hover:opacity-80 transform hover:scale-105 ${
                    isLowActivity
                      ? 'bg-slate-300 dark:bg-slate-700'
                      : 'bg-teal-700 dark:bg-teal-600'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${day.day}: ${day.activity} weighted activity`}
                />
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  {day.day}
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {day.activity}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes barGrow {
          from {
            opacity: 0;
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }

        .animate-barGrow {
          animation: barGrow 0.6s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  )
}
