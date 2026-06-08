'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, History, Leaf, Target } from 'lucide-react'
import { CONFIGURACOES_FORMULARIO } from './constantes'
import { useLinhaDoTempo } from './useLinhaDoTempo'
import { saveOperationalMetrics } from '@/lib/operationalMetrics'

const TIMELINE_INPUTS_KEY = 'card0TimelineInputs'

type TimelineInputs = {
  startDate: string
  goalKg: string
}

function hojeISO() {
  const hoje = new Date()
  const year = hoje.getFullYear()
  const month = String(hoje.getMonth() + 1).padStart(2, '0')
  const day = String(hoje.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatarDataLocal(dateISO: string) {
  const [year, month, day] = dateISO.split('-')
  return year && month && day ? `${day}/${month}/${year}` : '--'
}

function lerDadosSalvos(): TimelineInputs | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(TIMELINE_INPUTS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function salvarDados(inputs: TimelineInputs) {
  if (typeof window === 'undefined') return

  localStorage.setItem(TIMELINE_INPUTS_KEY, JSON.stringify(inputs))
}

export default function TimelinePage() {
  const { impactData, loading, error, calcularImpacto } = useLinhaDoTempo()
  const [startDate, setStartDate] = useState('2024-01-15')
  const [goalKg, setGoalKg] = useState('')
  const [dadosCarregados, setDadosCarregados] = useState(false)

  const userGoal = goalKg
    ? `${Number(goalKg).toLocaleString('pt-BR')} kg`
    : 'Defina sua meta'

  const timeline = useMemo(() => {
    const days = impactData?.accumulatedImpact.days ?? 0
    const total = impactData?.accumulatedImpact.totalKgCO2 ?? 0
    return [
      { label: 'Adesão', value: startDate ? formatarDataLocal(startDate) : '--', progress: 12 },
      { label: 'Primeiro mês', value: `${Math.max(0, Math.round(total * 0.08)).toLocaleString('pt-BR')} kg`, progress: 36 },
      { label: 'Hoje', value: `${days.toLocaleString('pt-BR')} dias`, progress: impactData ? 72 : 50 },
      { label: 'Meta definida', value: userGoal, progress: 100 },
    ]
  }, [impactData, startDate, userGoal])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    salvarDados({ startDate, goalKg })
    calcularImpacto({ startDate })
  }

  const totalKg = impactData?.accumulatedImpact.totalKgCO2 ?? 0
  const days = impactData?.accumulatedImpact.days ?? 0
  const mediaMensal = totalKg > 0 && days > 0 ? (totalKg / days) * 30 : 0
  const metaKg = Number(goalKg || 0)

  useEffect(() => {
    const dadosSalvos = lerDadosSalvos()

    if (dadosSalvos?.startDate) {
      setStartDate(dadosSalvos.startDate)
    }

    if (dadosSalvos?.goalKg) {
      setGoalKg(dadosSalvos.goalKg)
    }

    if (dadosSalvos?.startDate && dadosSalvos?.goalKg) {
      calcularImpacto({ startDate: dadosSalvos.startDate })
    }

    setDadosCarregados(true)
  }, [])

  useEffect(() => {
    if (!dadosCarregados || !startDate || !goalKg) return

    salvarDados({ startDate, goalKg })
  }, [dadosCarregados, goalKg, startDate])

  useEffect(() => {
    if (!impactData || metaKg <= 0) return

    saveOperationalMetrics('timeline', {
      co2EvitadoKg: totalKg,
      metaKg,
      progressoMetaPercent: Math.min(100, (totalKg / metaKg) * 100),
      diasAtivos: days,
      mediaMensalKg: mediaMensal,
      updatedAt: new Date().toISOString(),
    })
  }, [days, impactData, mediaMensal, metaKg, totalKg])

  return (
    <div className="w-full space-y-8 pb-16 font-sans text-black">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="rounded-xl bg-white p-7 shadow-[0_12px_28px_rgba(0,0,0,0.16)] lg:col-span-7">
          <div className="mb-8 flex items-start gap-5">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#ff2b1d] text-white">
              <History size={32} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-[#ff2b1d]">Linha do tempo</p>
              <h1 className="text-4xl font-black tracking-tight">Impacto acumulado</h1>
              <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-[#555]">
                Acompanhe como a migração para digital se transforma em redução de carbono ao longo do tempo.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(190px,240px)_minmax(260px,1fr)_auto] md:items-end">
            <label>
              <span className="mb-2 block text-xs font-black text-slate-500">{CONFIGURACOES_FORMULARIO.DATA_ADESAO.LABEL}</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                min={CONFIGURACOES_FORMULARIO.DATA_ADESAO.MIN_DATE}
                max={hojeISO()}
                className="h-12 w-full rounded-2xl border border-[#ffb4ae] bg-[#fff7f7] px-4 text-sm font-semibold outline-none focus:border-[#ff2b1d] focus:ring-2 focus:ring-[#ff2b1d]/20"
                required
              />
            </label>

            <label>
              <span className="mb-2 block text-xs font-black text-slate-500">Meta da empresa em kg</span>
              <div className="flex h-12 overflow-hidden rounded-2xl border border-[#ffb4ae] bg-[#fff7f7] focus-within:border-[#ff2b1d] focus-within:ring-2 focus-within:ring-[#ff2b1d]/20">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={goalKg}
                  onChange={(event) => setGoalKg(event.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 1200"
                  className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm font-semibold outline-none"
                  required
                />
                <span className="grid h-full w-14 place-items-center bg-[#ffe5e5] text-sm font-black text-[#ff2b1d]">kg</span>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#ff2b1d] px-6 text-sm font-black text-white transition-all hover:bg-[#e51f13] disabled:bg-slate-300"
            >
              {loading ? 'Calculando...' : 'Ver impacto'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-[#ff2b1d] p-7 text-white shadow-[0_12px_28px_rgba(0,0,0,0.16)] lg:col-span-5">
          <p className="text-sm font-black uppercase tracking-wide text-white/70">Resumo executivo</p>
          <strong className="mt-4 block text-6xl font-black leading-none">
            {totalKg.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
          </strong>
          <span className="mt-2 block text-2xl font-black">kg CO₂ evitados</span>
          <p className="mt-6 text-sm font-medium leading-relaxed text-white/80">
            {impactData ? impactData.accumulatedImpact.message : 'Informe uma data de adesão para calcular o impacto acumulado.'}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <MetricCard icon={<Clock3 size={24} />} label="Tempo ativo" value={`${days.toLocaleString('pt-BR')} dias`} />
        <MetricCard icon={<Leaf size={24} />} label="Média mensal" value={`${mediaMensal.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`} />
        <MetricCard icon={<Target size={24} />} label="Meta definida" value={userGoal} />
      </section>

      <section className="rounded-xl bg-white p-7 shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
        <div className="mb-7">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-[#ff2b1d]">Jornada</p>
            <h2 className="text-2xl font-black">Marcos de impacto</h2>
          </div>
        </div>

        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-4">
          {timeline.map((item) => (
            <div key={item.label} className="relative rounded-2xl border border-[#ffe1de] bg-[#fff7f7] p-5">
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-[#ffe5e5]">
                <div className="h-full rounded-full bg-[#ff2b1d]" style={{ width: `${item.progress}%` }} />
              </div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">{item.label}</p>
              <strong className="mt-2 block text-xl font-black">{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-white p-7 shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays className="text-[#ff2b1d]" size={28} />
          <h2 className="text-2xl font-black">Leitura rápida</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Insight text="Quanto maior o tempo de adesão digital, maior o impacto acumulado sem depender de novas emissões físicas." />
          <Insight text="A média mensal ajuda a transformar o resultado em meta para áreas internas e campanhas de adesão." />
          <Insight text="A meta definida pela empresa facilita comunicação executiva e acompanhamento interno." />
        </div>
      </section>
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
      <div className="mb-4 inline-flex rounded-2xl bg-[#ffe5e5] p-3 text-[#ff2b1d]">{icon}</div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
      <strong className="mt-2 block break-words text-2xl font-black leading-tight">{value}</strong>
    </div>
  )
}

function Insight({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#ffe1de] bg-[#fff7f7] p-5 text-sm font-semibold leading-relaxed text-[#555]">
      {text}
    </div>
  )
}
