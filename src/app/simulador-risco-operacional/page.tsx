'use client'

import { useState, useEffect, useMemo } from 'react'
import { Leaf, CircleDollarSign, CalendarDays, ShieldAlert } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { LIMITES } from './constantes'
import { calcularMetricasRisco } from './calculos'
import ControleSlider from './ControleSlider'
import CardMetrica from './CardMetrica'

export default function SimuladorRiscoPage() {
  const [mounted, setMounted] = useState(false)
  const [cartoesAtivos, setCartoesAtivos] = useState(LIMITES.CARTOES_ATIVOS.INICIAL)
  const [taxaFalha, setTaxaFalha] = useState(LIMITES.TAXA_FALHA.INICIAL)

  useEffect(() => setMounted(true), [])

  const metricas = useMemo(
    () => calcularMetricasRisco(cartoesAtivos, taxaFalha),
    [cartoesAtivos, taxaFalha]
  )

  if (!mounted) return <div className="min-h-screen bg-[#f6edee]" />

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f6edee]">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
              
              <section className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-black text-[#1c2241] uppercase tracking-tighter">Simulador de Risco</h1>
                  <p className="text-slate-500 font-medium">Análise de falhas logísticas e prejuízo ambiental.</p>
                </div>
                <div className="bg-[#1c2241] text-[#91d0d1] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[#91d0d1]/30">
                  Modo Simulação
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#c7e6ed]">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1c2241] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert size={80} /></div>
                  <h3 className="text-[#91d0d1] font-black mb-6 uppercase tracking-tighter">Cenário Físico (Crítico)</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Emissão CO₂</span>
                      <span className="font-mono text-xl text-red-400">{metricas.co2FisicoMes.toLocaleString('pt-BR')} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Custo Logístico</span>
                      <span className="font-mono text-xl text-red-400 font-bold">R$ {metricas.custoFisicoMes.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#91d0d1] shadow-sm relative overflow-hidden">
                  <h3 className="text-[#1c2241] font-black mb-6 uppercase tracking-tighter">Cenário Digital (Otimizado)</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-[#f6edee] pb-2">
                      <span className="text-slate-500 font-bold uppercase text-[10px]">Emissão CO₂</span>
                      <span className="font-mono text-xl text-[#91d0d1] font-bold">0 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold uppercase text-[10px]">Custo Operacional</span>
                      <span className="font-mono text-xl text-[#2f56a3] font-bold">R$ {metricas.custoDigitalOperacional.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardMetrica titulo="CO₂ evitado" valor={`${metricas.co2Evitado.toLocaleString('pt-BR')} kg`} icone={Leaf} />
                <CardMetrica titulo="Economia" valor={`R$ ${metricas.economiaFinanceira.toLocaleString('pt-BR')}`} icone={CircleDollarSign} />
                <CardMetrica titulo="Retorno" valor="~1 mês" icone={CalendarDays} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}