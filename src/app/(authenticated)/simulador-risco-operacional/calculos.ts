import { 
  CO2_POR_CARTAO_FISICO, 
  CUSTO_REEMISSAO_FISICO, 
  CUSTO_OPERACIONAL_DIGITAL,
  PESO_PLASTICO_POR_CARTAO 
} from './constantes'

/**
 * Interface que define o formato dos resultados do cálculo
 */
export interface MetricasRisco {
  falhasMes: number
  co2FisicoMes: number
  custoFisicoMes: number
  plasticoFisicoMes: number
  custoDigitalOperacional: number
  co2Evitado: number
  economiaFinanceira: number
}

/**
 * Calcula todas as métricas de risco operacional
 * 
 * @param cartoesAtivos - Número total de cartões ativos
 * @param taxaFalha - Percentual de falha mensal (0-100)
 * @returns Objeto com todas as métricas calculadas
 * 
 * @example
 * const resultado = calcularMetricasRisco(1000, 2)
 * console.log(resultado.falhasMes) // 20
 */
export function calcularMetricasRisco(
  cartoesAtivos: number, 
  taxaFalha: number
): MetricasRisco {
  //Calcular número de falhas no mês
  const falhasMes = Math.round(cartoesAtivos * (taxaFalha / 100))
  
  //Calcular impactos do modelo FÍSICO
  const co2FisicoMes = falhasMes * CO2_POR_CARTAO_FISICO
  const custoFisicoMes = falhasMes * CUSTO_REEMISSAO_FISICO
  const plasticoFisicoMes = falhasMes * PESO_PLASTICO_POR_CARTAO
  
  //Calcular custo do modelo DIGITAL
  const custoDigitalOperacional = falhasMes * CUSTO_OPERACIONAL_DIGITAL
  
  //Calcular benefícios da migração Digital vs Físico
  const co2Evitado = co2FisicoMes // No digital, CO₂ é zero
  const economiaFinanceira = custoFisicoMes - custoDigitalOperacional
  
  return {
    falhasMes,
    co2FisicoMes,
    custoFisicoMes,
    plasticoFisicoMes,
    custoDigitalOperacional,
    co2Evitado,
    economiaFinanceira,
  }
}