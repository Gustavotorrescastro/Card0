'use client'

import { useState, useEffect } from 'react'
import AppHeader from '@/components/Header'
import AppSidebar from '@/components/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useTheme } from '@/context/ThemeContext'

// Importações dos novos arquivos
import { TEXTOS_INTERFACE } from './constantes'
import { useLinhaDoTempo } from './useLinhaDoTempo'
import FormularioImpacto from './FormularioImpacto'
import ResultadosImpacto from './ResultadosImpacto'

/**
 * Página da Linha do Tempo de Impacto
 * 
 * Permite ao usuário calcular seu impacto ambiental acumulado
 * desde a data de adesão ao uso do cartão digital
 */
export default function TimelinePage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hook customizado para gerenciar o estado
  const { impactData, loading, error, calcularImpacto } = useLinhaDoTempo()

  useEffect(() => setMounted(true), [])

  // Renderização de loading enquanto monta
  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-[#0F0F0F]" />
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white transition-colors duration-300">
        <AppHeader />

        <div className="flex flex-1">
          <AppSidebar />

          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-50 dark:bg-[#1A1A1A] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 transition-colors">
                
                {/* Cabeçalho */}
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold mb-2">
                    {TEXTOS_INTERFACE.TITULO}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {TEXTOS_INTERFACE.SUBTITULO}
                  </p>
                </div>

                {/* Formulário */}
                <FormularioImpacto
                  onSubmit={calcularImpacto}
                  loading={loading}
                />

                {/* Mensagem de erro */}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">
                      {error}
                    </p>
                  </div>
                )}

                {/* Resultados */}
                {impactData && <ResultadosImpacto dados={impactData} />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}