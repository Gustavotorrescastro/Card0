'use client'

import { useState, useEffect, useMemo } from 'react' // Memory calcuted values
import { Leaf, CircleDollarSign, CalendarDays } from 'lucide-react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'
import ComparadorSustentabilidade from '@/components/ComparadorSustentabilidade'
import { useTheme } from '@/context/ThemeContext'

// Importando nossos novos arquivos
import { LIMITES } from './constantes'
import { calcularMetricasRisco } from './calculos'
import ControleSlider from './ControleSlider'
import CardMetrica from './CardMetrica'

/**
 * Página do Simulador de Risco Operacional
 * 
 * Permite ao usuário simular o impacto ambiental e financeiro
 * da migração de cartões físicos para digitais
 */
export default function SimuladorRiscoPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Estados dos controles
  const [cartoesAtivos, setCartoesAtivos] = useState(LIMITES.CARTOES_ATIVOS.INICIAL)
  const [taxaFalha, setTaxaFalha] = useState(LIMITES.TAXA_FALHA.INICIAL)

  useEffect(() => setMounted(true), [])

  // Cálculo das métricas (otimizado com useMemo)
  // useMemo evita recalcular quando outros estados mudam
  const metricas = useMemo( // Download memory
    () => calcularMetricasRisco(cartoesAtivos, taxaFalha),
    [cartoesAtivos, taxaFalha]
  )

  /*
  Anatomia do UseMemo:
  const metricas = useMemo(
    () => calcularMetricasRisco(cartoesAtivos, taxaFalha),
    ↑                                                    
    função que retorna o valor calculado

    [cartoesAtivos, taxaFalha]
    ↑
    array de dependências
  )
  */

  // Renderização de carregamento
  if (!mounted) {
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
              
              {/* Cabeçalho da Página */}
              <section>
                <h1 className="text-3xl font-bold mb-2">
                  Simulador de Risco Operacional
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Analise o impacto ambiental e financeiro de falhas logísticas.
                </p>
              </section>

              {/* Controles de Entrada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ControleSlider
                  label="Total de cartões ativos"
                  valor={cartoesAtivos}
                  min={LIMITES.CARTOES_ATIVOS.MIN}
                  max={LIMITES.CARTOES_ATIVOS.MAX}
                  step={LIMITES.CARTOES_ATIVOS.STEP}
                  onChange={setCartoesAtivos}
                />

                <ControleSlider
                  label="Taxa de falha / mês"
                  valor={taxaFalha}
                  min={LIMITES.TAXA_FALHA.MIN}
                  max={LIMITES.TAXA_FALHA.MAX}
                  step={LIMITES.TAXA_FALHA.STEP}
                  unidade="%"
                  onChange={setTaxaFalha}
                />
              </div>

              {/* Cards de Comparação: Físico vs Digital */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Card Físico */}
                <div className="bg-red-50/50 dark:bg-[#1A1A1A]/50 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
                  <h3 className="text-red-600 dark:text-red-500 font-bold mb-4 uppercase tracking-wider text-sm">
                    Físico — falhas/mês
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Cartões falhando
                      </span>
                      <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                        {metricas.falhasMes.toLocaleString('pt-BR')}
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        CO₂ emitido
                      </span>
                      <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                        {metricas.co2FisicoMes.toLocaleString('pt-BR')} kg
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Custo logístico
                      </span>
                      <span className="font-mono text-red-600 dark:text-red-400 font-bold">
                        R$ {metricas.custoFisicoMes.toLocaleString('pt-BR')}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Card Digital */}
                <div className="bg-green-50/50 dark:bg-[#1A1A1A]/50 p-6 rounded-xl border border-green-200 dark:border-green-900/30">
                  <h3 className="text-green-600 dark:text-green-500 font-bold mb-4 uppercase tracking-wider text-sm">
                    Digital — Eficiente
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Falhas digitais
                      </span>
                      <span className="font-mono text-green-600 dark:text-green-400 font-bold">
                        0
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        CO₂ de reemissão
                      </span>
                      <span className="font-mono text-green-600 dark:text-green-400 font-bold">
                        0 kg
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Custo operacional
                      </span>
                      <span className="font-mono text-green-600 dark:text-green-400 font-bold">
                        R$ {metricas.custoDigitalOperacional.toLocaleString('pt-BR')}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Resumo de Impacto - Cards de Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardMetrica
                  titulo="CO₂ evitado"
                  valor={`${metricas.co2Evitado.toLocaleString('pt-BR')} kg`}
                  icone={Leaf}
                  corBorda="red"
                />

                <CardMetrica
                  titulo="Economia"
                  valor={`R$ ${metricas.economiaFinanceira.toLocaleString('pt-BR')}`}
                  icone={CircleDollarSign}
                  corBorda="orange"
                />

                <CardMetrica
                  titulo="Retorno"
                  valor="~1 mês"
                  icone={CalendarDays}
                  corBorda="green"
                />
              </div>

              {/* Comparador de Sustentabilidade */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                <ComparadorSustentabilidade />
              </div>

            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}