'use client'

import Link from 'next/link'
import { User } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full bg-white h-20 px-6 md:px-12 flex items-center justify-between border-b border-slate-200 select-none">
      {/* Logo Edenred (Capsule vermelha clássica com texto branco) */}
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 bg-[#F72717] px-4 py-2 rounded-full text-white shadow-sm">
          {/* Círculo com 'e' estilizado */}
          <div className="w-5 h-5 rounded-full bg-white text-[#F72717] flex items-center justify-center font-bold text-xs">
            e
          </div>
          <span className="text-white font-extrabold tracking-tight text-sm lowercase leading-none">edenred</span>
        </div>
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