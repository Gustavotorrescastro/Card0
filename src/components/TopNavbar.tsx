'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { dashboardNavigation } from '@/config/navigation'

export default function TopNavbar() {
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path || (path !== '/dashboard' && pathname.startsWith(path))

  return (
    <div className="w-full flex justify-center py-1 px-4 max-w-full">
      <nav className="bg-white border border-slate-200/80 p-1 rounded-full flex flex-row flex-nowrap items-center justify-between gap-1 shadow-sm max-w-full overflow-x-auto scrollbar-none">
        {dashboardNavigation
          .filter((item) => item.href !== '/perfil')
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-[10px] md:text-[11px] font-bold tracking-wide transition-all select-none whitespace-nowrap ${
                isActive(item.href)
                  ? 'bg-[#F72717] text-white shadow-sm scale-100'
                  : 'text-[#252525]/70 hover:text-[#F72717] hover:bg-slate-100/50'
              }`}
            >
              <span
                className={
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-[#F72717]'
                }
              >
                <item.icon size={15} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
      </nav>
    </div>
  )
}
