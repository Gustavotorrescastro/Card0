'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { dashboardNavigation } from '@/config/navigation'

const appName = 'Card∅'

const publicPageTitles: Record<string, string> = {
  '/': 'Inicio',
  '/login': 'Login',
  '/cadastro': 'Cadastro',
  '/login-edenred': 'Login Edenred',
  '/verificar-email': 'Verificar e-mail',
  '/visualizacao-publica': 'Visualizacao publica',
}

const pageTitles = new Map<string, string>([
  ...Object.entries(publicPageTitles),
  ...dashboardNavigation.map((item) => [item.href, item.label] as const),
])

function getCurrentPageTitle(pathname: string) {
  const normalizedPath = pathname.replace(/\/$/, '') || '/'
  const exactTitle = pageTitles.get(normalizedPath)

  if (exactTitle) {
    return exactTitle
  }

  const matchingPage = [...pageTitles.entries()]
    .filter(([path]) => path !== '/' && normalizedPath.startsWith(`${path}/`))
    .sort(([a], [b]) => b.length - a.length)[0]

  return matchingPage?.[1] || 'Pagina atual'
}

export default function PageTitle() {
  const pathname = usePathname()

  useEffect(() => {
    document.title = `${appName} - ${getCurrentPageTitle(pathname)}`
  }, [pathname])

  return null
}
