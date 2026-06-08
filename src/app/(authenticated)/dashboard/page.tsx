'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BarChart3, ChevronDown, Edit2, Save, X } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { dashboardNavigation } from '@/config/navigation'
import {
  calculateCostImpactPanel,
  calculateOperationalScore,
  readOperationalMetrics,
  type OperationalMetricsStore,
} from '@/lib/operationalMetrics'

const produtosEmpresa = ['Taggy', 'Ticket Log', 'Repom', 'Pagbem']
const produtoDetalhes: Record<string, { status: string; emissao: string; transacoes: string }> = {
  Taggy: { status: 'Ativo para frotas leves', emissao: '12 cartões digitais', transacoes: '1.240 transações/mês' },
  'Ticket Log': { status: 'Operação logística', emissao: '38 cartões digitais', transacoes: '3.890 transações/mês' },
  Repom: { status: 'Gestão de transporte', emissao: '24 cartões digitais', transacoes: '2.160 transações/mês' },
  Pagbem: { status: 'Pagamentos corporativos', emissao: '18 cartões digitais', transacoes: '1.780 transações/mês' },
}

export default function Dashboard() {
  const { profile, updateProfile } = useUser()
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({ ...profile })
  const [produtoSelecionado, setProdutoSelecionado] = useState(produtosEmpresa[0])
  const [historicoAberto, setHistoricoAberto] = useState(false)
  const [metricaAtiva, setMetricaAtiva] = useState<'custo' | 'impacto'>('custo')
  const [operationalMetrics, setOperationalMetrics] = useState<OperationalMetricsStore>({})

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

  useEffect(() => {
    const syncMetrics = () => setOperationalMetrics(readOperationalMetrics())

    syncMetrics()
    window.addEventListener('storage', syncMetrics)
    window.addEventListener('focus', syncMetrics)

    return () => {
      window.removeEventListener('storage', syncMetrics)
      window.removeEventListener('focus', syncMetrics)
    }
  }, [])

  const metricas = useMemo(() => {
    const score = calculateOperationalScore(operationalMetrics)
    return score
  }, [operationalMetrics])
  const painelCustoImpacto = useMemo(
    () => calculateCostImpactPanel(operationalMetrics),
    [operationalMetrics]
  )

  const gaugeLength = 236
  const gaugeOffset = gaugeLength - (gaugeLength * metricas.score) / 100
  const gaugeAngle = Math.PI - (metricas.score / 100) * Math.PI
  const knobX = 110 + 75 * Math.cos(gaugeAngle)
  const knobY = 115 - 75 * Math.sin(gaugeAngle)
  const detalheProduto = produtoDetalhes[produtoSelecionado]
  const painelDetalhes = painelCustoImpacto.detalhe
    .map((item) => ({
      label: item.label,
      valor: metricaAtiva === 'custo' ? item.custo : item.impacto,
    }))
    .filter((item): item is { label: string; valor: number } => typeof item.valor === 'number')

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
            <svg className="h-40 w-40 text-black" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <button
                type="button"
                key={produto}
                onClick={() => setProdutoSelecionado(produto)}
                className={`flex h-16 items-center justify-center rounded-xl border px-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f72717] ${
                  produtoSelecionado === produto ? 'border-[#f72717] bg-[#ff2b1d] text-white' : 'border-[#ffb4ae] bg-[#fff7f7]'
                }`}
              >
                <span className={`text-sm font-black italic tracking-tight ${produtoSelecionado === produto ? 'text-white' : 'text-[#f72717]'}`}>{produto}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-[#ffe1de] bg-[#fff7f7] p-4">
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm font-black text-brand-text">{produtoSelecionado}</strong>
              <span className="rounded-full bg-[#ff2b1d] px-3 py-1 text-[9px] font-black uppercase tracking-wide text-white">Selecionado</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500">{detalheProduto.status}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[10px] font-bold text-brand-text">
              <span className="rounded-xl bg-white px-3 py-2">{detalheProduto.emissao}</span>
              <span className="rounded-xl bg-white px-3 py-2">{detalheProduto.transacoes}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="min-h-[360px] rounded-[2rem] border border-[#ffe1de] bg-white p-6 shadow-sm lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-black tracking-tight text-brand-text">Painel de custo/impacto</h3>
            <button
              type="button"
              onClick={() => setHistoricoAberto((current) => !current)}
              className="flex items-center gap-1 rounded-lg border border-[#ffb4ae] bg-[#fff7f7] px-3 py-1 text-[10px] font-semibold text-brand-text transition-all hover:bg-[#ffe5e5]"
            >
              {historicoAberto ? 'Ocultar histórico' : 'Ver histórico'} <ChevronDown className={historicoAberto ? 'rotate-180 transition-transform' : 'transition-transform'} size={12} />
            </button>
          </div>

          <div className="border-t border-slate-300 pt-3">
            <div className="grid h-40 grid-cols-2 items-end gap-8 px-6">
              <MetricBar label={`${painelCustoImpacto.custo}%`} value={painelCustoImpacto.custo} />
              <MetricBar label={`${painelCustoImpacto.impacto}%`} value={painelCustoImpacto.impacto} />
            </div>

            <div className="mt-5 grid grid-cols-2 border-t border-slate-300 pt-5">
              <MetricIcon label="Custo" icon="money" active={metricaAtiva === 'custo'} onClick={() => setMetricaAtiva('custo')} />
              <MetricIcon label="Impacto" icon="chart" bordered active={metricaAtiva === 'impacto'} onClick={() => setMetricaAtiva('impacto')} />
            </div>
          </div>

          {historicoAberto && (
            <div className="mt-5 rounded-2xl border border-[#ffe1de] bg-[#fff7f7] p-4">
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-xs font-black text-brand-text">
                  Histórico de {metricaAtiva === 'custo' ? 'custo' : 'impacto'}
                </strong>
                <span className="text-[10px] font-bold text-[#f72717]">
                  {metricaAtiva === 'custo' ? `${painelCustoImpacto.custo}%` : `${painelCustoImpacto.impacto}%`}
                </span>
              </div>
              {painelDetalhes.length > 0 ? (
                <div className="space-y-2">
                  {painelDetalhes.map((item) => (
                    <div key={`${metricaAtiva}-${item.label}`} className="grid grid-cols-[92px_1fr_38px] items-center gap-3 text-[10px] font-bold">
                      <span>{item.label}</span>
                      <div className="h-2 overflow-hidden rounded-full bg-[#ffddd9]">
                        <div className="h-full rounded-full bg-[#f72717]" style={{ width: `${item.valor}%` }} />
                      </div>
                      <span className="text-right">{item.valor}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] font-semibold text-slate-500">
                  Use {metricaAtiva === 'custo' ? 'Impacto Financeiro ou Risco Operacional' : 'Operação e Execução, Linha do Tempo ou Risco Operacional'} para alimentar este indicador.
                </p>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-[10px] font-semibold text-slate-500">
            Painel alimentado por {painelCustoImpacto.fontesAtivas} ferramenta{painelCustoImpacto.fontesAtivas === 1 ? '' : 's'} usada{painelCustoImpacto.fontesAtivas === 1 ? '' : 's'} na plataforma.
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
            {' '}{metricas.transacoesCompensadas.toLocaleString('pt-BR')} operações compensadas a partir de {metricas.fontesAtivas} ferramenta{metricas.fontesAtivas === 1 ? '' : 's'}.
          </p>
        </section>
      </div>

      <section className="rounded-[2rem] border border-[#ffe1de] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black tracking-tight text-brand-text">
              Atalhos do dashboard
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Navegue entre as rotas principais sem perder o contexto da conta.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboardNavigation
            .filter((item) => item.href !== '/dashboard')
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:border-[#f72717]/40 hover:bg-white hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-[#fff1ef] p-3 text-[#f72717] transition-colors group-hover:bg-[#f72717] group-hover:text-white">
                  <item.icon size={18} />
                </div>
                <h4 className="text-sm font-black text-brand-text">{item.label}</h4>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </Link>
            ))}
        </div>
      </section>
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

function MetricIcon({
  label,
  icon,
  bordered = false,
  active = false,
  onClick,
}: {
  label: string
  icon: 'money' | 'chart'
  bordered?: boolean
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl py-2 transition-all hover:bg-[#fff1ef] ${
        bordered ? 'border-l border-slate-300' : ''
      } ${active ? 'bg-[#fff1ef]' : ''}`}
    >
      <div className={active ? 'text-[#f72717]' : 'text-[#f72717]/70'}>
        {icon === 'money' ? (
          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <BarChart3 size={40} strokeWidth={2.5} />
        )}
      </div>
      <span className={`text-[10px] font-semibold ${active ? 'text-[#f72717]' : 'text-brand-text'}`}>{label}</span>
    </button>
  )
}
