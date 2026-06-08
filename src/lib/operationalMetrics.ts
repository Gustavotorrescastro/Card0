export const OPERATIONAL_METRICS_KEY = 'card0OperationalMetrics'

export type ToolSource = 'financial' | 'lca' | 'risk' | 'timeline'

export type OperationalMetricsStore = {
  financial?: {
    cartoesAnalisados: number
    economiaPercentual: number
    economiaAbsoluta: number
    tcoFisico: number
    tcoDigital: number
    precisaoSimulacao: number
    updatedAt: string
  }
  lca?: {
    cartoesAnalisados: number
    co2EvitadoKg: number
    materiaPrimaReduzidaKg: number
    reducaoPercentual: number
    taxaReciclagem: number
    carbonoCompensacaoKg: number
    updatedAt: string
  }
  risk?: {
    cartoesAtivos: number
    co2EvitadoKg: number
    materiaPrimaReduzidaKg: number
    falhasEvitaveisMes: number
    economiaFinanceira: number
    economiaPercentual: number
    riscoScore: number
    updatedAt: string
  }
  timeline?: {
    co2EvitadoKg: number
    metaKg: number
    progressoMetaPercent: number
    diasAtivos: number
    mediaMensalKg: number
    updatedAt: string
  }
}

export type OperationalScore = {
  co2EvitadoKg: number
  materiaPrimaReduzidaKg: number
  transacoesCompensadas: number
  score: number
  metaAnualKg: number
  fontesAtivas: number
  componentes: {
    carbono: number
    materiais: number
    digitalizacao: number
    governanca: number
  }
}

export type CostImpactPanel = {
  custo: number
  impacto: number
  fontesAtivas: number
  detalhe: Array<{
    label: string
    custo?: number
    impacto?: number
  }>
}

function clamp(valor: number, min: number, max: number) {
  return Math.min(max, Math.max(min, valor))
}

function safeNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function readOperationalMetrics(): OperationalMetricsStore {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(localStorage.getItem(OPERATIONAL_METRICS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveOperationalMetrics<T extends ToolSource>(
  source: T,
  payload: NonNullable<OperationalMetricsStore[T]>
) {
  if (typeof window === 'undefined') return

  const current = readOperationalMetrics()
  localStorage.setItem(
    OPERATIONAL_METRICS_KEY,
    JSON.stringify({
      ...current,
      [source]: payload,
    })
  )
}

export function calculateOperationalScore(store: OperationalMetricsStore): OperationalScore {
  const financial = store.financial
  const lca = store.lca
  const risk = store.risk
  const timeline = store.timeline

  const fontesAtivas = [financial, lca, risk, timeline].filter(Boolean).length
  const co2EvitadoKg =
    safeNumber(lca?.co2EvitadoKg) +
    safeNumber(risk?.co2EvitadoKg) +
    safeNumber(timeline?.co2EvitadoKg)
  const materiaPrimaReduzidaKg =
    safeNumber(lca?.materiaPrimaReduzidaKg) +
    safeNumber(risk?.materiaPrimaReduzidaKg)
  const transacoesCompensadas = Math.round(
    safeNumber(financial?.cartoesAnalisados) * 2.4 +
    safeNumber(lca?.cartoesAnalisados) * 1.8 +
    safeNumber(risk?.falhasEvitaveisMes) * 12
  )

  const metaKg = Math.max(safeNumber(timeline?.metaKg), 1000)
  const carbonScore = clamp((co2EvitadoKg / metaKg) * 35, 0, 35)
  const materialScore = clamp((materiaPrimaReduzidaKg / 50) * 20, 0, 20)

  const digitalSignals = [
    financial?.economiaPercentual,
    lca?.reducaoPercentual,
    timeline?.progressoMetaPercent,
  ]
    .map((value) => safeNumber(value, NaN))
    .filter(Number.isFinite)

  const digitalAverage = digitalSignals.length
    ? digitalSignals.reduce((sum, value) => sum + value, 0) / digitalSignals.length
    : 0
  const digitalScore = clamp((digitalAverage / 100) * 25, 0, 25)

  const governanceSignals = [
    financial?.precisaoSimulacao,
    lca?.taxaReciclagem,
    risk ? 100 - safeNumber(risk.riscoScore) : undefined,
    fontesAtivas * 25,
  ]
    .map((value) => safeNumber(value, NaN))
    .filter(Number.isFinite)

  const governanceAverage = governanceSignals.length
    ? governanceSignals.reduce((sum, value) => sum + value, 0) / governanceSignals.length
    : 0
  const governanceScore = clamp((governanceAverage / 100) * 20, 0, 20)

  const score = clamp(
    Math.round(carbonScore + materialScore + digitalScore + governanceScore),
    0,
    100
  )

  return {
    co2EvitadoKg: Number(co2EvitadoKg.toFixed(1)),
    materiaPrimaReduzidaKg: Number(materiaPrimaReduzidaKg.toFixed(1)),
    transacoesCompensadas,
    score,
    metaAnualKg: Number(Math.max(2, metaKg).toFixed(1)),
    fontesAtivas,
    componentes: {
      carbono: Math.round(carbonScore),
      materiais: Math.round(materialScore),
      digitalizacao: Math.round(digitalScore),
      governanca: Math.round(governanceScore),
    },
  }
}

function average(values: number[]) {
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0
}

export function calculateCostImpactPanel(store: OperationalMetricsStore): CostImpactPanel {
  const financial = store.financial
  const lca = store.lca
  const risk = store.risk
  const timeline = store.timeline

  const detalhe: CostImpactPanel['detalhe'] = []
  const costSignals: number[] = []
  const impactSignals: number[] = []

  if (financial) {
    const economia = clamp(financial.economiaPercentual, 0, 100)
    const precisao = clamp(financial.precisaoSimulacao, 0, 100)
    const custo = Math.round(economia * 0.75 + precisao * 0.25)

    costSignals.push(custo)
    detalhe.push({ label: 'Impacto financeiro', custo })
  }

  if (risk) {
    const economia = clamp(risk.economiaPercentual, 0, 100)
    const controleRisco = clamp(100 - risk.riscoScore, 0, 100)
    const custo = Math.round(economia * 0.65 + controleRisco * 0.35)

    costSignals.push(custo)
    detalhe.push({ label: 'Risco operacional', custo })
  }

  if (lca) {
    const reducao = clamp(lca.reducaoPercentual, 0, 100)
    const reciclagem = clamp(lca.taxaReciclagem, 0, 100)
    const impacto = Math.round(reducao * 0.7 + reciclagem * 0.3)

    impactSignals.push(impacto)
    detalhe.push({ label: 'Operação e execução', impacto })
  }

  if (timeline) {
    const impacto = clamp(timeline.progressoMetaPercent, 0, 100)

    impactSignals.push(impacto)
    detalhe.push({ label: 'Linha do tempo', impacto })
  }

  if (risk) {
    const impacto = clamp(100 - risk.riscoScore, 0, 100)

    impactSignals.push(impacto)
    detalhe.push({ label: 'Risco operacional', impacto })
  }

  return {
    custo: Math.round(average(costSignals)),
    impacto: Math.round(average(impactSignals)),
    fontesAtivas: [financial, lca, risk, timeline].filter(Boolean).length,
    detalhe,
  }
}
