'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Calculator, History, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <aside 
      className={`relative min-h-[calc(100vh-72px)] transition-all duration-300 ease-in-out border-r flex flex-col 
      ${isOpen ? 'w-64' : 'w-20'} 
      ${theme === 'dark' ? 'bg-[#141414] text-white border-gray-800' : 'bg-white text-gray-800 border-gray-200'}`}
    >
      <div className="p-4 flex justify-end">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-brand-primary">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav className="flex-grow px-3 space-y-2">
        <SidebarItem href="/dashboard" icon={<LayoutDashboard size={22} />} label="Dashboard" isOpen={isOpen} active={isActive('/dashboard')} theme={theme} />
        <SidebarItem href="/simulador-risco-operacional" icon={<Calculator size={22} />} label="Simulador de Risco" isOpen={isOpen} active={isActive('/simulador-risco-operacional')} theme={theme} />
        <SidebarItem href="/linha-do-tempo" icon={<History size={22} />} label="Linha do Tempo" isOpen={isOpen} active={isActive('/linha-do-tempo')} theme={theme} />
      </nav>

      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <button onClick={toggleTheme} className="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-400">
          <div className="min-w-[24px] flex justify-center">
            {theme === 'dark' ? <Sun size={22} className="text-yellow-500" /> : <Moon size={22} className="text-blue-600" />}
          </div>
          {isOpen && <span className="whitespace-nowrap font-medium">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
        </button>
      </div>
    </aside>
  )
}

// Helper SidebarItem simplificado para usar as classes dark/light
const SidebarItem = ({ href, icon, label, isOpen, active, theme }: any) => (
  <Link href={href} className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 group ${active ? 'bg-brand-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}>
    <div className={`min-w-[24px] flex justify-center ${active ? 'text-white' : 'group-hover:text-brand-primary'}`}>{icon}</div>
    {isOpen && <span className="whitespace-nowrap font-medium">{label}</span>}
  </Link>
)

export default Sidebar