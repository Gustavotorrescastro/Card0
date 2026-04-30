'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import ComparadorSustentabilidade from '@/components/ComparadorSustentabilidade'
import { useTheme } from '@/context/ThemeContext'

export default function CalculadoraImpactoPage(){
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if(!mounted){
    return <div className="min-h-screen bg-white dark:bg-[#0F0F0F]" />
  }
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
              <section>
                <h1 className="text-3xl font-bold mb-2">
                  Calculadora de Impacto Ambiental
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Analise o impacto ambiental da migração de cartões físicos para digitais.
                </p>
              </section>
              <div className="pt-2">
                <ComparadorSustentabilidade />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
