import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthContextValue = {
  session: Session | null
  isAdmin: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let initializing = true

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (!initializing) setIsLoading(false)
    })

    async function initializeSession() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return

      if (!data.session) {
        setSession(null)
        initializing = false
        setIsLoading(false)
        return
      }

      const { data: refreshed } = await supabase.auth.refreshSession()
      if (mounted) {
        setSession(refreshed.session || data.session)
        initializing = false
        setIsLoading(false)
      }
    }

    void initializeSession()

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const isAdmin = session?.user.app_metadata?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      session,
      isAdmin,
      isLoading,
      signOut: async () => {
        await supabase.auth.signOut()
      },
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
