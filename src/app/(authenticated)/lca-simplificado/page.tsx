'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ChevronDown,
  CreditCard,
  Factory,
  MapPin,
  Recycle,
  Search,
  Trash2,
  Truck,
} from 'lucide-react'

type FaseKey = 'producao' | 'transporte' | 'uso' | 'descarte'

const RED = '#ff2b1d'
const ROSE = '#ff7770'
const LIGHT = '#ffb4ae'
const PALE = '#ffe5e5'

const matrizEnergetica = {
  br: { label: 'Brasil', mult: 1 },
  ue: { label: 'União Europeia', mult: 2.2 },
  usa: { label: 'Estados Unidos', mult: 2.8 },
}

const co2Base = {
  producao: 0.072,
  transporte: 0.031,
  uso: 0.048,
  descarte: 0.021,
}

function formatKg(value: number) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
}

function formatTon(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function LcaSimplificadoPage() {
  const [quantidade, setQuantidade] = useState(13600)
  const [matriz, setMatriz] = useState<keyof typeof matrizEnergetica>('br')
  const [taxaReciclagem, setTaxaReciclagem] = useState(60)
  const [cartoesDescarte, setCartoesDescarte] = useState(5000)
  const [faseDetalhe, setFaseDetalhe] = useState<FaseKey | null>('producao')
  const [localColeta, setLocalColeta] = useState('Recife, PE')
  const [buscaRealizada, setBuscaRealizada] = useState(false)
  const [projetoOffset, setProjetoOffset] = useState<'amazonia' | 'eolico'>('amazonia')
  const [compensacaoStatus, setCompensacaoStatus] = useState('')

  const lca = useMemo(() => {
    const multMatriz = matrizEnergetica[matriz].mult

    const prodFisKg = quantidade * co2Base.producao
    const transFisKg = quantidade * co2Base.transporte * multMatriz
    const usoFisKg = quantidade * co2Base.uso * multMatriz
    const descFisKg = quantidade * co2Base.descarte
    const totalFisKg = prodFisKg + transFisKg + usoFisKg + descFisKg

    const prodDigKg = prodFisKg * 0.22
    const transDigKg = transFisKg * 0.17
    const usoDigKg = usoFisKg * 0.48
    const descDigKg = descFisKg * 0.18
    const totalDigKg = prodDigKg + transDigKg + usoDigKg + descDigKg
    const carbonoCompensacaoKg = (quantidade / 13600) * 40 * multMatriz

    return {
      fases: {
        producao: { fisico: prodFisKg / 1000, digital: prodDigKg / 1000, percentual: 42 },
        transporte: { fisico: transFisKg / 1000, digital: transDigKg / 1000, percentual: 18 },
        uso: { fisico: usoFisKg / 1000, digital: usoDigKg / 1000, percentual: 28 },
        descarte: { fisico: descFisKg / 1000, digital: descDigKg / 1000, percentual: 12 },
      },
      totalFisKg,
      totalDigKg,
      totalFisTon: totalFisKg / 1000,
      totalDigTon: totalDigKg / 1000,
      carbonoCompensacaoKg,
      reducaoPercentual: Math.round((1 - totalDigKg / totalFisKg) * 100),
      arvores: Math.max(1, Math.round(carbonoCompensacaoKg / 15.6)),
    }
  }, [quantidade, matriz])

  const logistica = useMemo(() => {
    const impactoBruto = cartoesDescarte * co2Base.descarte
    const impactoReciclado = impactoBruto * (1 - taxaReciclagem / 100) * 0.9
    return {
      pvcRecuperado: cartoesDescarte * (taxaReciclagem / 100) * 0.0083,
      co2Evitado: Math.max(0, impactoBruto - impactoReciclado),
      metaisNobres: cartoesDescarte * (taxaReciclagem / 100) * 0.00017,
      impactoBruto,
      impactoReciclado,
    }
  }, [cartoesDescarte, taxaReciclagem])

  const fases: Array<{
    key: FaseKey
    titulo: string
    icon: ReactNode
    color: string
    details: string[]
  }> = [
    {
      key: 'producao',
      titulo: 'Produção',
      icon: <Factory size={16} />,
      color: RED,
      details: ['PVC/plástico - 32%', 'Chip NFC/EMV - 18%', 'Antena metálica - 9%', 'Impressão - 7%', 'Embalagem - 6%'],
    },
    { key: 'transporte', titulo: 'Transporte', icon: <Truck size={16} />, color: ROSE, details: [] },
    { key: 'uso', titulo: 'Uso', icon: <CreditCard size={16} />, color: LIGHT, details: [] },
    { key: 'descarte', titulo: 'Descarte', icon: <Trash2 size={16} />, color: PALE, details: [] },
  ]

  const donutStops = `#ff2b1d 0 42%, #ff7770 42% 60%, #ffb4ae 60% 88%, #ffe5e5 88% 100%`
  const maxFase = Math.max(...fases.map((fase) => lca.fases[fase.key].fisico))
  const maxImpactoLogistica = 20000 * co2Base.descarte

  return (
    <div className="w-full space-y-8 pb-16 font-sans text-[#111111]">
      <section>
        <h1 className="text-3xl font-black tracking-tight">Operação e execução</h1>
        <p className="mt-1 max-w-xl text-sm font-medium leading-relaxed text-[#252525]">
          Gerencie o ciclo de vida dos seus cartões físicos através do descarte consciente e compensação de carbono.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
        <section className="rounded-xl bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.16)] lg:col-span-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_180px]">
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-sm font-black">Quantidade de cartões</h2>
                <strong className="text-xl font-black">{quantidade.toLocaleString('pt-BR')}</strong>
              </div>
              <input
                type="range"
                min={100}
                max={100000}
                step={100}
                value={quantidade}
                onChange={(event) => setQuantidade(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#ffb4ae] accent-[#ff2b1d]"
              />
              <div className="mt-2 flex justify-between text-xs font-semibold text-[#252525]">
                <span>100</span>
                <span>100.000</span>
              </div>
            </div>

            <label className="block">
              <span className="mb-3 block text-sm font-black">Matriz energética</span>
              <span className="relative block">
                <select
                  value={matriz}
                  onChange={(event) => setMatriz(event.target.value as keyof typeof matrizEnergetica)}
                  className="h-12 w-full appearance-none rounded-2xl bg-[#ff2b1d] px-4 pr-10 text-sm font-bold text-white outline-none"
                >
                  {Object.entries(matrizEnergetica).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white" size={16} />
              </span>
            </label>
          </div>
        </section>

        <section className="relative min-h-[190px] overflow-hidden rounded-xl bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.16)] lg:col-span-6">
          <h2 className="text-sm font-black">Carbono gerado</h2>
          <div data-testid="carbono-gerado-valor" className="mt-8 text-5xl font-black tracking-tight">{formatKg(lca.carbonoCompensacaoKg)}kg</div>
          <p className="mt-2 max-w-[250px] text-[11px] font-medium leading-snug">
            de CO₂ são gerados durante o ciclo dos vida dos cartões físicos.
          </p>
          <p data-testid="processo-fisico-diferenca" className="absolute bottom-3 left-6 max-w-[260px] text-[9px] font-semibold text-[#555]">
            ↑ O processo físico gera {(lca.carbonoCompensacaoKg * lca.reducaoPercentual / 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg de CO₂ a mais que o digital
          </p>
          <TreeGraphic arvores={lca.arvores} carbonoKg={lca.carbonoCompensacaoKg} />
        </section>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
        <h2 className="text-lg font-black">Inteligência de Ciclo de Vida (LCA) simplificado</h2>
        <p className="text-xs font-medium text-[#555]">Impacto ambiental por fase de ciclo de vida do cartão físico.</p>

        <div className="mt-5 grid grid-cols-1 items-center gap-5 lg:grid-cols-[280px_1fr]">
          <div className="flex justify-center">
            <div
              className="grid h-56 w-56 place-items-center rounded-full"
              style={{ background: `conic-gradient(${donutStops})` }}
            >
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center">
                <span className="text-lg font-black">{formatTon(lca.totalFisTon)} tCO₂e</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {fases.map((fase, index) => {
              const faseData = lca.fases[fase.key]
              const isActive = faseDetalhe === fase.key
              return (
                <article
                  key={fase.key}
                  onClick={() => setFaseDetalhe(fase.key)}
                  className={`min-h-[180px] rounded-2xl p-4 ${
                    isActive ? 'bg-[#ff2b1d] text-white' : 'text-black'
                  } cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg`}
                  style={{ backgroundColor: isActive ? RED : fase.color }}
                >
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold">
                    {fase.icon}
                    <span>{fase.titulo}</span>
                  </div>

                  {isActive ? (
                    <div className="space-y-1 text-[10px] font-medium">
                      {fase.details.map((detail) => (
                        <p key={detail}>{detail}</p>
                      ))}
                      <p className="pt-2 text-center font-black">Total estimado:<br />{formatTon(faseData.fisico)} tCO₂e</p>
                      <p className="text-center text-[9px]">42% do ciclo de vida total</p>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setFaseDetalhe(null)
                        }}
                        className="mx-auto mt-1 block rounded-full border border-white/80 px-7 py-1 text-[9px] font-bold transition-all hover:bg-white hover:text-[#ff2b1d]"
                      >
                        Voltar
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-[115px] flex-col items-center justify-center text-center">
                      <strong className="text-3xl font-black">{faseData.percentual}%</strong>
                      <span className="mt-2 text-xs font-medium">{formatTon(faseData.fisico)}tCO₂e</span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setFaseDetalhe(fase.key)
                        }}
                        className="mt-6 rounded-full border border-black px-5 py-1 text-[9px] font-semibold transition-all hover:bg-black hover:text-white"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
        <h2 className="text-lg font-black">Comparar impacto físico vs. digital por fase</h2>
        <p className="text-xs font-medium text-[#555]">Valores em tCO₂e</p>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_170px]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {fases.map((fase) => {
              const fisico = lca.fases[fase.key].fisico
              const digital = lca.fases[fase.key].digital
              const reducao = Math.round((1 - digital / fisico) * 100)

              return (
                <article key={fase.key} className="border-r border-[#ddd] pr-4 last:border-r-0">
                  <div className="mb-5 flex items-center gap-2 text-sm font-bold">
                    {fase.icon}
                    <span>{fase.titulo}</span>
                  </div>
                  <MiniBar label="Físico" value={fisico} max={maxFase} color={RED} />
                  <MiniBar label="Digital" value={digital} max={maxFase} color={LIGHT} />
                  <p className="mt-5 text-center text-sm font-semibold">↓ {reducao}% menor</p>
                </article>
              )
            })}
          </div>

          <aside data-testid="total-ciclo-vida" className="self-start rounded-2xl bg-[#ff2b1d] p-4 text-white lg:-mt-4">
            <h3 className="text-center text-sm font-black">Total do ciclo de vida</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Físico</span><strong>{formatTon(lca.totalFisTon)} tCO₂e</strong></div>
              <div className="flex justify-between"><span>Digital</span><strong>{formatTon(lca.totalDigTon)} tCO₂e</strong></div>
            </div>
            <div className="my-3 border-t border-white/70" />
            <p className="text-center text-lg font-black">↓{lca.reducaoPercentual}% menor</p>
          </aside>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
          <h2 className="text-lg font-black">Simulador de logística reversa</h2>
          <p className="text-xs font-medium text-[#555]">Simule o benefício de reciclagem de cartões físicos</p>

          <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-[1fr_150px]">
            <div className="space-y-7">
              <SliderControl
                icon={<Recycle size={17} />}
                label="Taxa de reciclagem"
                value={taxaReciclagem}
                suffix="%"
                min={0}
                max={100}
                step={1}
                onChange={setTaxaReciclagem}
              />
              <SliderControl
                icon={<CreditCard size={17} />}
                label="Quantidade de cartões"
                value={cartoesDescarte}
                min={1000}
                max={20000}
                step={100}
                onChange={setCartoesDescarte}
              />
            </div>

            <div className="flex items-end justify-center gap-5">
              <ImpactColumn testId="impacto-bruto-barra" value={logistica.impactoBruto} max={maxImpactoLogistica} label="Impacto bruto sem reciclagem" color={RED} />
              <ImpactColumn testId="impacto-reciclado-barra" value={logistica.impactoReciclado} max={maxImpactoLogistica} label="Impacto após reciclagem" color={LIGHT} />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-4">
            <MetricCard label="PVC recuperado" value={`${formatKg(logistica.pvcRecuperado)}kg`} />
            <MetricCard label="CO₂ evitado" value={`${formatKg(logistica.co2Evitado)}kg`} />
            <MetricCard label="Metais nobres" value={`${logistica.metaisNobres.toFixed(2)}g`} />
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
          <h2 className="text-lg font-black">Pontos de coleta para descarte seguro</h2>
          <p className="text-xs font-medium text-[#555]">Encontre locais próximos para descarte de cartões com chip</p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label className="flex h-11 flex-1 items-center gap-2 rounded-full border border-black px-4 text-xs font-medium">
              <MapPin size={15} />
              <input
                value={localColeta}
                onChange={(event) => setLocalColeta(event.target.value)}
                className="w-full bg-transparent outline-none"
                aria-label="Local para busca de ponto de coleta"
              />
            </label>
            <button
              type="button"
              onClick={() => setBuscaRealizada(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#ff2b1d] px-5 text-[10px] font-bold text-white transition-all hover:bg-[#e51f13]"
            >
              <Search size={13} />
              Buscar pontos de coleta
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_160px]">
            <div className="relative min-h-[230px] overflow-hidden rounded-xl bg-[#e8eef2]">
              <iframe
                title="Mapa real de pontos de coleta no Brasil"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-35.0200%2C-8.1800%2C-34.8200%2C-7.9800&layer=mapnik&marker=-8.0476%2C-34.8770"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
              />
            </div>

            <aside className="rounded-xl border border-black p-4 text-[10px]">
              <strong>{buscaRealizada ? '2 pontos encontrados' : '1 ponto encontrado'}</strong>
              <div className="mt-5 rounded-lg bg-white p-2 shadow-sm">
                <p className="font-black">Cooperativa De Trabalho Esperança Viva</p>
                <p className="mt-1 text-[#555]">R. Imperial, 748 - São José, Recife - PE</p>
              </div>
              {buscaRealizada && (
                <div className="mt-3 rounded-lg bg-white p-2 shadow-sm">
                  <p className="font-black">EcoPonto Empresarial {localColeta.split(',')[0] || 'Brasil'}</p>
                  <p className="mt-1 text-[#555]">Ponto credenciado para descarte seguro.</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => window.open('https://www.openstreetmap.org/search?query=' + encodeURIComponent(localColeta), '_blank', 'noopener,noreferrer')}
                className="mt-10 w-full rounded-lg border border-black py-3 text-[10px] font-bold transition-all hover:bg-black hover:text-white"
              >
                Ver todos no mapa
              </button>
            </aside>
          </div>
        </section>
      </div>

      <section className="rounded-xl bg-white p-8 shadow-[0_10px_24px_rgba(0,0,0,0.16)]">
        <h2 className="text-lg font-black">Compensação (Carbon Offset)</h2>
        <p className="max-w-md text-xs font-medium leading-relaxed text-[#555]">
          Para emissões que ainda não podem ser evitadas, oferecemos a opção de compensação direta. Seus investimentos são direcionados a projetos certificados.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="max-w-md space-y-6">
            <OffsetCard
              selected={projetoOffset === 'amazonia'}
              onClick={() => {
                setProjetoOffset('amazonia')
                setCompensacaoStatus('')
              }}
              title="Reflorestamento Amazônico"
              description="Proteção de áreas degradadas e plantio de espécies nativas."
              cost="R$ 15,00"
            />
            <OffsetCard
              selected={projetoOffset === 'eolico'}
              onClick={() => {
                setProjetoOffset('eolico')
                setCompensacaoStatus('')
              }}
              title="Parques Eólicos Nordeste"
              description="Geração de energia limpa substituindo fontes fósseis."
              cost="R$ 12,00"
            />
          </div>

          <div className="flex flex-col items-center justify-start pt-2 text-center lg:-mt-4 lg:pt-0">
            <span className="text-sm font-black">Total para compensar</span>
            <strong data-testid="total-compensar-valor" className="mt-1 text-5xl font-black">
              {lca.carbonoCompensacaoKg.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}kg
            </strong>
            <span className="mt-1 text-sm italic text-[#777]">CO₂ equivalente gerado</span>
            <button
              type="button"
              onClick={() => {
                const projeto = projetoOffset === 'amazonia' ? 'Reflorestamento Amazônico' : 'Parques Eólicos Nordeste'
                setCompensacaoStatus(`Compensação registrada no projeto ${projeto}.`)
              }}
              className="mt-6 rounded-2xl bg-[#ff2b1d] px-14 py-4 text-lg font-black text-white shadow-lg shadow-[#ff2b1d]/20 transition-all hover:bg-[#e51f13]"
            >
              Compensar agora
            </button>
            {compensacaoStatus && (
              <p className="mt-4 rounded-xl bg-[#ffe5e5] px-4 py-3 text-sm font-bold text-[#ff2b1d]">
                {compensacaoStatus}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function TreeGraphic({ arvores, carbonoKg }: { arvores: number; carbonoKg: number }) {
  const scale = clamp(Math.sqrt(carbonoKg / 40), 0.62, 1.65)

  return (
    <div data-testid="carbono-arvore" className="pointer-events-none absolute bottom-7 right-8 flex origin-bottom flex-col items-center transition-transform duration-300" style={{ transform: `scale(${scale})` }}>
      <div className="relative h-28 w-36">
        <span className="absolute left-2 top-8 h-16 w-16 rounded-full bg-[#eef59a]/70 transition-all duration-300" />
        <span className="absolute left-8 top-2 h-20 w-20 rounded-full bg-[#eef59a]/70 transition-all duration-300" />
        <span className="absolute right-2 top-8 h-16 w-16 rounded-full bg-[#eef59a]/70 transition-all duration-300" />
        <span className="absolute left-12 top-9 h-20 w-20 rounded-full bg-[#eef59a]/70 transition-all duration-300" />
        <span className="absolute left-14 top-14 h-16 w-16 rounded-full bg-[#eef59a]/70 transition-all duration-300" />
      </div>
      <div className="-mt-5 h-16 w-5 rounded-t-full bg-[#8b1b10]" />
      <span className="mt-1 text-[8px] font-medium text-[#555]">Equivalente a {arvores} árvores/ano</span>
    </div>
  )
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="mb-3 grid grid-cols-[46px_1fr_36px] items-center gap-2 text-[10px]">
      <span>{label}</span>
      <div className="h-2 bg-transparent">
        <div className="h-2" style={{ width: `${Math.max(8, (value / max) * 100)}%`, backgroundColor: color }} />
      </div>
      <span>{formatTon(value)}</span>
    </div>
  )
}

function SliderControl({
  icon,
  label,
  value,
  suffix = '',
  min,
  max,
  step,
  onChange,
}: {
  icon: ReactNode
  label: string
  value: number
  suffix?: string
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs font-bold">{icon}{label}</span>
        <strong className="text-xl font-black">{value.toLocaleString('pt-BR')}{suffix}</strong>
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
      <div className="mt-1 flex justify-between text-[10px] font-medium">
        <span>{min.toLocaleString('pt-BR')}</span>
        <span>{max.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}

function ImpactColumn({ value, max, label, color, testId }: { value: number; max: number; label: string; color: string; testId: string }) {
  return (
    <div className="flex h-44 flex-col items-center justify-end">
      <span className="mb-1 text-[9px] font-medium">{value.toFixed(2)} kgCO₂e</span>
      <div data-testid={testId} className="w-14" style={{ height: `${Math.max(18, (value / max) * 120)}px`, backgroundColor: color }} />
      <span className="mt-2 max-w-[70px] text-center text-[8px] leading-tight">{label}</span>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#ffb4ae] p-4 text-center">
      <span className="block text-xs font-bold">{label}</span>
      <strong className="mt-3 block text-2xl font-black">{value}</strong>
    </div>
  )
}

function OffsetCard({
  title,
  description,
  cost,
  selected,
  onClick,
}: {
  title: string
  description: string
  cost: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl p-5 text-left transition-all ${
        selected ? 'bg-[#ff2b1d] text-white shadow-lg shadow-[#ff2b1d]/20' : 'bg-[#ffb4ae] hover:bg-[#ff9f98]'
      }`}
    >
      <h3 className="font-black">{title}</h3>
      <p className="mt-4 text-[11px] font-medium leading-relaxed">{description}</p>
      <p className="mt-5 text-[10px] font-black">Custo por ton: {cost}</p>
    </button>
  )
}
