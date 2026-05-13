import axios from 'axios'
import { DadosImpacto } from './tipos'

/**
 * Serviço de API para Linha do Tempo
 */
export const linhaDoTempoAPI = {
  /**
   * Busca os dados de impacto acumulado
   * 
   * @param userId - ID do usuário
   * @param startDate - Data de adesão (formato YYYY-MM-DD)
   * @returns Dados de impacto
   * 
   * @throws Error se a requisição falhar
   */
  buscarImpacto: async (
    userId: string, 
    startDate: string
  ): Promise<DadosImpacto> => {
    try {
      const response = await axios.get<DadosImpacto>(
        `/api/linha-do-tempo?userId=${userId}&startDate=${startDate}`
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Erro da API
        const mensagem = error.response?.data?.error || 'Erro ao buscar dados'
        throw new Error(mensagem)
      }
      // Erro genérico
      throw new Error('Erro de conexão com o servidor')
    }
  },
}