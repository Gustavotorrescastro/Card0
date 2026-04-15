'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Leaf, CircleDollarSign, CalendarDays } from 'lucide-react'

export default function SimuladorRiscoPage() {
  // Estados para os Sliders
  const [cartoesAtivos, setCartoesAtivos] = useState(1000)
  const [taxaFalha, setTaxaFalha] = useState(2)

  // Premissas de Cálculo (Valores baseados na imagem)
  const co2PorCartao = 5 // 5kg de CO2 por reemissão física
  const custoLogistico = 20 // R$ 20 por reemissão física
  const plasticoPorCartao = 0.005 // 5g por cartão

  // Cálculos - Cartão Físico
  const falhasMes = Math.round(cartoesAtivos * (taxaFalha / 100))
  const co2FisicoMes = falhasMes * co2PorCartao
  const custoFisicoMes = falhasMes * custoLogistico
  const plasticoFisicoMes = falhasMes * plasticoPorCartao

  // Cálculos - Cartão Digital (Simulação de eficiência 99%)
  const custoDigitalOperacional = falhasMes * 0.20 // R$ 0,20 por reprocessamento digital

  // Resultados Comparativos
  const co2Evitado = co2FisicoMes
  const economiaFinanceira = custoFisicoMes - custoDigitalOperacional

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-white">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <section>
              <h1 className="text-3xl font-bold mb-2">Simulador de Risco Operacional</h1>
              <p className="text-gray-400">Analise o impacto ambiental e financeiro de falhas logísticas em cartões físicos.</p>
            </section>

            {/* SLIDERS DE CONTROLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-medium text-gray-400">Total de cartões ativos</label>
                  <span className="text-2xl font-bold text-edenred-primary">{cartoesAtivos.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="100" max="100000" step="100"
                  value={cartoesAtivos}
                  onChange={(e) => setCartoesAtivos(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-edenred-primary"
                />
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800">
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-medium text-gray-400">Taxa de falha / mês (%)</label>
                  <span className="text-2xl font-bold text-edenred-primary">{taxaFalha}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="10" step="0.1"
                  value={taxaFalha}
                  onChange={(e) => setTaxaFalha(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-edenred-primary"
                />
              </div>
            </div>

            {/* COMPARAÇÃO DETALHADA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Físico */}
              <div className="bg-[#1A1A1A]/50 p-6 rounded-xl border border-red-900/30">
                <h3 className="text-red-500 font-bold mb-4 uppercase tracking-wider text-sm">Cartão físico — falhas/mês</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Cartões falhando</span>
                    <span className="font-mono text-red-400">{falhasMes}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">CO₂ de reemissão</span>
                    <span className="font-mono text-red-400">{co2FisicoMes} kg</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Custo logístico est.</span>
                    <span className="font-mono text-red-400">R$ {custoFisicoMes.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Plástico descartado</span>
                    <span className="font-mono text-red-400">{plasticoFisicoMes.toFixed(2)} kg</span>
                  </li>
                </ul>
              </div>

              {/* Card Digital */}
              <div className="bg-[#1A1A1A]/50 p-6 rounded-xl border border-green-900/30">
                <h3 className="text-green-500 font-bold mb-4 uppercase tracking-wider text-sm">Cartão digital — falhas equiv.</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Reemissão digital</span>
                    <span className="font-mono text-green-400 uppercase">Automática</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">CO₂ de reemissão</span>
                    <span className="font-mono text-green-400">0 kg</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Custo operacional</span>
                    <span className="font-mono text-green-400">R$ {custoDigitalOperacional.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Plástico gerado</span>
                    <span className="font-mono text-green-400">0 kg</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* RESUMO DE IMPACTO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1A1A1A] p-6 rounded-xl border-l-4 border-red-600 shadow-lg">
                <div className="flex items-center space-x-3 mb-2 text-gray-400">
                  <Leaf size={18} />
                  <span className="text-xs uppercase font-bold tracking-widest">CO₂ evitado/mês</span>
                </div>
                <div className="text-3xl font-bold">{co2Evitado.toLocaleString()} kg</div>
                <p className="text-[10px] text-gray-500 mt-1">com migração digital</p>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-xl border-l-4 border-orange-500 shadow-lg">
                <div className="flex items-center space-x-3 mb-2 text-gray-400">
                  <CircleDollarSign size={18} />
                  <span className="text-xs uppercase font-bold tracking-widest">Economia financeira/mês</span>
                </div>
                <div className="text-3xl font-bold text-orange-400">R$ {economiaFinanceira.toLocaleString()}</div>
                <p className="text-[10px] text-gray-500 mt-1">redução custo operacional</p>
              </div>

              <div className="bg-[#1A1A1A] p-6 rounded-xl border-l-4 border-green-500 shadow-lg">
                <div className="flex items-center space-x-3 mb-2 text-gray-400">
                  <CalendarDays size={18} />
                  <span className="text-xs uppercase font-bold tracking-widest">Ponto de paridade</span>
                </div>
                <div className="text-3xl font-bold text-green-400">~1 mês</div>
                <p className="text-[10px] text-gray-500 mt-1">ROI ambiental positivo</p>
              </div>
            </div>

            {/* ACÚMULO ANUAL */}
            <div className="bg-[#1A1A1A] p-8 rounded-xl border border-gray-800">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Acúmulo Anual de Risco</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2 uppercase">
                    <span>CO₂ físico/ano</span>
                    <span className="font-bold">{(co2FisicoMes * 12).toLocaleString()} kg</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-3">
                    <div className="bg-red-600 h-3 rounded-full shadow-[0_0_10px_rgba(226,0,26,0.5)]" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2 uppercase">
                    <span>Custo logístico/ano</span>
                    <span className="font-bold">R$ {(custoFisicoMes * 12).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-3">
                    <div className="bg-orange-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}