'use client'

import { useState, useEffect, useMemo } from 'react'
import { Info } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'

import { LIMITES, TEXTOS } from './constantes'
import {
  calcularResultadoCompleto,
  gerarProjecaoCrescimento,
} from './calculos'

import TabNavigation from './TabNavigation'
import ControleQuantidade from './ControleQuantidade'
import ControleValor from './ControleValor'
import CardCustoTotal from './CardCustoTotal'
import GraficoCamadas from './GraficoCamadas'
import GraficoProjecao from './GraficoProjecao'
import CardComparativo from './CardComparativo'

const TABS = [
  { id: 'custos', label: 'Custos e Impacto Financeiro' },
  { id: 'ambiental', label: 'Impacto Ambiental' },
  { id: 'risco', label: 'Risco Operacional' },
]

export default function CalculadoraImpactoPage() {
  const [mounted, setMounted] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('custos')

  // Estado dos controles
  const [quantidade, setQuantidade] = useState(
    LIMITES.QUANTIDADE_CARTOES.INICIAL
  )
  const [valorPorCartao, setValorPorCartao] = useState(
    LIMITES.VALOR_POR_CARTAO.INICIAL
  )

  useEffect(() => setMounted(true), [])

  // Cálculos derivados (recalcula quando os inputs mudam)
  const resultado = useMemo(
    () => calcularResultadoCompleto(quantidade, valorPorCartao),
    [quantidade, valorPorCartao]
  )

  const projecao = useMemo(
    () => gerarProjecaoCrescimento(valorPorCartao),
    [valorPorCartao]
  )

  // Percentual ilustrativo: quanto o custo total representa do orçamento
  // (calculado em relação ao maior ponto da projeção para dar uma referência)
  const percentualOperacao = useMemo(() => {
    const maxProjecao = Math.max(...projecao.map((p) => p.tcoFisico))
    return maxProjecao > 0
      ? (resultado.fisico.custoTotal / maxProjecao) * 100
      : 0
  }, [projecao, resultado])

  if (!mounted) return <div className="min-h-screen bg-[#f6edee]" />

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f6edee]">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Título e descrição */}
              <section>
                <h1 className="text-3xl font-black text-[#1c2241] uppercase tracking-tighter">
                  {TEXTOS.TITULO}
                </h1>
                <p className="text-slate-500 font-medium max-w-3xl">
                  {TEXTOS.SUBTITULO}
                </p>
              </section>

              {/* Tab navigation */}
              <section>
                <TabNavigation
                  tabs={TABS}
                  ativa={abaAtiva}
                  onChange={setAbaAtiva}
                />
              </section>

              {abaAtiva === 'custos' && (
                <>
                  {/* Controles + Explicação */}
                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ControleQuantidade
                      valor={quantidade}
                      min={LIMITES.QUANTIDADE_CARTOES.MIN}
                      max={LIMITES.QUANTIDADE_CARTOES.MAX}
                      step={LIMITES.QUANTIDADE_CARTOES.STEP}
                      onChange={setQuantidade}
                    />

                    <ControleValor
                      valor={valorPorCartao}
                      min={LIMITES.VALOR_POR_CARTAO.MIN}
                      max={LIMITES.VALOR_POR_CARTAO.MAX}
                      step={LIMITES.VALOR_POR_CARTAO.STEP}
                      onChange={setValorPorCartao}
                    />

                    <div className="bg-[#1c2241] p-6 rounded-3xl text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Info size={60} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 text-[#91d0d1]">
                          <Info size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Sobre as métricas
                          </span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed">
                          {TEXTOS.EXPLICACAO_METRICAS}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Linha de cards: Custo total + Composição */}
                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CardCustoTotal
                      valor={resultado.fisico.custoTotal}
                      percentualOperacao={percentualOperacao}
                    />
                    <GraficoCamadas resultado={resultado} />
                  </section>

                  {/* Linha: Projeção + Comparativo */}
                  <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GraficoProjecao
                      pontos={projecao}
                      quantidadeAtual={quantidade}
                    />
                    <CardComparativo resultado={resultado} />
                  </section>
                </>
              )}

              {abaAtiva !== 'custos' && (
                <section className="bg-white p-12 rounded-[2.5rem] border border-[#c7e6ed] shadow-sm text-center">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Em breve
                  </p>
                  <h2 className="text-2xl font-black text-[#1c2241] uppercase tracking-tighter">
                    {TABS.find((t) => t.id === abaAtiva)?.label}
                  </h2>
                  <p className="text-slate-500 font-medium mt-3 max-w-lg mx-auto">
                    Esta seção está em desenvolvimento e será disponibilizada em
                    breve.
                  </p>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
