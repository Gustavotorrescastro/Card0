import { CONFIGURACOES_FORMULARIO, MENSAGENS_ERRO } from './constantes'

/**
 * Resultado da validação
 */
interface ResultadoValidacao {
  valido: boolean
  erro?: string
}

/**
 * Valida o ID do usuário
 * 
 * @param userId - ID do usuário a ser validado
 * @returns Resultado da validação
 */
export function validarUserId(userId: string): ResultadoValidacao {
  if (!userId || userId.trim().length === 0) {
    return { 
      valido: false, 
      erro: MENSAGENS_ERRO.CAMPOS_OBRIGATORIOS 
    }
  }

  if (userId.length < CONFIGURACOES_FORMULARIO.USER_ID.MIN_LENGTH) {
    return { 
      valido: false, 
      erro: MENSAGENS_ERRO.USER_ID_INVALIDO 
    }
  }

  if (userId.length > CONFIGURACOES_FORMULARIO.USER_ID.MAX_LENGTH) {
    return { 
      valido: false, 
      erro: MENSAGENS_ERRO.USER_ID_INVALIDO 
    }
  }

  return { valido: true }
}

/**
 * Valida a data de adesão
 * 
 * @param startDate - Data de adesão em formato string (YYYY-MM-DD)
 * @returns Resultado da validação
 */
export function validarDataAdesao(startDate: string): ResultadoValidacao {
  if (!startDate || startDate.trim().length === 0) {
    return { 
      valido: false, 
      erro: MENSAGENS_ERRO.CAMPOS_OBRIGATORIOS 
    }
  }

  const dataAdesao = new Date(startDate)
  const hoje = new Date()

  // Zera as horas para comparar só a data
  hoje.setHours(0, 0, 0, 0)
  dataAdesao.setHours(0, 0, 0, 0)

  // Não pode ser data futura
  if (dataAdesao > hoje) {
    return { 
      valido: false, 
      erro: MENSAGENS_ERRO.DATA_INVALIDA 
    }
  }

  // Verifica data mínima
  const dataMinima = new Date(CONFIGURACOES_FORMULARIO.DATA_ADESAO.MIN_DATE)
  if (dataAdesao < dataMinima) {
    return { 
      valido: false, 
      erro: `Data deve ser posterior a ${dataMinima.toLocaleDateString('pt-BR')}` 
    }
  }

  return { valido: true }
}

/**
 * Valida todo o formulário
 * 
 * @param userId - ID do usuário
 * @param startDate - Data de adesão
 * @returns Resultado da validação
 */
export function validarFormulario(
  userId: string, 
  startDate: string
): ResultadoValidacao {
  // Valida userId
  const resultadoUserId = validarUserId(userId)
  if (!resultadoUserId.valido) {
    return resultadoUserId
  }

  // Valida data
  const resultadoData = validarDataAdesao(startDate)
  if (!resultadoData.valido) {
    return resultadoData
  }

  return { valido: true }
}
