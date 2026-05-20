'use client'

interface Tab {
  id: string
  label: string
}

interface TabNavigationProps {
  tabs: Tab[]
  ativa: string
  onChange: (id: string) => void
}

/**
 * Navegação por abas. A aba ativa fica destacada.
 * As inativas ficam desabilitadas (placeholder para módulos futuros).
 */
export default function TabNavigation({
  tabs,
  ativa,
  onChange,
}: TabNavigationProps) {
  return (
    <div className="bg-white p-2 rounded-full border border-[#E2E8F0] shadow-sm inline-flex flex-wrap gap-1">
      {tabs.map((tab) => {
        const isActive = tab.id === ativa
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all
              ${
                isActive
                  ? 'bg-[#162056] text-white shadow-md'
                  : 'text-slate-400 hover:text-[#162056] hover:bg-[#F5F5F5]/50'
              }
            `}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
