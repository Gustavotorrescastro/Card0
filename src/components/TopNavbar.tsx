'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, History, Calculator, Leaf, Recycle, MapPin } from 'lucide-react'

const TopNavbar = () => {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
    { href: '/linha-do-tempo', icon: <History size={15} />, label: 'Análise e monitoramento' },
    { href: '/simulador-risco-operacional', icon: <Calculator size={15} />, label: 'Simulações e cenários' },
    { href: '/calculadora-impacto', icon: <Leaf size={15} />, label: 'Custos e impacto financeiro' },
    { href: '/lca-simplificado', icon: <Recycle size={15} />, label: 'Ciclo de Vida (LCA)' },
    { href: '/logistica-reversa', icon: <MapPin size={15} />, label: 'Operação e execução' },
  ]

  return (
    <div className="w-full flex justify-center py-2 px-4 max-w-full">
      <nav className="bg-white border border-slate-200/80 p-1 rounded-full flex flex-row flex-nowrap items-center justify-between gap-1 shadow-sm max-w-full overflow-x-auto scrollbar-none">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center space-x-1.5 px-4 py-2 rounded-full text-[10px] md:text-[11px] font-bold tracking-wide transition-all select-none whitespace-nowrap
              ${
                isActive(item.href)
                  ? 'bg-[#F72717] text-white shadow-sm scale-100'
                  : 'text-[#252525]/70 hover:text-[#F72717] hover:bg-slate-100/50'
              }
            `}
          >
            {item.icon && <span className={isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-[#F72717]'}>{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default TopNavbar
