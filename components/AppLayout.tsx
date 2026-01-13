'use client'

import { usePathname, useRouter } from 'next/navigation'
import { AppShell, NavigationItem } from '@/components/shell'
import { useCurrentUser } from '@/lib/contexts/AuthContext'
import {
  LayoutDashboard,
  Calendar,
  Target,
  TrendingUp,
  FileText,
} from 'lucide-react'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  // using next-auth session for handling users
  const { session, logout, isLoading } = useCurrentUser()

  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard />,
      isActive: pathname === '/dashboard',
    },
    {
      label: 'Weekly Review',
      href: '/weekly-review',
      icon: <Calendar />,
      isActive: pathname === '/weekly-review',
    },
    {
      label: 'Goals & Habits',
      href: '/goals-habits',
      icon: <Target />,
      isActive: pathname === '/goals-habits',
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: <TrendingUp />,
      isActive: pathname === '/analytics',
    },
    {
      label: 'Reports',
      href: '/reports',
      icon: <FileText />,
      isActive: pathname === '/reports',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={
        session && session.user
          ? {
              name: session.user.name || '',
              email: session.user.email || '',
              avatarUrl: session.user.image || undefined,
            }
          : undefined
      }
      onNavigate={(href) => router.push(href)}
      onLogout={logout}
    >
      {children}
    </AppShell>
  )
}
