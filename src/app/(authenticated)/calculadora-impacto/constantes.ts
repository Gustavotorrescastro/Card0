// Constantes da Calculadora de Custos e Impacto Financeiro (TCO em camadas)
// Baseado nas premissas técnicas do README (GHG Protocol, IPCC, MCTI, DEFRA)

/**
 * CUSTOS DIRETOS - por cartão (R$)
 * Material PVC + chip NFC + logística + mão de obra
 */
export const CUSTO_DIRETO = {
  PRODUCAO_CARTAO_PVC: 5.50,    // Material PVC + impressão (benchmark BR lote corporativo)
  CHIP_NFC: 3.20,                // Chip + antena NFC
  LOGISTICA_ENVIO: 4.80,         // Distribuição fábrica → cliente
  MAO_DE_OBRA: 2.50,             // Emissão + ativação
}

/**
 * CUSTOS INDIRETOS - por cartão (R$)
 * Tempo de onboarding, gestão de inventário, treinamento
 */
export const CUSTO_INDIRETO = {
  ONBOARDING: 5.00,              // Tempo de equipe para ativar usuário
  GESTAO_INVENTARIO: 2.30,       // Estoque, armazenamento
  SUPORTE_INICIAL: 1.80,         // SAC para dúvidas no primeiro uso
}

/**
 * CUSTOS DE FALHA - por cartão/mês (R$)
 * Reemissão, pagamento negado, retrabalho, perda
 */
export const CUSTO_FALHA = {
  TAXA_FALHA_MENSAL: 0.008,      // 0.8% dos cartões falham por mês (benchmark setor — Chargeback Gurus, Fed Reserve)
  CUSTO_REEMISSAO: 20.00,        // Custo de reemitir um cartão (produção + envio)
  CUSTO_PAGAMENTO_NEGADO: 5.00,  // Perda média por transação negada (ticket médio benefícios BR)
  TRANSACOES_PERDIDAS_MES: 8,    // Média de transações perdidas até reemissão (5-10 dias úteis × 1-2 tx/dia)
}

/**
 * CARTÃO DIGITAL - solução comparativa
 * Custo operacional muito menor (sem material físico)
 */
export const CARTAO_DIGITAL = {
  CUSTO_ATIVACAO: 1.50,          // Setup inicial wallet/NFC
  CUSTO_OPERACIONAL_MES: 0.20,   // Infra digital (servidor, processamento)
  TAXA_FALHA_MENSAL: 0.002,      // 0.2% (4x menor que físico)
}

/**
 * Limites dos controles na UI
 */
export const LIMITES = {
  QUANTIDADE_CARTOES: {
    MIN: 100,
    MAX: 100000,
    STEP: 100,
    INICIAL: 1000,
  },
  VALOR_POR_CARTAO: {
    MIN: 5,
    MAX: 50,
    STEP: 0.50,
    INICIAL: 16.00,    // Soma média dos custos diretos como sugestão inicial (5.50+3.20+4.80+2.50)
  },
}

/**
 * Períodos para projeção do gráfico de crescimento
 */
export const PERIODOS_PROJECAO = [1000, 2500, 5000, 7500, 10000, 25000, 50000, 75000, 100000]

/**
 * Textos da interface
 */
export const TEXTOS = {
  TITULO: 'Custos e Impacto Financeiro',
  SUBTITULO: 'Matriz de custo total (TCO) em camadas — entenda o custo real além do valor unitário do cartão.',
  EXPLICACAO_METRICAS:
    'A calculadora considera três camadas de custo: diretos (produção do cartão, chip NFC, logística), indiretos (onboarding, gestão e suporte) e custo de falha (reemissão, pagamento negado e retrabalho). Os valores são baseados em benchmarks de mercado (ABCorp, ICMA, Chargeback Gurus) e nas premissas técnicas do GHG Protocol e do MCTI.',
}