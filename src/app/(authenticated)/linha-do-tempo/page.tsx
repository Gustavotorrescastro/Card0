'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, History, Leaf, Target, X } from 'lucide-react'
import { CONFIGURACOES_FORMULARIO } from './constantes'
import { useLinhaDoTempo } from './useLinhaDoTempo'
import { saveOperationalMetrics } from '@/lib/operationalMetrics'

const TIMELINE_INPUTS_KEY = 'card0TimelineInputs'
const KG_CO2_EVITADO_POR_USO_DIGITAL = 0.05

type TimelineInputs = {
  startDate: string
  goalKg: string
  hasDigital?: 'yes' | 'no'
  digitalPercent?: string
  dailyPhysicalUses?: string
  dailyDigitalUses?: string
  onboardingCompleted?: boolean
}

type CompanyProfile = {
  pessoas?: string
  cartoes?: string
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

function getCompanyStorageKey(email?: string) {
  return `companyProfile:${email || 'default'}`
}

function lerEmpresaCadastrada(): CompanyProfile {
  if (typeof window === 'undefined') return {}

  try {
    const email = localStorage.getItem('userEmail') || 'default'
    const raw = localStorage.getItem(getCompanyStorageKey(email))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function asPositiveNumber(value: string) {
  const parsed = Number(value || 0)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function estimateDailyUses(company: CompanyProfile, hasDigital: 'yes' | 'no', digitalPercent: string) {
  const people = asPositiveNumber(company.pessoas || '')
  const cards = asPositiveNumber(company.cartoes || '')
  const operationalBase = Math.max(people, cards, 1)
  const totalUses = Math.max(1, Math.round(operationalBase * 1.15))
  const percent = hasDigital === 'yes' ? Math.min(100, Math.max(0, Number(digitalPercent || 0))) : 0
  const digital = Math.round(totalUses * (percent / 100))

  return {
    physical: Math.max(0, totalUses - digital),
    digital,
  }
}

export default function TimelinePage() {
  const { impactData, loading, error, calcularImpacto, limpar } = useLinhaDoTempo()
  const [startDate, setStartDate] = useState('2024-01-15')
  const [goalKg, setGoalKg] = useState('')
  const [hasDigital, setHasDigital] = useState<'yes' | 'no' | ''>('')
  const [digitalPercent, setDigitalPercent] = useState('')
  const [dailyPhysicalUses, setDailyPhysicalUses] = useState('')
  const [dailyDigitalUses, setDailyDigitalUses] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({})
  const [dadosCarregados, setDadosCarregados] = useState(false)

  const estimatedUses = useMemo(
    () => estimateDailyUses(companyProfile, hasDigital === 'no' ? 'no' : 'yes', digitalPercent),
    [companyProfile, digitalPercent, hasDigital]
  )
  const effectiveDailyPhysicalUses = asPositiveNumber(dailyPhysicalUses) || estimatedUses.physical
  const effectiveDailyDigitalUses =
    hasDigital === 'yes' ? asPositiveNumber(dailyDigitalUses) || estimatedUses.digital : 0
  const userGoal = goalKg
    ? `${Number(goalKg).toLocaleString('pt-BR')} kg`
    : 'Defina sua meta'
  const hasDigitalUsage = hasDigital === 'yes'
  const totalKg = hasDigitalUsage
    ? (impactData?.accumulatedImpact.days ?? 0) * effectiveDailyDigitalUses * KG_CO2_EVITADO_POR_USO_DIGITAL
    : 0
  const days = hasDigitalUsage ? impactData?.accumulatedImpact.days ?? 0 : 0
  const mediaMensal = totalKg > 0 && days > 0 ? (totalKg / days) * 30 : 0
  const metaKg = Number(goalKg || 0)

  const timeline = useMemo(() => {
    return [
      { label: hasDigitalUsage ? 'Adesão' : 'Meta de início', value: startDate ? formatarDataLocal(startDate) : '--', progress: 12 },
      { label: 'Uso digital diário', value: `${effectiveDailyDigitalUses.toLocaleString('pt-BR')} usos`, progress: 36 },
      { label: 'Hoje', value: `${days.toLocaleString('pt-BR')} dias`, progress: hasDigitalUsage && impactData ? 72 : 50 },
      { label: 'Meta definida', value: userGoal, progress: 100 },
    ]
  }, [days, effectiveDailyDigitalUses, hasDigitalUsage, impactData, startDate, userGoal])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    salvarDados({
      startDate,
      goalKg,
      hasDigital: hasDigitalUsage ? 'yes' : 'no',
      digitalPercent,
      dailyPhysicalUses,
      dailyDigitalUses,
      onboardingCompleted: true,
    })

    if (hasDigitalUsage) {
      calcularImpacto({ startDate })
      return
    }

    limpar()
  }

  const salvarOnboarding = (event: React.FormEvent) => {
    event.preventDefault()
    if (!hasDigital) return

    const nextInputs = {
      startDate,
      goalKg,
      hasDigital,
      digitalPercent: hasDigital === 'yes' ? digitalPercent : '0',
      dailyPhysicalUses,
      dailyDigitalUses,
      onboardingCompleted: true,
    }

    salvarDados(nextInputs)
    setShowOnboarding(false)

    if (hasDigital === 'yes') {
      calcularImpacto({ startDate })
      return
    }

    limpar()
  }

  useEffect(() => {
    const dadosSalvos = lerDadosSalvos()
    const empresa = lerEmpresaCadastrada()

    setCompanyProfile(empresa)

    if (dadosSalvos?.startDate) {
      setStartDate(dadosSalvos.startDate)
    }

    if (dadosSalvos?.goalKg) {
      setGoalKg(dadosSalvos.goalKg)
    }

    if (dadosSalvos?.hasDigital) {
      setHasDigital(dadosSalvos.hasDigital)
    }

    if (dadosSalvos?.digitalPercent) {
      setDigitalPercent(dadosSalvos.digitalPercent)
    }

    if (dadosSalvos?.dailyPhysicalUses) {
      setDailyPhysicalUses(dadosSalvos.dailyPhysicalUses)
    }

    if (dadosSalvos?.dailyDigitalUses) {
      setDailyDigitalUses(dadosSalvos.dailyDigitalUses)
    }

    if (!dadosSalvos?.onboardingCompleted) {
      setShowOnboarding(true)
    }

    if (dadosSalvos?.startDate && dadosSalvos?.hasDigital === 'yes') {
      calcularImpacto({ startDate: dadosSalvos.startDate })
    }

    setDadosCarregados(true)
  }, [])

  useEffect(() => {
    if (!dadosCarregados || !startDate || !goalKg || !hasDigital) return

    salvarDados({
      startDate,
      goalKg,
      hasDigital,
      digitalPercent,
      dailyPhysicalUses,
      dailyDigitalUses,
      onboardingCompleted: true,
    })
  }, [dailyDigitalUses, dailyPhysicalUses, dadosCarregados, digitalPercent, goalKg, hasDigital, startDate])

  useEffect(() => {
    if (!hasDigital) return

    const effectiveMetaKg = metaKg > 0 ? metaKg : 1000

    saveOperationalMetrics('timeline', {
      co2EvitadoKg: totalKg,
      metaKg: effectiveMetaKg,
      progressoMetaPercent: Math.min(100, (totalKg / effectiveMetaKg) * 100),
      diasAtivos: days,
      mediaMensalKg: mediaMensal,
      updatedAt: new Date().toISOString(),
    })
  }, [days, hasDigital, mediaMensal, metaKg, totalKg])

  return (
    <div className="relative w-full space-y-8 pb-16 font-sans text-black">
      {showOnboarding && (
        <div className="absolute inset-0 z-40 flex min-h-[calc(100vh-220px)] items-start justify-center bg-black/30 p-4 pt-8 backdrop-blur-sm">
          <form onSubmit={salvarOnboarding} className="w-full max-w-3xl rounded-[2rem] border border-[#ffe1de] bg-white p-7 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff2b1d]">Configuração da jornada</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight">Uso digital da empresa</h2>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-slate-500">
                  Responda uma vez para a linha do tempo estimar o impacto real da adoção digital. Campos de uso diário com 0 serão estimados pela quantidade de funcionários e cartões/tickets cadastrados.
                </p>
              </div>
              {hasDigital && (
                <button type="button" onClick={() => setShowOnboarding(false)} className="text-slate-400 transition-colors hover:text-[#ff2b1d]">
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setHasDigital('yes')}
                className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 ${
                  hasDigital === 'yes' ? 'border-[#ff2b1d] bg-[#ff2b1d] text-white shadow-lg shadow-[#ff2b1d]/20' : 'border-[#ffe1de] bg-[#fff7f7] text-black'
                }`}
              >
                <strong className="block text-lg font-black">Sim, já utiliza digital</strong>
                <span className={`mt-2 block text-sm font-semibold ${hasDigital === 'yes' ? 'text-white/80' : 'text-slate-500'}`}>
                  A plataforma calculará o impacto acumulado desde o início do uso.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHasDigital('no')
                  setDigitalPercent('0')
                  setDailyDigitalUses('0')
                  setStartDate(hojeISO())
                  limpar()
                }}
                className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 ${
                  hasDigital === 'no' ? 'border-[#ff2b1d] bg-[#ff2b1d] text-white shadow-lg shadow-[#ff2b1d]/20' : 'border-[#ffe1de] bg-[#fff7f7] text-black'
                }`}
              >
                <strong className="block text-lg font-black">Não utiliza ainda</strong>
                <span className={`mt-2 block text-sm font-semibold ${hasDigital === 'no' ? 'text-white/80' : 'text-slate-500'}`}>
                  A plataforma registrará uma meta de início para acompanhar a transição.
                </span>
              </button>
            </div>

            {hasDigital && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                      {hasDigital === 'yes' ? 'Data de início do uso digital' : 'Meta de início do uso digital'}
                    </span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      min={hasDigital === 'yes' ? CONFIGURACOES_FORMULARIO.DATA_ADESAO.MIN_DATE : hojeISO()}
                      max={hasDigital === 'yes' ? hojeISO() : undefined}
                      className="h-12 w-full rounded-2xl border border-[#ffb4ae] bg-[#fff7f7] px-4 text-sm font-semibold outline-none focus:border-[#ff2b1d] focus:ring-2 focus:ring-[#ff2b1d]/20"
                      required
                    />
                  </label>

                  {hasDigital === 'yes' && (
                    <label>
                      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">% dos funcionários no digital</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={digitalPercent}
                        onChange={(event) => setDigitalPercent(event.target.value)}
                        placeholder="Ex: 65"
                        className="h-12 w-full rounded-2xl border border-[#ffb4ae] bg-[#fff7f7] px-4 text-sm font-semibold outline-none focus:border-[#ff2b1d] focus:ring-2 focus:ring-[#ff2b1d]/20"
                        required
                      />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Usos diários médios em cartões físicos</span>
                    <input
                      type="number"
                      min={0}
                      value={dailyPhysicalUses}
                      onChange={(event) => setDailyPhysicalUses(event.target.value)}
                      placeholder={`0 para estimar (${estimatedUses.physical.toLocaleString('pt-BR')})`}
                      className="h-12 w-full rounded-2xl border border-[#ffb4ae] bg-[#fff7f7] px-4 text-sm font-semibold outline-none focus:border-[#ff2b1d] focus:ring-2 focus:ring-[#ff2b1d]/20"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">Usos diários médios em cartões digitais</span>
                    <input
                      type="number"
                      min={0}
                      value={dailyDigitalUses}
                      onChange={(event) => setDailyDigitalUses(event.target.value)}
                      placeholder={`0 para estimar (${estimatedUses.digital.toLocaleString('pt-BR')})`}
                      disabled={hasDigital === 'no'}
                      className="h-12 w-full rounded-2xl border border-[#ffb4ae] bg-[#fff7f7] px-4 text-sm font-semibold outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-[#ff2b1d] focus:ring-2 focus:ring-[#ff2b1d]/20"
                    />
                  </label>
                </div>

                <div className="rounded-2xl border border-[#ffe1de] bg-[#fff7f7] p-4 text-sm font-semibold text-slate-600">
                  Estimativa atual: {effectiveDailyPhysicalUses.toLocaleString('pt-BR')} usos físicos/dia e {effectiveDailyDigitalUses.toLocaleString('pt-BR')} usos digitais/dia.
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff2b1d] px-6 text-sm font-black text-white transition-all hover:bg-[#e51f13]"
                >
                  Salvar jornada digital <ArrowRight size={16} />
                </button>
              </div>
            )}
          </form>
        </div>
      )}

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
              <button
                type="button"
                onClick={() => setShowOnboarding(true)}
                className="mt-4 rounded-full border border-[#ffb4ae] bg-[#fff7f7] px-4 py-2 text-xs font-black text-[#ff2b1d] transition-all hover:bg-[#ffe5e5]"
              >
                Editar jornada digital
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(190px,240px)_minmax(260px,1fr)_auto] md:items-end">
            <label>
              <span className="mb-2 block text-xs font-black text-slate-500">
                {hasDigitalUsage ? CONFIGURACOES_FORMULARIO.DATA_ADESAO.LABEL : 'Meta de início do digital'}
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                min={hasDigitalUsage ? CONFIGURACOES_FORMULARIO.DATA_ADESAO.MIN_DATE : hojeISO()}
                max={hasDigitalUsage ? hojeISO() : undefined}
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
              {loading ? 'Calculando...' : hasDigitalUsage ? 'Ver impacto' : 'Salvar meta'}
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
            {hasDigitalUsage && impactData
              ? `Desde ${formatarDataLocal(startDate)}, a operação digital evitou aproximadamente ${totalKg.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg de CO₂ considerando ${effectiveDailyDigitalUses.toLocaleString('pt-BR')} usos digitais por dia.`
              : hasDigital === 'no'
                ? `A empresa ainda não usa cartão/ticket digital. A meta de início está registrada para ${formatarDataLocal(startDate)}.`
                : 'Configure a jornada digital da empresa para calcular o impacto acumulado.'}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <MetricCard icon={<Clock3 size={24} />} label="Tempo ativo" value={`${days.toLocaleString('pt-BR')} dias`} />
        <MetricCard icon={<Leaf size={24} />} label="Média mensal" value={`${mediaMensal.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg`} />
        <MetricCard icon={<Target size={24} />} label="Meta definida" value={userGoal} />
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <MetricCard icon={<History size={24} />} label="Usos físicos/dia" value={effectiveDailyPhysicalUses.toLocaleString('pt-BR')} />
        <MetricCard icon={<Leaf size={24} />} label="Usos digitais/dia" value={effectiveDailyDigitalUses.toLocaleString('pt-BR')} />
        <MetricCard icon={<Target size={24} />} label="Adoção digital" value={hasDigitalUsage ? `${Number(digitalPercent || 0).toLocaleString('pt-BR')}%` : '0%'} />
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
