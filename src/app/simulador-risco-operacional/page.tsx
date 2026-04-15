'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Leaf, CircleDollarSign, CalendarDays } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function SimuladorRiscoPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [cartoesAtivos, setCartoesAtivos] = useState(1000)
  const [taxaFalha, setTaxaFalha] = useState(2)

  useEffect(() => setMounted(true), [])

  const falhasMes = Math.round(cartoesAtivos * (taxaFalha / 100))
  const co2FisicoMes = falhasMes * 5 
  const custoFisicoMes = falhasMes * 20 
  const plasticoFisicoMes = falhasMes * 0.005 
  const custoDigitalOperacional = falhasMes * 0.20 
  const co2Evitado = co2FisicoMes
  const economiaFinanceira = custoFisicoMes - custoDigitalOperacional

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-[#0F0F0F]" />

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <section>
              <h1 className="text-3xl font-bold mb-2">Simulador de Risco Operacional</h1>
              <p className="text-gray-600 dark:text-gray-400">Analise o impacto ambiental e financeiro de falhas logísticas.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sliders com fundos alternáveis */}
              <div className="bg-gray-50 dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de cartões ativos</label>
                  <span className="text-2xl font-bold text-edenred-primary">{cartoesAtivos.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="100" max="100000" step="100"
                  value={cartoesAtivos}
                  onChange={(e) => setCartoesAtivos(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-edenred-primary"
                />
              </div>

              <div className="bg-gray-50 dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxa de falha / mês (%)</label>
                  <span className="text-2xl font-bold text-edenred-primary">{taxaFalha}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="10" step="0.1"
                  value={taxaFalha}
                  onChange={(e) => setTaxaFalha(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-edenred-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Físico */}
              <div className="bg-red-50/50 dark:bg-[#1A1A1A]/50 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
                <h3 className="text-red-600 dark:text-red-500 font-bold mb-4 uppercase tracking-wider text-sm">Físico — falhas/mês</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">Cartões falhando</span>
                    <span className="font-mono text-red-600 dark:text-red-400 font-bold">{falhasMes}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Custo logístico</span>
                    <span className="font-mono text-red-600 dark:text-red-400 font-bold">R$ {custoFisicoMes.toLocaleString()}</span>
                  </li>
                </ul>
              </div>

              {/* Card Digital */}
              <div className="bg-green-50/50 dark:bg-[#1A1A1A]/50 p-6 rounded-xl border border-green-200 dark:border-green-900/30">
                <h3 className="text-green-600 dark:text-green-500 font-bold mb-4 uppercase tracking-wider text-sm">Digital — Eficiente</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">CO₂ de reemissão</span>
                    <span className="font-mono text-green-600 dark:text-green-400 font-bold">0 kg</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Custo operacional</span>
                    <span className="font-mono text-green-600 dark:text-green-400 font-bold">R$ {custoDigitalOperacional.toLocaleString()}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Resumo de Impacto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border-l-4 border-red-600 shadow-md">
                <div className="flex items-center space-x-3 mb-2 text-gray-500 dark:text-gray-400">
                  <Leaf size={18} />
                  <span className="text-xs uppercase font-bold tracking-widest">CO₂ evitado</span>
                </div>
                <div className="text-3xl font-bold">{co2Evitado.toLocaleString()} kg</div>
              </div>

              <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border-l-4 border-orange-500 shadow-md">
                <div className="flex items-center space-x-3 mb-2 text-gray-500 dark:text-gray-400">
                  <CircleDollarSign size={18} />
                  <span className="text-xs uppercase font-bold tracking-widest">Economia</span>
                </div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">R$ {economiaFinanceira.toLocaleString()}</div>
              </div>

              <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border-l-4 border-green-500 shadow-md">
                <div className="flex items-center space-x-3 mb-2 text-gray-500 dark:text-gray-400">
                  <CalendarDays size={18} />
                  <span className="text-xs uppercase font-bold tracking-widest">Retorno</span>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">~1 mês</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}