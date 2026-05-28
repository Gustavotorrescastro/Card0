'use client'

import { useMemo, useState } from 'react'
import { BarChart3, ChevronDown, Info, Minus, PieChart, Plus, TrendingDown, TrendingUp } from 'lucide-react'

import { LIMITES, TEXTOS } from './constantes'
import {
  calcularResultadoCompleto,
  calcularTCODigital,
  calcularTCOFisico,
  formatarMoeda,
  formatarMoedaAbreviada,
} from './calculos'

const QUANTIDADE_INICIAL_REFERENCIA = 13600

export default function CalculadoraImpactoPage() {
  const [quantidade, setQuantidade] = useState(QUANTIDADE_INICIAL_REFERENCIA)
  const [valorPorCartao, setValorPorCartao] = useState(
    LIMITES.VALOR_POR_CARTAO.INICIAL
  )
  const [graficoComposicao, setGraficoComposicao] = useState<'donut' | 'barra'>('barra')

  const resultado = useMemo(
    () => calcularResultadoCompleto(quantidade, valorPorCartao),
    [quantidade, valorPorCartao]
  )

  const projecao = useMemo(() => {
    const min = LIMITES.QUANTIDADE_CARTOES.MIN
    const max = LIMITES.QUANTIDADE_CARTOES.MAX
    const step = LIMITES.QUANTIDADE_CARTOES.STEP
    const inicio = Math.max(min, quantidade - 15000)
    const fim = Math.min(max, quantidade + 15000)
    const intervalo = Math.max(step, Math.round((fim - inicio) / 5 / step) * step)
    const pontos = new Set<number>([quantidade])

    for (let valor = inicio; valor <= fim; valor += intervalo) {
      pontos.add(Math.round(valor / step) * step)
    }

    return [...pontos]
      .filter((valor) => valor >= min && valor <= max)
      .sort((a, b) => a - b)
      .map((cartoes) => ({
        quantidade: cartoes,
        tcoFisico: calcularTCOFisico(cartoes, valorPorCartao).custoTotal,
        tcoDigital: calcularTCODigital(cartoes),
      }))
  }, [quantidade, valorPorCartao])

  const percentualOperacao = useMemo(() => {
    const maxProjecao = Math.max(...projecao.map((ponto) => ponto.tcoFisico))
    return maxProjecao > 0
      ? (resultado.fisico.custoTotal / maxProjecao) * 100
      : 0
  }, [projecao, resultado.fisico.custoTotal])

  return (
    <div className="w-full space-y-8 pb-16 font-sans">
      <section>
        <h1 className="text-3xl font-black tracking-tight text-black">
          Custos e impacto financeiro
        </h1>
        <p className="mt-2 max-w-xl text-lg leading-relaxed text-[#252525]">
          {TEXTOS.SUBTITULO}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ControlCard title="Quantidade de cartões" value={quantidade.toLocaleString('pt-BR')}>
          <input
            type="range"
            min={LIMITES.QUANTIDADE_CARTOES.MIN}
            max={LIMITES.QUANTIDADE_CARTOES.MAX}
            step={LIMITES.QUANTIDADE_CARTOES.STEP}
            value={quantidade}
            onChange={(event) => setQuantidade(Number(event.target.value))}
            className="w-full accent-[#ff2b1d]"
          />
          <div className="mt-1 flex justify-between text-sm text-black">
            <span>{LIMITES.QUANTIDADE_CARTOES.MIN.toLocaleString('pt-BR')}</span>
            <span>{LIMITES.QUANTIDADE_CARTOES.MAX.toLocaleString('pt-BR')}</span>
          </div>
        </ControlCard>

        <ControlCard title="Valor por cartão" subtitle="Custo unitário">
          <div className="flex items-center gap-4">
            <StepperButton
              icon="plus"
              onClick={() =>
                setValorPorCartao((valor) =>
                  Math.min(valor + LIMITES.VALOR_POR_CARTAO.STEP, LIMITES.VALOR_POR_CARTAO.MAX)
                )
              }
            />
            <div className="flex min-h-[68px] flex-1 items-center justify-center rounded-xl bg-[#ffe5e5] text-3xl font-black text-black">
              {formatarMoeda(valorPorCartao)}
            </div>
            <StepperButton
              icon="minus"
              onClick={() =>
                setValorPorCartao((valor) =>
                  Math.max(valor - LIMITES.VALOR_POR_CARTAO.STEP, LIMITES.VALOR_POR_CARTAO.MIN)
                )
              }
            />
          </div>
          <p className="mt-3 text-center text-xs text-[#4b4b4b]">
            Min. R$ 5,00 - Máx. R$ 50,00
          </p>
        </ControlCard>

        <section className="min-h-[205px] rounded-xl bg-[#ffb4ae] p-6 shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-2 text-lg font-black text-black">
            <Info size={18} />
            Sobre as métricas
          </div>
          <div className="mt-5 grid grid-cols-[1fr_82px] gap-4">
            <p className="text-sm leading-7 text-[#252525]">
              {TEXTOS.EXPLICACAO_METRICAS}
            </p>
            <div className="flex items-center justify-center">
              <Info className="text-[#ffe5e5]" size={82} strokeWidth={1.6} />
            </div>
          </div>
        </section>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-7 shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
          <div className="flex items-start justify-between border-b border-[#d8d8d8] pb-4">
            <div>
              <h2 className="text-lg font-black text-black">Custo total da operação</h2>
              <p className="mt-3 text-4xl font-black text-black">
                {formatarMoeda(resultado.fisico.custoTotal)}
              </p>
            </div>
            <TrendingUp size={76} className="text-[#ff2b1d]" strokeWidth={3.5} />
          </div>

          <div className="relative mx-auto mt-7 flex h-52 max-w-md items-center justify-center">
            <svg className="h-full w-full" viewBox="0 0 260 160">
              <path
                d="M 45 125 A 85 85 0 0 1 215 125"
                fill="none"
                stroke="#ffb4ae"
                strokeLinecap="round"
                strokeWidth="18"
              />
              <path
                d="M 45 125 A 85 85 0 0 1 215 125"
                fill="none"
                stroke="#ff2b1d"
                strokeLinecap="round"
                strokeWidth="18"
                strokeDasharray="267"
                strokeDashoffset={267 - (267 * Math.min(percentualOperacao, 100)) / 100}
              />
            </svg>
            <div className="absolute translate-y-7 text-center">
              <p className="text-4xl font-black tracking-tight text-black">
                {percentualOperacao.toFixed(1)}%
              </p>
              <p className="text-lg text-black">da operação</p>
            </div>
            <span className="absolute bottom-5 left-16 text-sm text-black">0%</span>
            <span className="absolute bottom-5 right-14 text-sm text-black">100%</span>
          </div>

          <p className="mx-auto mt-4 max-w-md text-center text-sm leading-7 text-black">
            Os custos totais representam <strong>{percentualOperacao.toFixed(1)}%</strong> do investimento esperado em operação física no horizonte máximo projetado.
          </p>
        </section>

        <section className="rounded-xl bg-white p-7 shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg font-black text-black">Como o custo total é formado</h2>
            <button
              type="button"
              onClick={() => setGraficoComposicao((modo) => (modo === 'donut' ? 'barra' : 'donut'))}
              className="rounded-xl bg-[#ffe5e5] p-2 text-[#ff2b1d] transition-transform hover:scale-105"
              aria-label="Alternar gráfico de composição"
              title={graficoComposicao === 'donut' ? 'Ver barra vertical' : 'Ver donut'}
            >
              {graficoComposicao === 'donut' ? <BarChart3 size={28} /> : <PieChart size={28} />}
            </button>
          </div>

          <div className="flex min-h-[300px] items-center justify-center">
            {graficoComposicao === 'donut' ? (
              <DonutChart
                direto={resultado.percentualDireto}
                indireto={resultado.percentualIndireto}
                falha={resultado.percentualFalha}
              />
            ) : (
              <VerticalStackedBar
                direto={resultado.percentualDireto}
                indireto={resultado.percentualIndireto}
                falha={resultado.percentualFalha}
              />
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm">
            <Legend color="#ff2b1d" label="Custos diretos" />
            <Legend color="#ff7770" label="Custos indiretos" />
            <Legend color="#ffb4ae" label="Custos de falha" />
          </div>
        </section>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-7 shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
          <h2 className="text-lg font-black text-black">Impacto do crescimento da operação</h2>
          <p className="text-sm text-black">
            Como o TCO cresce de acordo com a quantidade de cartões emitidos.
          </p>
          <ProjectionChart pontos={projecao} quantidadeAtual={quantidade} />
        </section>

        <section className="self-center rounded-xl bg-white p-7 shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
          <h2 className="text-lg font-black text-black">Físico VS Digital</h2>
          <p className="text-sm text-black">Comparativo final</p>

          <div className="relative mt-8 grid grid-cols-2 gap-8">
            <ComparisonBox label="Cartão Físico (TCO)" value={formatarMoeda(resultado.fisico.custoTotal)} />
            <ComparisonBox label="Cartão Digital (Estimado)" value={formatarMoeda(resultado.digital)} />
            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff2b1d] text-2xl font-black text-white">
              VS
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#ffe5e5] p-7">
            <div className="flex items-center gap-3 text-lg font-black text-black">
              <TrendingDown size={42} />
              Economia potencial com solução Digital
            </div>
            <p className="mt-5 text-6xl font-black tracking-tight text-black">
              {resultado.economiaPercentual.toFixed(1)}%
              <span className="ml-3 text-3xl">| {formatarMoeda(resultado.economiaAbsoluta)}</span>
            </p>
            <p className="mt-5 text-sm text-black">
              Valor economizado ao migrar a operação atual para a solução digital.
            </p>
          </div>
        </section>
      </section>
    </div>
  )
}

function ControlCard({
  title,
  value,
  subtitle,
  children,
}: {
  title: string
  value?: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="min-h-[160px] rounded-xl bg-white p-6 shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
      <div className="mb-8 flex items-start justify-between gap-4">
        <h2 className="text-lg font-black text-black">{title}</h2>
        {value && <p className="text-2xl font-black text-black">{value}</p>}
        {subtitle && <p className="text-sm text-black">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function StepperButton({ icon, onClick }: { icon: 'plus' | 'minus'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff2b1d] text-white"
    >
      {icon === 'plus' ? <Plus size={22} strokeWidth={3} /> : <Minus size={22} strokeWidth={3} />}
    </button>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2" style={{ color }}>
      <span className="h-6 w-6 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  )
}

function VerticalStackedBar({
  direto,
  indireto,
  falha,
}: {
  direto: number
  indireto: number
  falha: number
}) {
  return (
    <div className="flex h-[285px] w-32 flex-col-reverse justify-end">
      <div
        className="bg-[#ff2b1d]"
        style={{ height: `${direto}%` }}
        title={`Custos diretos: ${direto.toFixed(1)}%`}
      />
      <div
        className="bg-[#ff7770]"
        style={{ height: `${indireto}%` }}
        title={`Custos indiretos: ${indireto.toFixed(1)}%`}
      />
      <div
        className="bg-[#ffb4ae]"
        style={{ height: `${falha}%` }}
        title={`Custos de falha: ${falha.toFixed(1)}%`}
      />
    </div>
  )
}

function DonutChart({
  direto,
  indireto,
  falha,
}: {
  direto: number
  indireto: number
  falha: number
}) {
  const raio = 72
  const circunferencia = 2 * Math.PI * raio
  const segmentos = [
    { label: 'Diretos', valor: direto, color: '#ff2b1d' },
    { label: 'Indiretos', valor: indireto, color: '#ff7770' },
    { label: 'Falha', valor: falha, color: '#ffb4ae' },
  ]
  let acumulado = 0

  return (
    <div className="relative flex h-[260px] w-[260px] items-center justify-center">
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
        <circle
          cx="110"
          cy="110"
          r={raio}
          fill="none"
          stroke="#f2f2f2"
          strokeWidth="34"
        />
        {segmentos.map((segmento) => {
          const dash = (segmento.valor / 100) * circunferencia
          const dashOffset = -(acumulado / 100) * circunferencia
          acumulado += segmento.valor

          return (
            <circle
              key={segmento.label}
              cx="110"
              cy="110"
              r={raio}
              fill="none"
              stroke={segmento.color}
              strokeWidth="34"
              strokeDasharray={`${dash} ${circunferencia - dash}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
            />
          )
        })}
      </svg>

      <div className="absolute text-center">
        <p className="text-3xl font-black text-black">{direto.toFixed(0)}%</p>
        <p className="text-xs font-semibold text-slate-500">custos diretos</p>
      </div>
    </div>
  )
}

function ComparisonBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#ffe5e5] px-6 py-7 text-center">
      <p className="text-base text-black">{label}</p>
      <p className="mt-4 text-3xl font-black text-black">{value}</p>
    </div>
  )
}

function ProjectionChart({
  pontos,
  quantidadeAtual,
}: {
  pontos: Array<{ quantidade: number; tcoFisico: number; tcoDigital: number }>
  quantidadeAtual: number
}) {
  const width = 560
  const height = 360
  const padding = { top: 24, right: 32, bottom: 58, left: 82 }
  const maxY = Math.max(...pontos.map((ponto) => ponto.tcoFisico))
  const minX = Math.min(...pontos.map((ponto) => ponto.quantidade))
  const maxX = Math.max(...pontos.map((ponto) => ponto.quantidade))
  const xRange = Math.max(maxX - minX, 1)

  const x = (quantidade: number) =>
    padding.left +
    ((quantidade - minX) / xRange) *
      (width - padding.left - padding.right)

  const y = (valor: number) =>
    height -
    padding.bottom -
    (valor / maxY) * (height - padding.top - padding.bottom)

  const lineFisico = pontos.map((ponto) => `${x(ponto.quantidade)},${y(ponto.tcoFisico)}`).join(' ')
  const lineDigital = pontos.map((ponto) => `${x(ponto.quantidade)},${y(ponto.tcoDigital)}`).join(' ')
  const yTicks = [0, 0.33, 0.66, 1].map((fator) => maxY * fator)

  return (
    <div className="mt-8 w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[560px]">
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="#e5e5e5"
              strokeDasharray="3 3"
            />
            <text x={padding.left - 12} y={y(tick) + 4} textAnchor="end" className="fill-black text-[11px]">
              {formatarMoedaAbreviada(tick)}
            </text>
          </g>
        ))}

        <polyline points={lineFisico} fill="none" stroke="#ffb4ae" strokeWidth="1.5" />
        <polyline points={lineDigital} fill="none" stroke="#ff2b1d" strokeWidth="1.5" />

        {pontos.map((ponto) => {
          const atual = ponto.quantidade === quantidadeAtual

          return (
            <g key={ponto.quantidade}>
              <circle cx={x(ponto.quantidade)} cy={y(ponto.tcoFisico)} r={atual ? 10 : 7} fill="#ffb4ae" />
              <circle cx={x(ponto.quantidade)} cy={y(ponto.tcoDigital)} r={atual ? 9 : 7} fill={atual ? '#ff2b1d' : '#ff2b1d'} />
              <text
                x={x(ponto.quantidade)}
                y={height - 28}
                textAnchor="middle"
                className={`fill-black text-[10px] ${atual ? 'font-bold' : ''}`}
              >
                {ponto.quantidade >= 1000 ? `${Math.round(ponto.quantidade / 100) / 10}K` : ponto.quantidade}
              </text>
              {atual && (
                <text x={x(ponto.quantidade)} y={height - 12} textAnchor="middle" className="fill-[#ff2b1d] text-[9px] font-bold">
                  atual
                </text>
              )}
            </g>
          )
        })}

        <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} stroke="#d0d0d0" />
      </svg>

      <div className="mt-2 flex justify-center gap-8 text-sm text-black">
        <Legend color="#ffb4ae" label="Físico" />
        <Legend color="#ff2b1d" label="Digital" />
      </div>
    </div>
  )
}
