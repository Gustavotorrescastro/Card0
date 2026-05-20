'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface UserProfile {
  name: string
  email: string
  empresa: string
  dataNascimento: string
  localizacao: string
}

interface UserContextType {
  profile: UserProfile
  updateProfile: (updated: Partial<UserProfile>) => void
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Usuário Gestor',
  email: 'gestor@card0.com.br',
  empresa: 'Edenred',
  dataNascimento: '16/05/92',
  localizacao: 'Recife-PE, Brasil',
}

const UserContext = createContext<UserContextType>({
  profile: DEFAULT_PROFILE,
  updateProfile: () => {},
})

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)

  // Carrega do localStorage quando monta no client
  useEffect(() => {
    const stored = localStorage.getItem('userProfile')
    if (stored) {
      try {
        setProfile(JSON.parse(stored))
      } catch {}
    } else {
      // compatibilidade com chaves legadas do login
      const name = localStorage.getItem('userName')
      const email = localStorage.getItem('userEmail')
      if (name || email) {
        setProfile((prev) => ({
          ...prev,
          name: name || prev.name,
          email: email || prev.email,
        }))
      }
    }
  }, [])

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated }
      localStorage.setItem('userProfile', JSON.stringify(next))
      // mantém compatibilidade com as chaves simples
      if (updated.name) localStorage.setItem('userName', updated.name)
      if (updated.email) localStorage.setItem('userEmail', updated.email)
      return next
    })
  }

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  )
}
