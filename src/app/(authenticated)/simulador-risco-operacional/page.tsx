'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Leaf,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Zap,
} from 'lucide-react'
import { LIMITES } from './constantes'
import { calcularMetricasRisco } from './calculos'
import { saveOperationalMetrics } from '@/lib/operationalMetrics'

const RED = '#ff2b1d'
const LIGHT = '#ffb4ae'

export default function SimuladorRiscoPage() {
  const [cartoesAtivos, setCartoesAtivos] = useState(13600)
  const [taxaFalha, setTaxaFalha] = useState(LIMITES.TAXA_FALHA.INICIAL)
  const [cenario, setCenario] = useState<'conservador' | 'realista' | 'critico'>('realista')

  const metricas = useMemo(
    () => calcularMetricasRisco(cartoesAtivos, taxaFalha),
    [cartoesAtivos, taxaFalha]
  )

  const riscoScore = useMemo(() => {
    const base = Math.min(100, Math.round(taxaFalha * 9 + metricas.falhasMes / 70))
    return Math.max(8, base)
  }, [metricas.falhasMes, taxaFalha])

  const riscoNivel = riscoScore >= 70 ? 'Crítico' : riscoScore >= 40 ? 'Atenção' : 'Controlado'

  useEffect(() => {
    saveOperationalMetrics('risk', {
      cartoesAtivos,
      co2EvitadoKg: metricas.co2Evitado,
      materiaPrimaReduzidaKg: metricas.plasticoFisicoMes,
      falhasEvitaveisMes: metricas.falhasMes,
      economiaFinanceira: metricas.economiaFinanceira,
      economiaPercentual: metricas.custoFisicoMes > 0 ? (metricas.economiaFinanceira / metricas.custoFisicoMes) * 100 : 0,
      riscoScore,
      updatedAt: new Date().toISOString(),
    })
  }, [cartoesAtivos, metricas, riscoScore])

  const aplicarCenario = (tipo: 'conservador' | 'realista' | 'critico') => {
    setCenario(tipo)
    if (tipo === 'conservador') {
      setCartoesAtivos(8000)
      setTaxaFalha(1.1)
    }
    if (tipo === 'realista') {
      setCartoesAtivos(13600)
      setTaxaFalha(2)
    }
    if (tipo === 'critico') {
      setCartoesAtivos(50000)
      setTaxaFalha(6.5)
    }
  }

  return (
    <div className="w-full space-y-8 pb-16 font-sans text-black">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="rounded-xl bg-white p-7 shadow-[0_12px_28px_rgba(0,0,0,0.16)] lg:col-span-7">
          <div className="mb-8 flex items-start gap-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#ff2b1d] text-white">
              <AlertTriangle size={32} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-[#ff2b1d]">Simulações e cenários</p>
              <h1 className="text-4xl font-black tracking-tight">Risco operacional</h1>
              <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-[#555]">
                Simule o efeito de falhas, reemissões e cartões ativos para comparar o cenário físico com uma operação digital.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SliderCard
              icon={<CreditCard size={20} />}
              label="Cartões ativos"
              value={cartoesAtivos}
              min={LIMITES.CARTOES_ATIVOS.MIN}
              max={LIMITES.CARTOES_ATIVOS.MAX}
              step={LIMITES.CARTOES_ATIVOS.STEP}
              onChange={setCartoesAtivos}
            />
            <SliderCard
              icon={<SlidersHorizontal size={20} />}
              label="Taxa de falha mensal"
              value={taxaFalha}
              suffix="%"
              min={LIMITES.TAXA_FALHA.MIN}
              max={LIMITES.TAXA_FALHA.MAX}
              step={LIMITES.TAXA_FALHA.STEP}
              onChange={setTaxaFalha}
            />
          </div>
        </div>

        <div className="rounded-xl bg-[#ff2b1d] p-7 text-white shadow-[0_12px_28px_rgba(0,0,0,0.16)] lg:col-span-5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-white/70">Score de risco</p>
              <h2 className="text-2xl font-black">{riscoNivel}</h2>
            </div>
            <ShieldCheck size={44} />
          </div>

          <div className="relative mx-auto h-44 w-44">
            <div className="absolute inset-0 rounded-full bg-white/20" />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#ffffff ${riscoScore}%, rgba(255,255,255,0.22) 0)`,
              }}
            />
            <div className="absolute inset-5 grid place-items-center rounded-full bg-[#ff2b1d]">
              <strong className="text-5xl font-black">{riscoScore}</strong>
            </div>
          </div>

          <p className="mt-6 text-center text-sm font-medium leading-relaxed text-white/80">
            {metricas.falhasMes.toLocaleString('pt-BR')} falhas estimadas por mês no cenário atual.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <ScenarioButton active={cenario === 'conservador'} label="Conservador" description="Baixo volume e falha controlada" onClick={() => aplicarCenario('conservador')} />
        <ScenarioButton active={cenario === 'realista'} label="Realista" description="Operação média empresarial" onClick={() => aplicarCenario('realista')} />
        <ScenarioButton active={cenario === 'critico'} label="Crítico" description="Alta escala com falhas elevadas" onClick={() => aplicarCenario('critico')} />
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <ComparisonPanel
          className="lg:col-span-6"
          title="Cenário físico"
          subtitle="Reemissão, logística e retrabalho"
          tone="dark"
          items={[
            { label: 'Emissão CO₂', value: `${metricas.co2FisicoMes.toLocaleString('pt-BR')} kg` },
            { label: 'Custo logístico', value: `R$ ${metricas.custoFisicoMes.toLocaleString('pt-BR')}` },
            { label: 'Plástico envolvido', value: `${metricas.plasticoFisicoMes.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg` },
          ]}
        />
        <ComparisonPanel
          className="lg:col-span-6"
          title="Cenário digital"
          subtitle="Operação com falha operacional reduzida"
          tone="light"
          items={[
            { label: 'Emissão CO₂', value: '0 kg' },
            { label: 'Custo operacional', value: `R$ ${metricas.custoDigitalOperacional.toLocaleString('pt-BR')}` },
            { label: 'Falhas com reemissão', value: '0 cartões físicos' },
          ]}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <MetricCard icon={<Leaf size={24} />} label="CO₂ evitável" value={`${metricas.co2Evitado.toLocaleString('pt-BR')} kg`} />
        <MetricCard icon={<CircleDollarSign size={24} />} label="Economia possível" value={`R$ ${metricas.economiaFinanceira.toLocaleString('pt-BR')}`} />
        <MetricCard icon={<CalendarDays size={24} />} label="Retorno estimado" value={metricas.economiaFinanceira > 0 ? '~1 mês' : 'A definir'} />
      </section>

      <section className="rounded-xl bg-white p-7 shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-[#ff2b1d]">Plano de ação</p>
            <h2 className="text-2xl font-black">O que fazer com esse cenário?</h2>
          </div>
          <button
            type="button"
            onClick={() => aplicarCenario('realista')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ffb4ae] bg-[#ffe5e5] px-5 py-3 text-sm font-black transition-all hover:bg-[#ffd6d3]"
          >
            <RotateCcw size={16} />
            Voltar ao padrão
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ActionCard title="Migrar grupos críticos" text="Priorize áreas com maior taxa de reemissão para reduzir falha recorrente." />
          <ActionCard title="Criar campanha digital" text="Use incentivos internos para acelerar adesão e reduzir logística." />
          <ActionCard title="Monitorar mensalmente" text="Compare falhas e economia antes e depois da política de migração." />
        </div>
      </section>
    </div>
  )
}

function SliderCard({
  icon,
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: {
  icon: React.ReactNode
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <div className="rounded-2xl border border-[#ffe1de] bg-[#fff7f7] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-sm font-black">
          <span className="text-[#ff2b1d]">{icon}</span>
          {label}
        </div>
        <strong className="text-2xl font-black">{value.toLocaleString('pt-BR')}{suffix}</strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#ffb4ae] accent-[#ff2b1d]"
      />
      <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
        <span>{min.toLocaleString('pt-BR')}</span>
        <span>{max.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}

function ScenarioButton({ active, label, description, onClick }: { active: boolean; label: string; description: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl p-5 text-left shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-0.5 ${
        active ? 'bg-[#ff2b1d] text-white' : 'bg-white'
      }`}
    >
      <div className="mb-3 inline-flex rounded-2xl bg-white/20 p-3">
        <Zap size={22} />
      </div>
      <h3 className="text-xl font-black">{label}</h3>
      <p className={`mt-2 text-sm font-medium ${active ? 'text-white/80' : 'text-slate-500'}`}>{description}</p>
    </button>
  )
}

function ComparisonPanel({
  title,
  subtitle,
  items,
  tone,
  className = '',
}: {
  title: string
  subtitle: string
  items: Array<{ label: string; value: string }>
  tone: 'dark' | 'light'
  className?: string
}) {
  const dark = tone === 'dark'

  return (
    <div className={`rounded-xl p-7 shadow-[0_12px_28px_rgba(0,0,0,0.16)] ${dark ? 'bg-[#111] text-white' : 'bg-white'} ${className}`}>
      <p className={`text-sm font-black uppercase tracking-wide ${dark ? 'text-[#ffb4ae]' : 'text-[#ff2b1d]'}`}>{subtitle}</p>
      <h2 className="mt-1 text-3xl font-black">{title}</h2>
      <div className="mt-7 space-y-4">
        {items.map((item) => (
          <div key={item.label} className={`flex items-center justify-between border-b pb-3 ${dark ? 'border-white/15' : 'border-slate-200'}`}>
            <span className={`text-xs font-black uppercase tracking-wide ${dark ? 'text-white/55' : 'text-slate-500'}`}>{item.label}</span>
            <strong className={dark ? 'text-[#ffb4ae]' : 'text-[#ff2b1d]'}>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
      <div className="mb-4 inline-flex rounded-2xl bg-[#ffe5e5] p-3 text-[#ff2b1d]">{icon}</div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
      <strong className="mt-2 block text-3xl font-black">{value}</strong>
    </div>
  )
}

function ActionCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="group rounded-2xl border border-[#ffe1de] bg-[#fff7f7] p-5 transition-all hover:border-[#ff2b1d]/40 hover:bg-white">
      <div className="mb-4 inline-flex rounded-full bg-[#ff2b1d] p-2 text-white">
        <ArrowRight size={16} />
      </div>
      <h3 className="font-black">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">{text}</p>
    </div>
  )
}
