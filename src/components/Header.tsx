'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { User } from 'lucide-react'

interface HeaderProps {
  children?: ReactNode
}

const Header = ({ children }: HeaderProps): React.JSX.Element => {
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
            
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-secondary hover:bg-white/20 transition-all border border-white/10"
              title="Perfil do Usuário"
            >
              <User size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header