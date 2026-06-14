'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  CheckCircle2,
  Info,
  Minus,
  PieChart as PieChartIcon,
  Plus,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { LIMITES, TEXTOS } from './constantes'
import {
  calcularResultadoCompleto,
  formatarMoeda,
  formatarMoedaAbreviada,
} from './calculos'
import { saveOperationalMetrics } from '@/lib/operationalMetrics'

type ModoComposicao = 'barra' | 'donut'

const RED = '#ff2b1d'
const ROSE = '#ff7770'
const LIGHT = '#ffb4ae'
const PALE = '#ffe5e5'

const pontosProjecao = [1000, 3000, 5000, 8000, 10000, 25000, 50000, 75000, 100000]

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value))
}

export default function CalculadoraImpactoPage() {
  const [quantidade, setQuantidade] = useState(13600)
  const [valorPorCartao, setValorPorCartao] = useState(LIMITES.VALOR_POR_CARTAO.INICIAL)
  const [modoComposicao, setModoComposicao] = useState<ModoComposicao>('barra')
  const [termometroExpandido, setTermometroExpandido] = useState(false)
  const [termometroInfoAberto, setTermometroInfoAberto] = useState(false)

  const resultado = useMemo(
    () => calcularResultadoCompleto(quantidade, valorPorCartao),
    [quantidade, valorPorCartao]
  )

  const projecao = useMemo(
    () =>
      pontosProjecao.map((ponto) => {
        const calculo = calcularResultadoCompleto(ponto, valorPorCartao)
        return {
          quantidade: ponto,
          fisico: calculo.fisico.custoTotal,
          digital: calculo.digital,
        }
      }),
    [valorPorCartao]
  )

  const percentualOperacao = useMemo(() => {
    const maxFisico = Math.max(...projecao.map((ponto) => ponto.fisico))
    return maxFisico > 0 ? (resultado.fisico.custoTotal / maxFisico) * 100 : 0
  }, [projecao, resultado.fisico.custoTotal])

  const termometro = useMemo(() => {
    const volumeScore = Math.round(
      ((quantidade - LIMITES.QUANTIDADE_CARTOES.MIN) /
        (LIMITES.QUANTIDADE_CARTOES.MAX - LIMITES.QUANTIDADE_CARTOES.MIN)) *
        100
    )
    const distanciaBordaValor = Math.min(
      valorPorCartao - LIMITES.VALOR_POR_CARTAO.MIN,
      LIMITES.VALOR_POR_CARTAO.MAX - valorPorCartao
    )
    const valorScore = Math.round(
      50 + (distanciaBordaValor / ((LIMITES.VALOR_POR_CARTAO.MAX - LIMITES.VALOR_POR_CARTAO.MIN) / 2)) * 50
    )
    const camadasScore = Math.round(
      [resultado.percentualDireto, resultado.percentualIndireto, resultado.percentualFalha]
        .filter((percentual) => percentual > 0)
        .length / 3 * 100
    )
    const economiaScore = Math.round(clampPercent(resultado.economiaPercentual))
    const checks = [
      {
        label: `Volume analisado: ${quantidade.toLocaleString('pt-BR')} cartões`,
        value: clampPercent(volumeScore),
      },
      {
        label: `Custo unitário informado: R$ ${valorPorCartao.toFixed(2).replace('.', ',')}`,
        value: clampPercent(valorScore),
      },
      {
        label: 'Camadas de TCO calculadas com os dados atuais',
        value: clampPercent(camadasScore),
      },
      {
        label: `Economia digital estimada: ${resultado.economiaPercentual.toFixed(1)}%`,
        value: economiaScore,
      },
    ]
    const score = Math.round(checks.reduce((sum, check) => sum + check.value, 0) / checks.length)
    const nivel = score >= 80 ? 'Alto' : score >= 55 ? 'Médio' : 'Baixo'
    return { checks, score, nivel }
  }, [quantidade, resultado, valorPorCartao])

  useEffect(() => {
    saveOperationalMetrics('financial', {
      cartoesAnalisados: quantidade,
      economiaPercentual: resultado.economiaPercentual,
      economiaAbsoluta: resultado.economiaAbsoluta,
      tcoFisico: resultado.fisico.custoTotal,
      tcoDigital: resultado.digital,
      precisaoSimulacao: termometro.score,
      updatedAt: new Date().toISOString(),
    })
  }, [quantidade, resultado, termometro.score])

  const camadas = [
    {
      label: 'Custos diretos',
      value: resultado.fisico.custosDiretos,
      percent: resultado.percentualDireto,
      color: RED,
    },
    {
      label: 'Custos indiretos',
      value: resultado.fisico.custosIndiretos,
      percent: resultado.percentualIndireto,
      color: ROSE,
    },
    {
      label: 'Custos de falha',
      value: resultado.fisico.custosFalha,
      percent: resultado.percentualFalha,
      color: LIGHT,
    },
  ]

  return (
    <div className="w-full space-y-8 pb-16 font-sans text-black">
      <section>
        <h1 className="text-3xl font-black tracking-tight">Custos e impacto financeiro</h1>
        <p className="mt-2 max-w-xl text-lg leading-relaxed text-[#252525]">
          Matriz de custo total (TCO) em camadas - entenda o custo real além do valor unitário do cartão.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <div className="mb-7 flex items-start justify-between gap-4">
            <h2 className="max-w-[170px] text-xl font-black leading-tight">Quantidade de cartões</h2>
            <strong className="text-2xl font-black">{quantidade.toLocaleString('pt-BR')}</strong>
          </div>
          <input
            type="range"
            min={LIMITES.QUANTIDADE_CARTOES.MIN}
            max={LIMITES.QUANTIDADE_CARTOES.MAX}
            step={LIMITES.QUANTIDADE_CARTOES.STEP}
            value={quantidade}
            onChange={(event) => setQuantidade(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#5f5f5f] accent-[#ff2b1d]"
          />
          <div className="mt-4 flex justify-between text-sm font-medium">
            <span>100</span>
            <span>100.000</span>
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 className="text-xl font-black">Valor por cartão</h2>
            <span className="text-sm font-medium">Custo unitário</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setValorPorCartao((prev) => Math.max(LIMITES.VALOR_POR_CARTAO.MIN, Number((prev - LIMITES.VALOR_POR_CARTAO.STEP).toFixed(2))))}
              className="grid h-10 w-10 place-items-center rounded-xl bg-[#ff2b1d] text-white"
              aria-label="Diminuir valor por cartão"
            >
              <Minus size={18} />
            </button>
            <div className="flex h-16 flex-1 items-center justify-center rounded-xl bg-[#ffe5e5] text-3xl font-black">
              R$ {valorPorCartao.toFixed(2).replace('.', ',')}
            </div>
            <button
              type="button"
              onClick={() => setValorPorCartao((prev) => Math.min(LIMITES.VALOR_POR_CARTAO.MAX, Number((prev + LIMITES.VALOR_POR_CARTAO.STEP).toFixed(2))))}
              className="grid h-10 w-10 place-items-center rounded-xl bg-[#ff2b1d] text-white"
              aria-label="Aumentar valor por cartão"
            >
              <Plus size={18} />
            </button>
          </div>
          <p className="mt-3 text-center text-xs font-medium">
            Mín. R$ 5,00 - Máx. R$ 50,00
          </p>
        </Card>

        <Card className="bg-[#ffb4ae] lg:col-span-4">
          <div className="mb-5 flex items-center gap-2">
            <Info size={18} />
            <h2 className="text-xl font-black">Sobre as métricas</h2>
          </div>
          <p className="text-sm font-medium leading-7">
            {TEXTOS.EXPLICACAO_METRICAS}
          </p>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-12">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[260px_1fr_260px] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-black uppercase tracking-wide text-[#ff2b1d]">Termômetro de precisão</p>
                <button
                  type="button"
                  onClick={() => setTermometroInfoAberto((current) => !current)}
                  className="grid h-6 w-6 place-items-center rounded-full border border-[#ffb4ae] bg-[#ffe5e5] text-xs font-black text-[#ff2b1d] transition-all hover:bg-[#ff2b1d] hover:text-white"
                  aria-label="Explicar termômetro de precisão"
                  title="Explicar termômetro de precisão"
                >
                  i
                </button>
              </div>
              <h2 className="mt-1 text-2xl font-black">Confiança da simulação: {termometro.nivel}</h2>
              <p className="mt-2 text-sm font-medium text-[#555]">
                Mede a qualidade dos dados atuais informados na página para apoiar a leitura do TCO.
              </p>
              {termometroInfoAberto && (
                <div className="mt-4 rounded-2xl border border-[#ffb4ae] bg-[#fff7f7] p-4 text-xs font-semibold leading-relaxed text-[#555]">
                  O termômetro combina volume de cartões, custo unitário informado, camadas de TCO calculadas e economia digital estimada. Ao alterar os dados da página, a precisão é recalculada automaticamente.
                </div>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between text-sm font-black">
                <span>Acurácia estimada</span>
                <span>{termometro.score}%</span>
              </div>
              <div className="h-5 overflow-hidden rounded-full bg-[#ffe5e5]">
                <div
                  className="h-full rounded-full bg-[#ff2b1d] transition-all duration-500"
                  style={{ width: `${termometro.score}%` }}
                />
              </div>

              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  termometroExpandido ? 'mt-4 max-h-40 opacity-100' : 'mt-0 max-h-0 opacity-0'
                }`}
              >
                <div className="grid gap-2 md:grid-cols-3">
                  {termometro.checks.map((check) => (
                    <div
                      key={check.label}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs font-semibold ${
                        check.value >= 70 ? 'border-[#ffb4ae] bg-[#fff7f7] text-black' : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} className={check.value >= 70 ? 'text-[#ff2b1d]' : 'text-slate-300'} />
                        {check.label}
                      </span>
                      <strong className="text-[#ff2b1d]">{Math.round(check.value)}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
              <p className="rounded-2xl bg-[#fff7f7] p-4 text-xs font-semibold leading-relaxed text-[#555]">
                Atualiza em tempo real conforme quantidade de cartões e valor unitário mudam.
              </p>
              <button
                type="button"
                onClick={() => setTermometroExpandido((current) => !current)}
                className="inline-flex items-center justify-center rounded-2xl border border-[#ffb4ae] bg-[#ffe5e5] px-5 py-3 text-sm font-black text-[#ff2b1d] transition-all hover:bg-[#ffd6d3]"
              >
                {termometroExpandido ? 'Ocultar critérios' : 'Ver critérios'}
              </button>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <div className="mb-4 flex items-start justify-between border-b border-[#dedede] pb-4">
            <div>
              <h2 className="text-xl font-black">Custo total da operação</h2>
              <strong className="mt-2 block text-4xl font-black">{formatarMoeda(resultado.fisico.custoTotal)}</strong>
            </div>
            <TrendingUp className="text-[#ff2b1d]" size={82} strokeWidth={3.5} />
          </div>
          <Gauge value={percentualOperacao} />
          <p className="mx-auto mt-8 max-w-md text-center text-sm leading-7">
            Os custos totais representam <strong>{percentualOperacao.toFixed(1)}%</strong> do investimento esperado em operação física no horizonte máximo projetado.
          </p>
        </Card>

        <Card className="lg:col-span-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black">Como o custo total é formado</h2>
            <button
              type="button"
              onClick={() => setModoComposicao((modo) => (modo === 'barra' ? 'donut' : 'barra'))}
              className="grid h-12 w-12 place-items-center rounded-xl bg-[#ffe5e5] text-[#ff2b1d]"
              aria-label="Alternar gráfico de composição"
              title={modoComposicao === 'barra' ? 'Ver gráfico de donut' : 'Ver gráfico de barra'}
            >
              {modoComposicao === 'barra' ? <PieChartIcon size={28} /> : <BarChart3 size={28} />}
            </button>
          </div>

          <div className="flex min-h-[300px] items-center justify-center">
            <div
              key={modoComposicao}
              className="will-change-transform"
              style={{ animation: 'chartSwap 360ms cubic-bezier(.2,.8,.2,1)' }}
            >
              {modoComposicao === 'barra' ? <StackedBar camadas={camadas} /> : <Donut camadas={camadas} />}
            </div>
          </div>

          <Legend camadas={camadas} />
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <h2 className="text-xl font-black">Impacto do crescimento da operação</h2>
          <p className="text-sm font-medium">Como o TCO cresce de acordo com a quantidade de cartões emitidos.</p>
          <div className="mt-8 h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projecao} margin={{ top: 20, right: 14, left: 8, bottom: 10 }}>
                <CartesianGrid stroke="#e8e8e8" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="quantidade"
                  tickFormatter={(value) => `${Number(value) / 1000}K`}
                  tick={{ fill: '#111', fontSize: 12 }}
                  axisLine={{ stroke: '#d6d6d6' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatarMoedaAbreviada}
                  tick={{ fill: '#111', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={62}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    formatarMoeda(Number(value || 0)),
                    name === 'fisico' ? 'Físico' : 'Digital',
                  ]}
                  labelFormatter={(label) => `${Number(label).toLocaleString('pt-BR')} cartões`}
                  contentStyle={{ border: 'none', borderRadius: 12, boxShadow: '0 10px 28px rgba(0,0,0,.14)' }}
                />
                <Line type="monotone" dataKey="fisico" stroke={LIGHT} strokeWidth={1.5} dot={{ fill: LIGHT, r: 7 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="digital" stroke={RED} strokeWidth={2} dot={{ fill: RED, r: 7 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-8 border-t border-[#dedede] pt-4 text-sm">
            <LegendItem color={LIGHT} label="Físico" />
            <LegendItem color={RED} label="Digital" />
          </div>
        </Card>

        <Card className="self-start lg:col-span-6 lg:mt-16">
          <h2 className="text-xl font-black">Físico VS Digital</h2>
          <p className="text-sm font-medium">Comparativo final</p>

          <div className="relative mt-9 grid grid-cols-2 gap-5">
            <ComparisonBox title="Cartão Físico (TCO)" value={formatarMoeda(resultado.fisico.custoTotal)} />
            <ComparisonBox title="Cartão Digital (Estimado)" value={formatarMoeda(resultado.digital)} />
            <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#ff2b1d] text-2xl font-black text-white">
              VS
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#ffe5e5] p-7">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="text-[#ff7770]" size={34} />
              <h3 className="font-black">Economia potencial com solução digital</h3>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <TrendingDown size={42} />
              <strong className="text-6xl font-black leading-none">{resultado.economiaPercentual.toFixed(1)}%</strong>
              <span className="pb-2 text-2xl font-black">| {formatarMoeda(resultado.economiaAbsoluta)}</span>
            </div>
            <p className="mt-7 text-center text-sm">
              Valor economizado ao migrar a operação atual para a solução digital.
            </p>
          </div>
        </Card>
      </section>

      <style jsx global>{`
        @keyframes chartSwap {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.96);
            filter: blur(3px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-white p-6 shadow-[0_12px_28px_rgba(0,0,0,0.16)] ${className}`}>
      {children}
    </div>
  )
}

function Gauge({ value }: { value: number }) {
  const percent = Math.min(100, Math.max(0, value))
  const radius = 110
  const dash = Math.PI * radius
  const offset = dash - (dash * percent) / 100

  return (
    <div className="relative mx-auto h-[250px] w-[320px]">
      <svg className="h-full w-full overflow-visible" viewBox="0 0 320 250">
        <path d={`M 40 205 A ${radius} ${radius} 0 0 1 280 205`} fill="none" stroke={LIGHT} strokeLinecap="round" strokeWidth="22" />
        <path
          d={`M 40 205 A ${radius} ${radius} 0 0 1 280 205`}
          fill="none"
          stroke={RED}
          strokeDasharray={dash}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="22"
        />
        <text x="38" y="226" fontSize="13" fontWeight="700">0%</text>
        <text x="263" y="226" fontSize="13" fontWeight="700">100%</text>
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <strong className="block text-6xl font-black leading-none">{percent.toFixed(1)}%</strong>
        <span className="mt-2 block text-2xl">da operação</span>
      </div>
    </div>
  )
}

function StackedBar({ camadas }: { camadas: Array<{ label: string; value: number; percent: number; color: string }> }) {
  return (
    <div className="flex h-[270px] w-32 flex-col-reverse overflow-hidden">
      {camadas.map((camada) => (
        <div
          key={camada.label}
          title={`${camada.label}: ${formatarMoeda(camada.value)}`}
          style={{ height: `${Math.max(3, camada.percent)}%`, backgroundColor: camada.color }}
        />
      ))}
    </div>
  )
}

function Donut({ camadas }: { camadas: Array<{ label: string; percent: number; color: string }> }) {
  let cursor = 0
  const stops = camadas.map((camada) => {
    const start = cursor
    cursor += camada.percent
    return `${camada.color} ${start}% ${cursor}%`
  }).join(', ')

  return (
    <div className="grid h-64 w-64 place-items-center rounded-full" style={{ background: `conic-gradient(${stops})` }}>
      <div className="grid h-32 w-32 place-items-center rounded-full bg-white text-center">
        <strong className="text-lg font-black">TCO</strong>
      </div>
    </div>
  )
}

function Legend({ camadas }: { camadas: Array<{ label: string; color: string }> }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-6">
      {camadas.map((camada) => (
        <LegendItem key={camada.label} color={camada.color} label={camada.label} />
      ))}
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium" style={{ color }}>
      <span className="h-5 w-5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </div>
  )
}

function ComparisonBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#ffe5e5] px-6 py-5 text-center">
      <p className="font-medium">{title}</p>
      <strong className="mt-5 block text-2xl font-black">{value}</strong>
    </div>
  )
}