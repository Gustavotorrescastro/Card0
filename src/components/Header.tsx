'use client'

import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import { User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  children?: ReactNode
}

const Header = ({ children }: HeaderProps): React.JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn')
    setIsLoggedIn(false)
    router.push('/login')
  }

  return (
    <header className="bg-brand-primary text-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Lado Esquerdo: Logo */}
          <Link 
            href="/dashboard" 
            className="text-2xl font-bold hover:text-brand-light transition-colors tracking-tight"
          >
            Card0 - Edenred
          </Link>
          
          {/* Lado Direito: Botão de Perfil */}
          <div className="flex items-center space-x-4">
            {children}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 transition-all border border-white/10"
                title="Sair"
              >
                <LogOut size={20} className="text-white" />
              </button>
            ) : (
              <Link 
                href="/login"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-secondary hover:bg-white/20 transition-all border border-white/10"
                title="Fazer Login"
              >
                <User size={20} className="text-white" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header