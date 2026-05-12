import {
  CUSTO_INDIRETO,
  CUSTO_FALHA,
  CARTAO_DIGITAL,
  PERIODOS_PROJECAO,
} from './constantes'
import { CamadasTCO, ResultadoTCO, PontoProjecao } from './tipos'

/**
 * Calcula o TCO em camadas para uma quantidade de cartões físicos.
 *
 * @param quantidade - Número de cartões emitidos
 * @param valorPorCartao - Custo direto unitário do cartão (R$)
 * @returns Camadas de custo e total
 */
export function calcularTCOFisico(
  quantidade: number,
  valorPorCartao: number
): CamadasTCO {
  // Custos diretos: o valor unitário que o usuário define × quantidade
  const custosDiretos = quantidade * valorPorCartao

  // Custos indiretos: soma das componentes × quantidade
  const indiretoUnitario =
    CUSTO_INDIRETO.ONBOARDING +
    CUSTO_INDIRETO.GESTAO_INVENTARIO +
    CUSTO_INDIRETO.SUPORTE_INICIAL
  const custosIndiretos = quantidade * indiretoUnitario

  // Custos de falha: % de cartões que falham × (reemissão + transações perdidas)
  const cartoesQueFalham = quantidade * CUSTO_FALHA.TAXA_FALHA_MENSAL
  const custoFalhaPorCartao =
    CUSTO_FALHA.CUSTO_REEMISSAO +
    CUSTO_FALHA.CUSTO_PAGAMENTO_NEGADO * CUSTO_FALHA.TRANSACOES_PERDIDAS_MES
  const custosFalha = cartoesQueFalham * custoFalhaPorCartao

  const custoTotal = custosDiretos + custosIndiretos + custosFalha

  return {
    custosDiretos,
    custosIndiretos,
    custosFalha,
    custoTotal,
  }
}

/**
 * Calcula o custo total da solução digital.
 *
 * @param quantidade - Número de usuários migrados para digital
 * @returns Custo total em R$
 */
export function calcularTCODigital(quantidade: number): number {
  const custoAtivacao = quantidade * CARTAO_DIGITAL.CUSTO_ATIVACAO
  // Custo operacional mensal (consideramos primeiro mês para comparação justa)
  const custoOperacional = quantidade * CARTAO_DIGITAL.CUSTO_OPERACIONAL_MES
  const custoFalha =
    quantidade *
    CARTAO_DIGITAL.TAXA_FALHA_MENSAL *
    CARTAO_DIGITAL.CUSTO_OPERACIONAL_MES *
    2 // reemissão digital é mínima

  return custoAtivacao + custoOperacional + custoFalha
}

/**
 * Calcula o resultado completo da comparação físico vs digital.
 */
export function calcularResultadoCompleto(
  quantidade: number,
  valorPorCartao: number
): ResultadoTCO {
  const fisico = calcularTCOFisico(quantidade, valorPorCartao)
  const digital = calcularTCODigital(quantidade)

  const economiaAbsoluta = fisico.custoTotal - digital
  const economiaPercentual =
    fisico.custoTotal > 0 ? (economiaAbsoluta / fisico.custoTotal) * 100 : 0

  const percentualDireto =
    fisico.custoTotal > 0 ? (fisico.custosDiretos / fisico.custoTotal) * 100 : 0
  const percentualIndireto =
    fisico.custoTotal > 0
      ? (fisico.custosIndiretos / fisico.custoTotal) * 100
      : 0
  const percentualFalha =
    fisico.custoTotal > 0 ? (fisico.custosFalha / fisico.custoTotal) * 100 : 0

  return {
    fisico,
    digital,
    economiaAbsoluta,
    economiaPercentual,
    percentualDireto,
    percentualIndireto,
    percentualFalha,
  }
}

/**
 * Gera pontos do gráfico de projeção: como o TCO cresce com a operação.
 */
export function gerarProjecaoCrescimento(
  valorPorCartao: number
): PontoProjecao[] {
  return PERIODOS_PROJECAO.map((quantidade) => ({
    quantidade,
    tcoFisico: calcularTCOFisico(quantidade, valorPorCartao).custoTotal,
    tcoDigital: calcularTCODigital(quantidade),
  }))
}

/**
 * Formata valor em R$ (padrão BR).
 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Formata valor abreviado para gráficos (ex: R$ 100K).
 */
export function formatarMoedaAbreviada(valor: number): string {
  if (valor >= 1_000_000) return `R$ ${(valor / 1_000_000).toFixed(1)}M`
  if (valor >= 1_000) return `R$ ${(valor / 1_000).toFixed(0)}K`
  return `R$ ${valor.toFixed(0)}`
}