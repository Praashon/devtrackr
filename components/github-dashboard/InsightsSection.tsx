import { Lightbulb } from 'lucide-react'

interface InsightsSectionProps {
  insights: string[]
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  return (
    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30 rounded-lg p-5 mb-8 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg transition-all duration-300 animate-slideInDown">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-orange-700 dark:text-orange-400 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-sm font-medium text-orange-900 dark:text-orange-200 mb-2">
            Week Insights
          </h3>
          <ul className="space-y-1.5">
            {insights.map((insight, index) => (
              <li
                key={index}
                className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-slideInDown {
          animation: slideInDown 0.6s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  )
}
