'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import EdenredLogo from './EdenredLogo'

export default function Header() {
  return (
    <header className="w-full bg-white h-14 px-6 md:px-12 flex items-center justify-between border-b border-[#2f80ed] select-none">
      <div className="flex items-center">
        <EdenredLogo className="h-10 w-24" />
      </div>
      
      {/* Botão de Perfil (Silhueta de usuário elegante) */}
      <div className="flex items-center">
        <Link href="/perfil" className="hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-black">
            <User size={20} className="stroke-[2.5]" />
          </div>
        </Link>
      </div>
    </header>
  )
}
