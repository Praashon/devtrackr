'use client'

import React, { useState } from 'react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

export interface NavigationItem {
    label: string
    href: string
    icon: React.ReactNode
    isActive?: boolean
}

export interface User {
    name: string
    email?: string
    avatarUrl?: string
}

export interface AppShellProps {
    children: React.ReactNode
    navigationItems: NavigationItem[]
    user?: User
    onNavigate?: (href: string) => void
    onLogout?: () => void
}

export function AppShell({
    children,
    navigationItems,
    user,
    onNavigate,
    onLogout,
}: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          transition-all duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:w-20' : 'w-64'}
        `}
            >
                <MainNav
                    items={navigationItems}
                    collapsed={sidebarCollapsed}
                    onNavigate={(href) => {
                        onNavigate?.(href)
                        setSidebarOpen(false)
                    }}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                {user && (
                    <UserMenu
                        user={user}
                        collapsed={sidebarCollapsed}
                        onLogout={onLogout}
                    />
                )}
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile header */}
                <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                        aria-label="Open menu"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="font-serif font-semibold text-lg">DevTrackr</span>
                </header>

                {/* Content area */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
