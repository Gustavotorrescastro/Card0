'use client'
import Link from 'next/link'
import { User, Bell } from 'lucide-react'

const Header = () => {
  return (
    <header className="h-16 bg-[#1c2241] text-white flex items-center px-8 shadow-lg z-10 w-full">
      {/* Espaçador para equilibrar o lado esquerdo */}
      <div className="flex-1 hidden md:block" />
      
      {/* Logo Centralizada */}
      <div className="flex-shrink-0 flex items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
        <Link href="/dashboard" className="text-xl font-black tracking-tighter hover:opacity-80 transition-opacity">
          CARD<span className="text-[#91d0d1]">0</span>
        </Link>
      </div>
      
      {/* Ações à Direita */}
      <div className="flex-1 flex items-center justify-end gap-6">
        <button className="text-white/60 hover:text-[#91d0d1] transition-colors">
          <Bell size={20} />
        </button>
        <Link href="/perfil" className="flex items-center gap-3 group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold group-hover:text-[#91d0d1] transition-colors">Usuário Gestor</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Admin</p>
          </div>
          <div className="bg-[#2f56a3] p-2 rounded-xl border border-[#3b6fb5] group-hover:border-[#91d0d1] transition-all">
            <User size={20} />
          </div>
        </Link>
      </div>
    </header>
  )
}

export default Header