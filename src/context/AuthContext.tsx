'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthorized: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthorized: false,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const publicPaths = ['/', '/login', '/cadastro', '/visualizacao-publica']
      const isPublicPath = publicPaths.includes(pathname)
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true'

      if (!loggedIn && !isPublicPath) {
        setIsAuthorized(false)
        router.push('/login')
      } else {
        setIsAuthorized(true)
      }
      setLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  return (
    <AuthContext.Provider value={{ isAuthorized, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
