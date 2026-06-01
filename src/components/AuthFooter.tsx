import Link from 'next/link'

import { footerNavigation } from '@/config/navigation'
import EdenredLogo from './EdenredLogo'

export default function AuthFooter() {
  return (
    <footer className="w-full border-t border-[#7aa1b7] bg-[#2d2d2d] px-6 py-10 text-[#d7d7d7] md:px-10">
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[1fr_1.2fr_160px]">
        <div className="space-y-4">
          <EdenredLogo />
          <p className="max-w-sm text-sm leading-relaxed text-[#b9b9b9]">
            Portal de sustentabilidade e operações da Edenred, com acesso aos
            módulos analíticos do dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Rotas
            </h2>
            <div className="space-y-2">
              {footerNavigation.slice(0, 3).map((item) => (
                <Link key={item.href} href={item.href} className="block text-sm hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Módulos
            </h2>
            <div className="space-y-2">
              {footerNavigation.slice(3).map((item) => (
                <Link key={item.href} href={item.href} className="block text-sm hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Institucional
            </h2>
            <Link href="/perfil" className="block text-sm hover:text-white">
              Meu perfil
            </Link>
            <Link href="/dashboard" className="block text-sm hover:text-white">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-white">
            Acompanhe
          </h2>
          <div className="space-y-2 text-sm text-[#b9b9b9]">
            <p>LinkedIn corporativo</p>
            <p>YouTube institucional</p>
            <p>Instagram da marca</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
