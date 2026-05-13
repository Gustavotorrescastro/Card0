'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calculator, Leaf, History, User, LogOut, MapPin } from 'lucide-react'

const TopNavbar = () => {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn')
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/simulador-risco-operacional', icon: <Calculator size={20} />, label: 'Simulador de Risco' },
    { href: '/calculadora-impacto', icon: <Leaf size={20} />, label: 'Calculadora de Impacto' },
    { href: '/logistica-reversa', icon: <MapPin size={20} />, label: 'Logística Reversa' },
    { href: '/linha-do-tempo', icon: <History size={20} />, label: 'Linha do Tempo' },
    { href: '/perfil', icon: <User size={20} />, label: 'Meu Perfil' },
  ]

  return (
    <div className="w-full flex justify-center py-6 px-8 bg-[#f6edee]">
      <nav className="bg-[#1c2241] p-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center space-x-2 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all
              ${
                isActive(item.href)
                  ? 'bg-[#2f56a3] text-white shadow-lg scale-105'
                  : 'text-[#c7e6ed]/60 hover:text-white hover:bg-white/5'
              }
            `}
          >
            {item.icon && <span className={isActive(item.href) ? 'text-[#91d0d1]' : ''}>{item.icon}</span>}
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        ))}

        <div className="w-px h-6 bg-white/10 mx-2" />

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          <span className="whitespace-nowrap">Sair</span>
        </button>
      </nav>
    </div>
  )
}

export default TopNavbar
