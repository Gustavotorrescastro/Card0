// Constantes de Cálculo do Simulador de Risco Operacional

/**
 * Emissão de CO₂ por cartão físico reemitido (em kg)
 * Baseado em: produção + transporte
 */
export const CO2_POR_CARTAO_FISICO = 5

/**
 * Custo de reemissão de um cartão físico (em R$)
 * Incluindo: produção + logística + mão de obra
 */
export const CUSTO_REEMISSAO_FISICO = 20

/**
 * Custo operacional de um cartão digital (em R$)
 * Apenas custos de infraestrutura digital
 */
export const CUSTO_OPERACIONAL_DIGITAL = 0.20

/**
 * Peso de plástico por cartão (em kg)
 */
export const PESO_PLASTICO_POR_CARTAO = 0.005

/**
 * Limites de valores dos controles
 */
export const LIMITES = {
  CARTOES_ATIVOS: {
    MIN: 100,
    MAX: 100000,
    STEP: 100,
    INICIAL: 1000,
  },
  TAXA_FALHA: {
    MIN: 0.1,
    MAX: 10,
    STEP: 0.1,
    INICIAL: 2,
  },
}