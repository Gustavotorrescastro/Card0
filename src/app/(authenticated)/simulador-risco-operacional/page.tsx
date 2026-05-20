'use client'

import { useState, useMemo } from 'react'
import { Leaf, CircleDollarSign, CalendarDays, ShieldAlert } from 'lucide-react'
import { LIMITES } from './constantes'
import { calcularMetricasRisco } from './calculos'
import ControleSlider from './ControleSlider'
import CardMetrica from './CardMetrica'

export default function SimuladorRiscoPage() {
  const [cartoesAtivos, setCartoesAtivos] = useState(LIMITES.CARTOES_ATIVOS.INICIAL)
  const [taxaFalha, setTaxaFalha] = useState(LIMITES.TAXA_FALHA.INICIAL)

  const metricas = useMemo(
    () => calcularMetricasRisco(cartoesAtivos, taxaFalha),
    [cartoesAtivos, taxaFalha]
  )

  return (
    <div className="space-y-8 pb-16 w-full max-w-7xl mx-auto px-1 md:px-0">
      
      <section className="flex justify-between items-center pb-2">
        <div>
          <h1 className="text-2xl font-black text-brand-secondary uppercase tracking-tight">Simulador de Risco</h1>
          <p className="text-slate-500 text-xs font-semibold">Análise de falhas logísticas e prejuízo ambiental.</p>
        </div>
        <div className="bg-brand-secondary text-[#7FC2E4] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#7FC2E4]/30">
          Modo Simulação
        </div>
      </section>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
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
        <div className="bg-brand-secondary p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert size={80} /></div>
          <h3 className="text-[#E1EA80] font-black mb-6 uppercase tracking-wider text-xs">Cenário Físico (Crítico)</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-400 font-bold uppercase text-[9px]">Emissão CO₂</span>
              <span className="font-mono text-lg text-brand-primary font-bold">{metricas.co2FisicoMes.toLocaleString('pt-BR')} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold uppercase text-[9px]">Custo Logístico</span>
              <span className="font-mono text-lg text-brand-primary font-bold">R$ {metricas.custoFisicoMes.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#7FC2E4] shadow-sm relative overflow-hidden">
          <h3 className="text-brand-secondary font-black mb-6 uppercase tracking-wider text-xs">Cenário Digital (Otimizado)</h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-brand-border/40 pb-2">
              <span className="text-slate-500 font-bold uppercase text-[9px]">Emissão CO₂</span>
              <span className="font-mono text-lg text-[#7FC2E4] font-bold">0 kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold uppercase text-[9px]">Custo Operacional</span>
              <span className="font-mono text-lg text-brand-secondary font-bold">R$ {metricas.custoDigitalOperacional.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardMetrica titulo="CO₂ evitado" valor={`${metricas.co2Evitado.toLocaleString('pt-BR')} kg`} icone={Leaf} corBorda="green" />
        <CardMetrica titulo="Economia" valor={`R$ ${metricas.economiaFinanceira.toLocaleString('pt-BR')}`} icone={CircleDollarSign} corBorda="green" />
        <CardMetrica titulo="Retorno" valor="~1 mês" icone={CalendarDays} corBorda="green" />
      </div>
    </div>
  )
}