// Tipos da Calculadora de Custos e Impacto Financeiro

/**
 * Resultado das três camadas de custo do TCO
 */
export interface CamadasTCO {
  custosDiretos: number
  custosIndiretos: number
  custosFalha: number
  custoTotal: number
}

/**
 * Resultado completo do cálculo
 */
export interface ResultadoTCO {
  // Camadas físico
  fisico: CamadasTCO
  // Custo digital total
  digital: number
  // Economia
  economiaAbsoluta: number
  economiaPercentual: number
  // Distribuição percentual das camadas
  percentualDireto: number
  percentualIndireto: number
  percentualFalha: number
}

/**
 * Ponto do gráfico de projeção
 */
export interface PontoProjecao {
  quantidade: number
  tcoFisico: number
  tcoDigital: number
}

/**
 * Estado do formulário
 */
export interface FormularioState {
  quantidadeCartoes: number
  valorPorCartao: number
}

/**
 * Modo de visualização do gráfico de camadas
 */
export type ModoVisualizacao = 'barra' | 'rosca'