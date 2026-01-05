'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/lib/types/types'

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for development
const MOCK_USER: User = {
  id: 'dev-user-1',
  email: 'developer@devtrackr.com',
  name: 'Dev User',
  avatarUrl: undefined,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  weekStartsOn: 'monday',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>({
    timezone: MOCK_USER.timezone,
    weekStartsOn: MOCK_USER.weekStartsOn,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load preferences from localStorage
    const stored = localStorage.getItem('devtrackr-preferences')
    if (stored) {
      try {
        setPreferences(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse preferences:', e)
      }
    }

    // Set mock user for development
    setUser(MOCK_USER)
    setIsLoading(false)
  }, [])

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
      value={{ user, preferences, updatePreferences, logout, isLoading }}
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
