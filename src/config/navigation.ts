import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  History,
  Calculator,
  Leaf,
  Recycle,
  User,
} from 'lucide-react'

export type NavigationItem = {
  href: string
  label: string
  description: string
  icon: LucideIcon
}

export const dashboardNavigation: NavigationItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    description: 'Visão geral da conta e dos indicadores principais.',
    icon: LayoutDashboard,
  },
  {
    href: '/linha-do-tempo',
    label: 'Linha do Tempo',
    description: 'Acompanhe o impacto acumulado ao longo do tempo.',
    icon: History,
  },
  {
    href: '/simulador-risco-operacional',
    label: 'Risco Operacional',
    description: 'Simule falhas, custo e emissões do cenário físico.',
    icon: Calculator,
  },
  {
    href: '/calculadora-impacto',
    label: 'Impacto Financeiro',
    description: 'Compare TCO, economia e composição de custos.',
    icon: Leaf,
  },
  {
    href: '/lca-simplificado',
    label: 'Operação e Execução',
    description: 'Veja o ciclo de vida e a projeção operacional.',
    icon: Recycle,
  },
  {
    href: '/perfil',
    label: 'Perfil',
    description: 'Atualize dados e gerencie a sessão do usuário.',
    icon: User,
  },
]

export const footerNavigation = dashboardNavigation.filter(
  (item) => item.href !== '/perfil'
)
