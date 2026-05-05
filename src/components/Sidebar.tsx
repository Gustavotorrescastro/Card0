'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LayoutDashboard, Calculator, History, Leaf, LogOut, User } from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn')
    router.push('/login')
  }

  return (
    <aside 
      className={`relative min-h-screen transition-all duration-300 ease-in-out border-r border-white/10 flex flex-col shadow-2xl z-20
      ${isOpen ? 'w-72' : 'w-20'}`}
      style={{ backgroundColor: '#1c2241' }}
    >
      <div className="p-6 flex justify-end">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-white/10 rounded-xl text-[#91d0d1]">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav className="flex-grow px-4 space-y-3">
        <SidebarLink href="/dashboard" icon={<LayoutDashboard size={22} />} label="Dashboard" isOpen={isOpen} active={isActive('/dashboard')} />
        <SidebarLink href="/simulador-risco-operacional" icon={<Calculator size={22} />} label="Simulador de Risco" isOpen={isOpen} active={isActive('/simulador-risco-operacional')} />
        <SidebarLink href="/calculadora-impacto" icon={<Leaf size={22} />} label="Calculadora de Impacto" isOpen={isOpen} active={isActive('/calculadora-impacto')} />
        <SidebarLink href="/linha-do-tempo" icon={<History size={22} />} label="Linha do Tempo" isOpen={isOpen} active={isActive('/linha-do-tempo')} />
        <SidebarLink href="/perfil" icon={<User size={22} />} label="Meu Perfil" isOpen={isOpen} active={isActive('/perfil')} />
      </nav>

      {/* Botão de Sair Fixo ao Final */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-red-500/10 transition-all text-red-400 group"
        >
          <div className="min-w-[28px] flex justify-center group-hover:scale-110 transition-transform">
            <LogOut size={22} />
          </div>
          {isOpen && <span className="whitespace-nowrap font-bold text-xs uppercase tracking-widest">Sair do Sistema</span>}
        </button>
      </div>
    </aside>
  )
}

const SidebarLink = ({ href, icon, label, isOpen, active }: any) => (
  <Link href={href} className={`flex items-center space-x-4 p-4 rounded-2xl transition-all group relative ${active ? 'bg-[#2f56a3] text-white shadow-lg' : 'text-[#c7e6ed]/60 hover:text-white hover:bg-white/5'}`}>
    <div className={`min-w-[28px] flex justify-center ${active ? 'text-[#91d0d1]' : ''}`}>{icon}</div>
    {isOpen && <span className="whitespace-nowrap text-sm font-bold">{label}</span>}
    {active && <div className="absolute left-0 w-1 h-6 bg-[#91d0d1] rounded-r-full" />}
  </Link>
)

export default Sidebar