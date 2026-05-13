// Tipos TypeScript para a Linha do Tempo

/**
 * Dados de impacto acumulado
 */
export interface ImpactoAcumulado {
  days: number
  totalKgCO2: number
  message: string
}

/**
 * Resposta completa da API
 */
export interface DadosImpacto {
  userId: string
  startDate: string
  accumulatedImpact: ImpactoAcumulado
}

/**
 * Estado do formulário
 */
export interface FormularioState {
  userId: string
  startDate: string
}

/**
 * Props do componente de formulário
 */
export interface FormularioImpactoProps {
  onSubmit: (dados: FormularioState) => void
  loading: boolean
}

/**
 * Props do componente de resultados
 */
export interface ResultadosImpactoProps {
  dados: DadosImpacto
}

/**
 * Props do card de métrica de impacto
 */
export interface CardMetricaImpactoProps {
  icone: React.ElementType
  label: string
  valor: string | number
  cor: 'primary' | 'green'
}