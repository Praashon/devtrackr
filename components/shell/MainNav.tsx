'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export interface NavigationItem {
    label: string
    href: string
    icon: React.ReactNode
    isActive?: boolean
}

interface MainNavProps {
    items: NavigationItem[]
    collapsed: boolean
    onNavigate?: (href: string) => void
    onToggleCollapse: () => void
}

export function MainNav({ items, collapsed, onNavigate, onToggleCollapse }: MainNavProps) {
    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                {!collapsed && (
                    <h1 className="font-serif font-semibold text-lg text-slate-900 dark:text-slate-100">
                        DevTrackr
                    </h1>
                )}
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <button
                        onClick={onToggleCollapse}
                        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Navigation items */}
            <nav className="flex-1 p-3 space-y-1">
                {items.map((item) => (
                    <button
                        key={item.href}
                        onClick={() => onNavigate?.(item.href)}
                        className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium transition-colors
              ${collapsed ? 'justify-center' : ''}
              ${item.isActive
                                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-200'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }
            `}
                        title={collapsed ? item.label : undefined}
                    >
                        <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>
        </div>
    )
}
