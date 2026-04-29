import { useState } from 'react'
import { DadosImpacto, FormularioState } from './tipos'
import { validarFormulario } from './validacoes'
import { linhaDoTempoAPI } from './api'
import { MENSAGENS_ERRO } from './constantes'

/**
 * Custom hook para gerenciar o estado da Linha do Tempo
 */
export function useLinhaDoTempo() {
  const [impactData, setImpactData] = useState<DadosImpacto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Calcula o impacto com base nos dados do formulário
   */
  const calcularImpacto = async (dados: FormularioState) => {
    // Limpa erros anteriores
    setError('')

    // Valida o formulário
    const validacao = validarFormulario(dados.userId, dados.startDate)
    if (!validacao.valido) {
      setError(validacao.erro || MENSAGENS_ERRO.CAMPOS_OBRIGATORIOS)
      return
    }

    setLoading(true)

    try {
      const resultado = await linhaDoTempoAPI.buscarImpacto(
        dados.userId,
        dados.startDate
      )
      setImpactData(resultado)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(MENSAGENS_ERRO.CALCULO_FALHOU)
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Limpa os dados e erros
   */
  const limpar = () => {
    setImpactData(null)
    setError('')
  }

  return {
    impactData,
    loading,
    error,
    calcularImpacto,
    limpar,
  }
}