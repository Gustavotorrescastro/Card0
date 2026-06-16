'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Box,
  ChevronDown,
  CreditCard,
  Factory,
  Leaf,
  LogIn,
  Trash2,
  Truck,
  Zap,
} from 'lucide-react'

import Card0Logo from '@/components/Card0Logo'
import EdenredLogo from '@/components/EdenredLogo'

type FaseKey = 'producao' | 'transporte' | 'uso' | 'descarte'

const RED = '#ff2b1d'
const ROSE = '#ff7770'
const LIGHT = '#ffb4ae'
const PALE = '#ffe5e5'

const matrizEnergetica = {
  br: {
    label: 'Brasil',
    intensidadeGco2Kwh: 66,
    resumo: 'matriz com maior participação renovável',
  },
  ue: {
    label: 'União Europeia',
    intensidadeGco2Kwh: 244,
    resumo: 'média regional com queda recente de fósseis',
  },
  usa: {
    label: 'Estados Unidos',
    intensidadeGco2Kwh: 331,
    resumo: 'média nacional ainda mais fóssil que a brasileira',
  },
}

const quantidadeReferencia = 13600

const detalhesBaseTon = {
  producao: [
    { label: 'PVC/plástico', ton: 0.31 },
    { label: 'Chip NFC/EMV', ton: 0.18 },
    { label: 'Antena metálica', ton: 0.09 },
    { label: 'Impressão', ton: 0.07 },
    { label: 'Embalagem', ton: 0.06 },
    { label: 'Outros insumos', ton: 0.27 },
  ],
  transporte: [
    { label: 'Transporte industrial', ton: 0.18 },
    { label: 'Entrega ao colaborador', ton: 0.12 },
    { label: 'Reenvios e devoluções', ton: 0.05 },
    { label: 'Armazenamento logístico', ton: 0.02 },
  ],
  uso: [
    { label: 'Maquininhas POS', ton: 0.11 },
    { label: 'Reemissão operacional', ton: 0.08 },
    { label: 'Processamento em nuvem', ton: 0.06 },
    { label: 'Energia da infraestrutura', ton: 0.14 },
  ],
  descarte: [
    { label: 'Resíduo eletrônico/plástico', ton: 0.09 },
    { label: 'Logística reversa', ton: 0.02 },
    { label: 'Recuperação de partes', ton: 0.01 },
  ],
}

const fatores = [
  {
    icon: <Box size={22} />,
    title: 'Remissão e logística',
    text: 'Cartões físicos podem exigir reenvio, transporte adicional e atendimento quando há perda, atraso ou necessidade de troca.',
  },
  {
    icon: <Factory size={22} />,
    title: 'Produção do cartão',
    text: 'A fabricação envolve PVC, chip, impressão, embalagem e energia. Cada cartão físico adiciona material e carbono ao ciclo.',
  },
  {
    icon: <Truck size={22} />,
    title: 'Transporte',
    text: 'A distribuição até empresas e usuários aumenta o impacto, principalmente em operações com muitos cartões e longas distâncias.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Matriz energética',
    text: 'Quanto mais carbono existe na energia usada pela cadeia operacional, maior tende a ser o impacto de uso e transporte.',
  },
  {
    icon: <Trash2 size={22} />,
    title: 'Descarte incorreto',
    text: 'Cartões com chip misturam plástico e componentes eletrônicos. Sem descarte seguro, parte do impacto permanece no fim da vida útil.',
  },
]

function formatKg(value: number) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })
}

function formatTon(value: number) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function sumTon(items: Array<{ ton: number }>) {
  return items.reduce((total, item) => total + item.ton, 0)
}

export default function VisualizacaoPublicaPage() {
  const [quantidade, setQuantidade] = useState(13600)
  const [matriz, setMatriz] = useState<keyof typeof matrizEnergetica>('br')
  const [faseDetalhe, setFaseDetalhe] = useState<FaseKey | null>(null)

  const lca = useMemo(() => {
    const matrizAtual = matrizEnergetica[matriz]
    const fatorMatriz =
      matrizAtual.intensidadeGco2Kwh / matrizEnergetica.br.intensidadeGco2Kwh
    const fatorQuantidade = quantidade / quantidadeReferencia
    const fatorProducao = 0.72 + 0.28 * fatorMatriz

    const componentes = {
      producao: detalhesBaseTon.producao.map((item) => ({
        ...item,
        ton: item.ton * fatorQuantidade * fatorProducao,
      })),
      transporte: detalhesBaseTon.transporte.map((item) => ({
        ...item,
        ton: item.ton * fatorQuantidade,
      })),
      uso: detalhesBaseTon.uso.map((item) => ({
        ...item,
        ton: item.ton * fatorQuantidade * fatorMatriz,
      })),
      descarte: detalhesBaseTon.descarte.map((item) => ({
        ...item,
        ton: item.ton * fatorQuantidade,
      })),
    }

    const prodFisKg = sumTon(componentes.producao) * 1000
    const transFisKg = sumTon(componentes.transporte) * 1000
    const usoFisKg = sumTon(componentes.uso) * 1000
    const descFisKg = sumTon(componentes.descarte) * 1000
    const totalFisKg = prodFisKg + transFisKg + usoFisKg + descFisKg

    const prodDigKg = prodFisKg * 0.7
    const transDigKg = transFisKg * 0.17
    const usoDigKg = usoFisKg * 0.48
    const descDigKg = descFisKg * 0.18
    const totalDigKg = prodDigKg + transDigKg + usoDigKg + descDigKg

    const pProd = totalFisKg > 0 ? Math.round((prodFisKg / totalFisKg) * 100) : 0
    const pTrans = totalFisKg > 0 ? Math.round((transFisKg / totalFisKg) * 100) : 0
    const pUso = totalFisKg > 0 ? Math.round((usoFisKg / totalFisKg) * 100) : 0
    const pDesc = Math.max(0, 100 - pProd - pTrans - pUso)

    return {
      fases: {
        producao: {
          fisico: prodFisKg / 1000,
          digital: prodDigKg / 1000,
          percentual: pProd,
          details: componentes.producao,
        },
        transporte: {
          fisico: transFisKg / 1000,
          digital: transDigKg / 1000,
          percentual: pTrans,
          details: componentes.transporte,
        },
        uso: {
          fisico: usoFisKg / 1000,
          digital: usoDigKg / 1000,
          percentual: pUso,
          details: componentes.uso,
        },
        descarte: {
          fisico: descFisKg / 1000,
          digital: descDigKg / 1000,
          percentual: pDesc,
          details: componentes.descarte,
        },
      },
      totalFisKg,
      totalDigKg,
      totalFisTon: totalFisKg / 1000,
      totalDigTon: totalDigKg / 1000,
      reducaoPercentual: Math.round((1 - totalDigKg / totalFisKg) * 100),
      carbonoDiferencaKg: totalFisKg - totalDigKg,
      arvores: Math.max(1, Math.round(totalFisKg / 15.6)),
      fatorMatriz,
      matrizAtual,
    }
  }, [quantidade, matriz])

  const fases: Array<{
    key: FaseKey
    titulo: string
    icon: ReactNode
    color: string
  }> = [
    { key: 'producao', titulo: 'Produção', icon: <Factory size={18} />, color: RED },
    { key: 'transporte', titulo: 'Transporte', icon: <Truck size={18} />, color: ROSE },
    { key: 'uso', titulo: 'Uso', icon: <CreditCard size={18} />, color: LIGHT },
    { key: 'descarte', titulo: 'Descarte', icon: <Trash2 size={18} />, color: PALE },
  ]

  const donutStops = (() => {
    const p1 = lca.fases.producao.percentual
    const p2 = p1 + lca.fases.transporte.percentual
    const p3 = p2 + lca.fases.uso.percentual

    return `${RED} 0 ${p1}%, ${ROSE} ${p1}% ${p2}%, ${LIGHT} ${p2}% ${p3}%, ${PALE} ${p3}% 100%`
  })()
  const maxFase = Math.max(...fases.map((fase) => lca.fases[fase.key].fisico))

  return (
    <main className="min-h-screen bg-[#f4f4f4] text-[#111]">
      <header className="sticky top-0 z-30 border-b border-[#ededed] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex flex-1 justify-center">
            <Link
              href="/"
              aria-label="Voltar para a Landing Page"
              className="flex items-center gap-5 rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#ff2b1d]/40"
            >
              <EdenredLogo compact />
              <span className="h-10 w-px bg-[#111]" />
              <Card0Logo className="h-8 w-auto" priority />
            </Link>
          </div>
          <Link
            href="/login"
            className="absolute right-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#ff2b1d] px-7 text-sm font-bold text-white shadow-lg shadow-[#ff2b1d]/20 transition-all hover:-translate-y-0.5 hover:bg-[#e51f13] md:right-8"
          >
            Entrar
            <ChevronDown size={15} />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_520px]">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-[2.65rem]">
              Impactos ambientais
            </h1>
            <p className="mt-1 text-lg font-bold text-[#777]">Cartão físico vs. digital</p>
            <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-[#777]">
              Simule e descubra os impactos ambientais e operacionais médios de uma operação com cartões físicos.
            </p>

            <section className="mt-7 rounded-xl bg-white p-6 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_190px]">
                <div>
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 className="text-base font-black">Quantidade de cartões</h2>
                    <strong className="text-2xl font-black">{quantidade.toLocaleString('pt-BR')}</strong>
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
                  <div className="mt-3 flex justify-between text-xs font-medium text-[#333]">
                    <span>100</span>
                    <span>100.000</span>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-4 block text-sm font-black">Matriz energética</span>
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
                  <span className="mt-3 block rounded-2xl bg-[#fff1ef] px-4 py-3 text-[11px] font-semibold leading-relaxed text-[#555]">
                    {lca.matrizAtual.intensidadeGco2Kwh} gCO₂/kWh · fator{' '}
                    {lca.fatorMatriz.toLocaleString('pt-BR', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                    x vs. Brasil
                  </span>
                </label>
              </div>
              <div className="mt-5 rounded-2xl border border-[#ffe1de] bg-[#fff7f7] p-4 text-xs font-semibold leading-relaxed text-[#555]">
                <strong className="text-[#111]">Como a matriz é considerada:</strong> usamos a intensidade média de carbono da eletricidade do país/região selecionado em gCO₂/kWh. Esse fator ajusta o uso energético e 28% da produção do cartão; transporte e descarte ficam em fatores operacionais próprios.
              </div>
            </section>
          </div>

          <section className="relative min-h-[265px] overflow-hidden rounded-xl bg-white p-6 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <h2 className="text-sm font-black">Carbono gerado</h2>
            <div className="mt-12 text-6xl font-black tracking-tight">{formatKg(lca.totalFisKg)}kg</div>
            <p className="mt-3 max-w-[255px] text-[11px] font-semibold leading-snug">
              de CO₂ são gerados durante o ciclo dos cartões físicos.
            </p>
            <p className="absolute bottom-4 left-6 max-w-[310px] text-[9px] font-semibold text-[#666]">
              ↑ O processo físico gera <strong>{lca.carbonoDiferencaKg.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg</strong> de CO₂ a mais que o digital
            </p>
            <TreeGraphic arvores={lca.arvores} carbonoKg={lca.totalFisKg} />
          </section>
        </section>

        <section className="mt-16 rounded-xl bg-white p-7 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
          <h2 className="text-2xl font-black">Inteligência de Ciclo de Vida (LCA) simplificado</h2>
          <p className="text-sm font-medium text-[#777]">Impacto ambiental por fase de ciclo de vida do cartão físico.</p>

          <div className="mt-5 grid grid-cols-1 items-center gap-8 lg:grid-cols-[310px_1fr]">
            <div className="flex justify-center">
              <div
                className="grid h-64 w-64 place-items-center rounded-full"
                style={{ background: `conic-gradient(${donutStops})` }}
              >
                <div className="grid h-32 w-32 place-items-center rounded-full bg-white text-center">
                  <span className="text-xl font-black">{formatTon(lca.totalFisTon)} tCO₂e</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {fases.map((fase) => {
                const data = lca.fases[fase.key]
                const active = faseDetalhe === fase.key

                return (
                  <article
                    key={fase.key}
                    className="lca-flip-card h-[260px] rounded-2xl"
                  >
                    <div className={`lca-flip-inner rounded-2xl ${active ? 'is-flipped' : ''}`}>
                      <div
                        className="lca-flip-face flex cursor-pointer flex-col overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
                        style={{ backgroundColor: fase.color, color: '#111' }}
                        onClick={() => setFaseDetalhe(fase.key)}
                      >
                        <div className="mb-5 flex items-center gap-2 text-sm font-bold">
                          {fase.icon}
                          <span>{fase.titulo}</span>
                        </div>
                        <div className="flex flex-1 flex-col items-center justify-center text-center">
                          <strong className="text-3xl font-black">{data.percentual}%</strong>
                          <span className="mt-2 text-xs font-medium">{formatTon(data.fisico)} tCO₂e</span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              setFaseDetalhe(fase.key)
                            }}
                            className="mt-7 rounded-full border border-black px-6 py-1.5 text-[10px] font-semibold transition-all hover:bg-black hover:text-white"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </div>

                      <div className="lca-flip-face lca-flip-back flex overflow-hidden rounded-2xl bg-[#ff2b1d] p-4 text-white">
                        <div className="flex min-h-0 w-full flex-col">
                          <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                            {fase.icon}
                            <span>{fase.titulo}</span>
                          </div>
                          <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 text-[9px] font-semibold leading-tight">
                            {data.details.map((detail) => (
                              <p key={detail.label} className="grid grid-cols-[1fr_auto] items-start gap-2 rounded-lg bg-white/10 px-2 py-1">
                                <span className="min-w-0 break-words">{detail.label}</span>
                                <strong className="whitespace-nowrap text-right">{formatTon(detail.ton)} tCO₂e</strong>
                              </p>
                            ))}
                          </div>
                          <p className="pt-2 text-center text-[10px] font-black leading-tight">
                            Total estimado:<br />
                            {formatTon(data.fisico)} tCO₂e
                          </p>
                          <p className="text-center text-[8px] leading-tight">{data.percentual}% do ciclo de vida total</p>
                          <button
                            type="button"
                            onClick={() => setFaseDetalhe(null)}
                            className="mx-auto mt-2 block shrink-0 rounded-full border border-white/80 px-7 py-1 text-[9px] font-bold transition-all hover:bg-white hover:text-[#ff2b1d]"
                          >
                            Voltar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mt-7 rounded-xl bg-white p-7 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
          <h2 className="text-2xl font-black">Comparar impacto físico vs. digital por fase</h2>
          <p className="text-sm font-medium text-[#777]">Valores em tCO₂e</p>

          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_220px]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {fases.map((fase) => {
                const fisico = lca.fases[fase.key].fisico
                const digital = lca.fases[fase.key].digital
                const reducao = Math.round((1 - digital / fisico) * 100)

                return (
                  <article key={fase.key} className="border-r border-[#ddd] pr-5 last:border-r-0">
                    <div className="mb-6 flex items-center gap-2 text-base font-bold">
                      {fase.icon}
                      <span>{fase.titulo}</span>
                    </div>
                    <MiniBar label="Físico" value={fisico} max={maxFase} color={RED} />
                    <MiniBar label="Digital" value={digital} max={maxFase} color={LIGHT} />
                    <p className="mt-6 text-center text-sm font-semibold">↓ {reducao}% menor</p>
                  </article>
                )
              })}
            </div>

            <aside className="self-start rounded-2xl bg-[#ff2b1d] p-5 text-white">
              <h3 className="text-center text-base font-black">Total do ciclo de vida</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-5">
                  <span>Físico</span>
                  <strong>{formatTon(lca.totalFisTon)} tCO₂e</strong>
                </div>
                <div className="flex justify-between gap-5">
                  <span>Digital</span>
                  <strong>{formatTon(lca.totalDigTon)} tCO₂e</strong>
                </div>
              </div>
              <div className="my-4 border-t border-white/70" />
              <p className="text-center text-xl font-black">↓{lca.reducaoPercentual}% menor</p>
            </aside>
          </div>
        </section>

        <section className="mt-7 rounded-xl bg-white p-9 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
          <h2 className="text-2xl font-black">Inteligência de Ciclo de Vida (LCA) simplificado</h2>
          <p className="mt-3 text-base font-semibold text-[#777]">Principais fatores</p>

          <div className="mt-8 max-w-5xl space-y-7">
            {fatores.map((fator) => (
              <article key={fator.title} className="grid grid-cols-[56px_1fr] items-start gap-5">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#ff2b1d] text-white">
                  {fator.icon}
                </div>
                <div>
                  <h3 className="text-base font-black">{fator.title}</h3>
                  <p className="mt-1 max-w-4xl text-sm font-medium leading-relaxed text-[#777]">{fator.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-[#111] px-7 py-9 text-center text-white shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
          <Leaf className="mx-auto text-[#ffb4ae]" size={36} />
          <h2 className="mt-4 text-3xl font-black">Quer simular com dados da sua empresa?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-white/75">
            Entre ou cadastre sua operação para salvar cenários, acompanhar evolução e conectar custo, carbono e risco em uma visão executiva.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff2b1d] px-8 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#e51f13]"
            >
              <LogIn size={17} />
              Fazer login
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#ffb4ae] bg-white px-8 text-sm font-black text-[#ff2b1d] transition-all hover:-translate-y-0.5 hover:bg-[#fff1ef]"
            >
              Criar cadastro
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

function TreeGraphic({ arvores, carbonoKg }: { arvores: number; carbonoKg: number }) {
  const scale = Math.min(1.55, Math.max(0.76, Math.sqrt(carbonoKg / 2300)))

  return (
    <div
      className="pointer-events-none absolute bottom-8 right-8 flex origin-bottom flex-col items-center transition-transform duration-300"
      style={{ transform: `scale(${scale})` }}
    >
      <div className="relative h-36 w-44">
        <span className="absolute left-2 top-8 h-20 w-20 rounded-full bg-[#eef59a]/70" />
        <span className="absolute left-12 top-1 h-24 w-24 rounded-full bg-[#eef59a]/70" />
        <span className="absolute right-0 top-10 h-20 w-20 rounded-full bg-[#eef59a]/70" />
        <span className="absolute left-16 top-12 h-24 w-24 rounded-full bg-[#eef59a]/70" />
        <span className="absolute left-20 top-20 h-20 w-20 rounded-full bg-[#eef59a]/70" />
      </div>
      <div className="-mt-7 h-20 w-7 rounded-t-full bg-[#8b1b10]" />
      <span className="mt-1 text-[8px] font-semibold text-[#666]">Equivalente a {arvores} árvores/ano</span>
    </div>
  )
}

function MiniBar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  return (
    <div className="mb-4 grid grid-cols-[52px_1fr_44px] items-center gap-2 text-[11px]">
      <span>{label}</span>
      <div className="h-2 bg-transparent">
        <div
          className="h-2 transition-all duration-300"
          style={{ width: `${Math.max(10, (value / max) * 100)}%`, backgroundColor: color }}
        />
      </div>
      <span>{formatTon(value)}</span>
    </div>
  )
}
