'use client'

import React from 'react'
import { LogOut } from 'lucide-react'

export interface User {
    name: string
    email?: string
    avatarUrl?: string
}

interface UserMenuProps {
    user: User
    collapsed: boolean
    onLogout?: () => void
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function UserMenu({ user, collapsed, onLogout }: UserMenuProps) {
    return (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 flex items-center justify-center font-medium text-sm flex-shrink-0">
                    {user.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        getInitials(user.name)
                    )}
                </div>

                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {user.name}
                        </div>
                        {user.email && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user.email}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!collapsed && onLogout && (
                <button
                    onClick={onLogout}
                    className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            )}

            {collapsed && onLogout && (
                <button
                    onClick={onLogout}
                    className="w-full mt-2 flex items-center justify-center p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}
