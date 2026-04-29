import { NextResponse } from 'next/server'

/**
 * Impacto ambiental por dia (em kg de CO₂)
 */
const IMPACTO_POR_DIA_KG_CO2 = 0.5

/**
 * Interface do resultado do cálculo
 */
interface ImpactoAcumulado {
  days: number
  totalKgCO2: number
  message: string
}

/**
 * Calcula o impacto ambiental acumulado desde a data de adesão
 * 
 * @param startDate - Data de início do uso do cartão digital
 * @returns Dados de impacto acumulado
 */
function calcularImpactoAcumulado(startDate: Date): ImpactoAcumulado {
  const agora = new Date()
  
  // Calcula diferença em milissegundos
  const diferencaMs = agora.getTime() - startDate.getTime()
  
  // Converte para dias (arredonda para baixo)
  const diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24))
  
  // Calcula impacto total
  const impactoTotal = diferencaDias * IMPACTO_POR_DIA_KG_CO2

  return {
    days: diferencaDias,
    totalKgCO2: impactoTotal,
    message: `Desde ${startDate.toLocaleDateString('pt-BR')}, você já evitou ${impactoTotal.toFixed(2)} kg de CO₂.`,
  }
}

/**
 * GET /api/linha-do-tempo
 * 
 * Retorna o impacto ambiental acumulado de um usuário
 * 
 * Query params:
 * - userId: ID do usuário
 * - startDate: Data de adesão (formato YYYY-MM-DD)
 */
export async function GET(req: Request) {
  try {
    // Extrai parâmetros da URL
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const startDateParam = searchParams.get('startDate')

    // Validação: parâmetros obrigatórios
    if (!userId || !startDateParam) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: userId e startDate' },
        { status: 400 }
      )
    }

    // Validação: userId não vazio
    if (userId.trim().length === 0) {
      return NextResponse.json(
        { error: 'userId não pode ser vazio' },
        { status: 400 }
      )
    }

    // Parse da data
    const startDate = new Date(startDateParam)

    // Validação: data válida
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Data inválida. Use o formato YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Validação: data não pode ser futura
    const agora = new Date()
    if (startDate > agora) {
      return NextResponse.json(
        { error: 'A data de adesão não pode ser futura' },
        { status: 400 }
      )
    }

    // Calcula o impacto
    const impacto = calcularImpactoAcumulado(startDate)

    // Retorna sucesso
    return NextResponse.json({
      userId,
      startDate: startDateParam,
      accumulatedImpact: impacto,
    })
  } catch (error) {
    // Log do erro (em produção, usar um logger apropriado)
    console.error('Erro ao calcular impacto:', error)

    // Retorna erro genérico
    return NextResponse.json(
      { error: 'Erro interno ao calcular o impacto' },
      { status: 500 }
    )
  }
}