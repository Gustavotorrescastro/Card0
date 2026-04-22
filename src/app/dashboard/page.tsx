'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'

export default function DashboardPage() {
  // 1. Hook de segurança para evitar erro de hidratação e contexto
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // 2. Só tenta usar o hook após o componente montar
  const themeContext = useTheme() 
  
  if (!mounted) return <div className="min-h-screen bg-[#0F0F0F]" />

  const { theme } = themeContext

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0F0F0F] text-white' : 'bg-white text-gray-900'
    }`}>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-bold">Bem-vindo ao Card0</h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Selecione uma funcionalidade no menu lateral para começar.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/simulador-risco-operacional" 
                className={`p-6 rounded-xl border transition-all ${
                theme === 'dark' 
                  ? 'bg-[#1A1A1A] border-gray-800 hover:border-brand-primary' 
                  : 'bg-gray-50 border-gray-200 hover:border-brand-primary'
              }`}>
                <h3 className="text-xl font-bold mb-2">Simulador de Risco</h3>
                <p className="text-sm opacity-70">Calcule o impacto ambiental e financeiro da migração digital.</p>
              </Link>

              <Link href="/linha-do-tempo" 
                className={`p-6 rounded-xl border transition-all ${
                theme === 'dark' 
                  ? 'bg-[#1A1A1A] border-gray-800 hover:border-brand-primary' 
                  : 'bg-gray-50 border-gray-200 hover:border-brand-primary'
              }`}>
                <h3 className="text-xl font-bold mb-2">Linha do Tempo</h3>
                <p className="text-sm opacity-70">Visualize o acúmulo anual de riscos e reduções de CO2.</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}