'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/lib/types/types'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { Session } from 'next-auth'

interface UserPreferences {
  timezone: string
  weekStartsOn: 'sunday' | 'monday'
}

interface AuthContextType {
  user: User | null
  preferences: UserPreferences
  updatePreferences: (prefs: Partial<UserPreferences>) => void
  logout: () => void
  isLoading: boolean
  session?: Session | null // pass next-auth session in context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weekStartsOn: 'monday'
  })
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter();
  // getting github logged in auth details from next-auth session hook
  // this contains currently logged in user name, email and avatar of github in session.
  const { data: session, status } = useSession();

  useEffect(() => {
    // If session is undefined and not loading, redirect to login
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    // Load preferences from localStorage
    const stored = localStorage.getItem('devtrackr-preferences')
    if (stored) {
      try {
        setPreferences(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse preferences:', e)
      }
    }

    setIsLoading(false)
  }, [status, router])

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...prefs }
    setPreferences(updated)
    localStorage.setItem('devtrackr-preferences', JSON.stringify(updated))
  }

  const logout = () => {
    // TODO: Implement real logout when OAuth is ready
    console.log('Logout called - not implemented yet')
  }

  return (
    <AuthContext.Provider
      value={{ user, preferences, updatePreferences, logout, isLoading, session }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useCurrentUser() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within an AuthProvider')
  }
  return context
}
