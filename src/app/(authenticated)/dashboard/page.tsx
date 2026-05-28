'use client'

import { useMemo, useState } from 'react'
import { BarChart3, ChevronDown, Edit2, Save, X } from 'lucide-react'
import { useUser } from '@/context/UserContext'

const produtosEmpresa = ['Taggy', 'Ticket Log', 'Repom', 'Pagbem']

type OperationalMetrics = {
  co2EvitadoKg?: number
  materiaPrimaReduzidaKg?: number
  transacoesCompensadas?: number
}

function clamp(valor: number, min: number, max: number) {
  return Math.min(max, Math.max(min, valor))
}

function lerMetricasSalvas(): OperationalMetrics {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(localStorage.getItem('card0OperationalMetrics') || '{}')
  } catch {
    return {}
  }
}

export default function Dashboard() {
  const { profile, updateProfile } = useUser()
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({ ...profile })

  const abrirEdicao = () => {
    setFormData({ ...profile })
    setEditando(true)
  }

  const salvarEdicao = () => {
    updateProfile(formData)
    setEditando(false)
  }

  const nomeConta = profile.name?.trim() || 'Conta'
  const primeiroNome = nomeConta.split(' ')[0]

  const metricas = useMemo(() => {
    const salvas = lerMetricasSalvas()
    const camposPreenchidos = [
      profile.name,
      profile.email,
      profile.empresa,
      profile.dataNascimento,
      profile.localizacao,
    ].filter((campo) => campo && campo !== 'Não informado').length
    const completude = camposPreenchidos / 5

    const co2EvitadoKg =
      salvas.co2EvitadoKg ?? Number((completude * 28 + produtosEmpresa.length * 4.5).toFixed(1))
    const materiaPrimaReduzidaKg =
      salvas.materiaPrimaReduzidaKg ?? Number((completude * 5.5 + produtosEmpresa.length * 0.9).toFixed(1))
    const transacoesCompensadas =
      salvas.transacoesCompensadas ?? Math.round(completude * produtosEmpresa.length * 560)

    const score = clamp(
      Math.round(
        25 +
          Math.min(co2EvitadoKg * 0.55, 30) +
          Math.min(materiaPrimaReduzidaKg * 2.4, 20) +
          Math.min(transacoesCompensadas / 140, 25)
      ),
      0,
      100
    )

    return {
      co2EvitadoKg,
      materiaPrimaReduzidaKg,
      transacoesCompensadas,
      score,
      custo: clamp(Math.round(45 + score * 0.45), 0, 100),
      impacto: clamp(Math.round(100 - score * 0.74), 0, 100),
      metaAnualKg: Number((Math.max(2, co2EvitadoKg * 0.08)).toFixed(1)),
    }
  }, [profile])

  const gaugeLength = 236
  const gaugeOffset = gaugeLength - (gaugeLength * metricas.score) / 100
  const gaugeAngle = Math.PI - (metricas.score / 100) * Math.PI
  const knobX = 110 + 75 * Math.cos(gaugeAngle)
  const knobY = 115 - 75 * Math.sin(gaugeAngle)

  return (
    <div className="w-full space-y-8 pb-16 font-sans">
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-brand-border bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight text-[#f72717]">Editar Perfil</h2>
              <button onClick={() => setEditando(false)} className="text-slate-400 transition-colors hover:text-[#f72717]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Nome Completo', key: 'name', type: 'text' },
                { label: 'E-mail', key: 'email', type: 'email' },
                { label: 'Empresa', key: 'empresa', type: 'text' },
                { label: 'Data de Nascimento', key: 'dataNascimento', type: 'text', placeholder: 'dd/mm/aaaa' },
                { label: 'Localização', key: 'localizacao', type: 'text' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className="space-y-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
                  <input
                    type={type}
                    value={formData[key as keyof typeof formData]}
                    placeholder={placeholder}
                    onChange={(event) => setFormData({ ...formData, [key]: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-brand-text outline-none transition-all focus:border-[#f72717] focus:ring-2 focus:ring-[#f72717]/25"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditando(false)}
                className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-xs font-black uppercase tracking-wider text-slate-500 transition-all hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicao}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f72717] py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#df1e12]"
              >
                <Save size={14} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="pt-2 text-2xl font-black tracking-tight text-brand-text md:text-3xl">
        Olá, {primeiroNome}.
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="relative flex min-h-[280px] flex-col items-center gap-8 rounded-[2rem] border border-[#ffe1de] bg-white p-8 shadow-sm md:flex-row lg:col-span-7">
          <button
            onClick={abrirEdicao}
            className="absolute right-6 top-6 text-slate-400 transition-colors hover:text-[#f72717]"
            title="Editar perfil"
          >
            <Edit2 size={18} />
          </button>

          <div className="shrink-0">
            <svg className="h-40 w-40 text-[#f72717]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="6" fill="white" />
              <circle cx="50" cy="40" r="16" fill="currentColor" />
              <path d="M18 78C18 64.7452 28.7452 54 42 54H58C71.2548 54 82 64.7452 82 78V82H18V78Z" fill="currentColor" />
            </svg>
          </div>

          <div className="w-full space-y-4 text-left">
            <h2 className="text-2xl font-black tracking-tight text-brand-text">{profile.name}</h2>
            <div className="space-y-3 text-xs font-semibold md:text-sm">
              <ProfileLine label="Empresa:" value={profile.empresa} />
              <ProfileLine label="Data de Nasc.:" value={profile.dataNascimento} />
              <ProfileLine label="Local:" value={profile.localizacao} />
              <ProfileLine label="Email:" value={profile.email} strong />
            </div>
          </div>
        </section>

        <section className="flex min-h-[280px] flex-col justify-center rounded-[2rem] border border-[#ffe1de] bg-white p-8 shadow-sm lg:col-span-5">
          <h3 className="mb-5 text-sm font-black tracking-tight text-brand-text">Meus Cartões Ticket:</h3>
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Produtos ativos da empresa</p>

          <div className="grid grid-cols-2 gap-3">
            {produtosEmpresa.map((produto) => (
              <div
                key={produto}
                className="flex h-16 items-center justify-center rounded-xl border border-[#ffb4ae] bg-[#fff7f7] px-3 text-center shadow-sm transition-all hover:border-[#f72717]"
              >
                <span className="text-sm font-black italic tracking-tight text-[#f72717]">{produto}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="min-h-[360px] rounded-[2rem] border border-[#ffe1de] bg-white p-6 shadow-sm lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-black tracking-tight text-brand-text">Painel de custo/impacto</h3>
            <button className="flex items-center gap-1 rounded-lg border border-[#ffb4ae] bg-[#fff7f7] px-3 py-1 text-[10px] font-semibold text-brand-text transition-all hover:bg-[#ffe5e5]">
              Ver histórico <ChevronDown size={12} />
            </button>
          </div>

          <div className="border-t border-slate-300 pt-3">
            <div className="grid h-40 grid-cols-2 items-end gap-8 px-6">
              <MetricBar label={`${metricas.custo}%`} value={metricas.custo} />
              <MetricBar label={`${metricas.impacto}%`} value={metricas.impacto} />
            </div>

            <div className="mt-5 grid grid-cols-2 border-t border-slate-300 pt-5">
              <MetricIcon label="Custo" icon="money" />
              <MetricIcon label="Impacto" icon="chart" bordered />
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] font-semibold text-slate-500">
            Sua meta estimada para este ano é de até {metricas.metaAnualKg.toLocaleString('pt-BR')} kg CO₂
          </p>
        </section>

        <section className="flex min-h-[360px] flex-col rounded-[2rem] border border-[#ffe1de] bg-white p-7 shadow-sm lg:col-span-7">
          <h3 className="text-xs font-black tracking-tight text-brand-text">Score de Sustentabilidade Operacional</h3>

          <div className="relative flex flex-1 items-center justify-center">
            <svg className="h-[230px] w-[320px]" viewBox="0 0 220 145" aria-hidden="true">
              <path
                d="M 35 115 A 75 75 0 0 1 185 115"
                fill="none"
                stroke="#ffb4ae"
                strokeLinecap="round"
                strokeWidth="22"
              />
              <path
                d="M 35 115 A 75 75 0 0 1 185 115"
                fill="none"
                stroke="#f72717"
                strokeDasharray={gaugeLength}
                strokeDashoffset={gaugeOffset}
                strokeLinecap="round"
                strokeWidth="22"
              />
              <circle cx={knobX} cy={knobY} r="16" fill="#ff7770" />
            </svg>

            <div className="absolute translate-y-8 flex flex-col items-center text-center">
              <span className="text-2xl font-black leading-tight text-[#f72717]">Eficiência</span>
              <span className="text-3xl font-black leading-none text-black">{metricas.score}%</span>
            </div>
          </div>

          <p className="mx-auto max-w-md text-center text-[10px] font-semibold leading-relaxed text-slate-500">
            O score considera {metricas.co2EvitadoKg.toLocaleString('pt-BR')} kg CO₂ evitados,
            {' '}{metricas.materiaPrimaReduzidaKg.toLocaleString('pt-BR')} kg de matéria-prima reduzida e
            {' '}{metricas.transacoesCompensadas.toLocaleString('pt-BR')} transações compensadas.
          </p>
        </section>
      </div>
    </div>
  )
}

function ProfileLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="min-w-[112px] font-bold text-slate-400">{label}</span>
      <span className={`text-brand-text ${strong ? 'font-bold' : ''}`}>{value}</span>
    </div>
  )
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-end">
      <div className="flex h-32 w-16 flex-col justify-end overflow-hidden rounded-xl bg-[#ffb4ae]">
        <div
          className="flex w-full items-center justify-center rounded-t-xl bg-[#f72717] text-[10px] font-semibold text-white"
          style={{ height: `${value}%` }}
        >
          {label}
        </div>
      </div>
    </div>
  )
}

function MetricIcon({ label, icon, bordered = false }: { label: string; icon: 'money' | 'chart'; bordered?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${bordered ? 'border-l border-slate-300' : ''}`}>
      <div className="text-[#f72717]">
        {icon === 'money' ? (
          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <BarChart3 size={40} strokeWidth={2.5} />
        )}
      </div>
      <span className="text-[10px] font-semibold text-brand-text">{label}</span>
    </div>
  )
}
