// Constantes da Linha do Tempo

/**
 * Impacto ambiental por dia de uso do cartão digital (em kg de CO₂)
 * Baseado em: evitar produção e logística de cartão físico
 */
export const IMPACTO_POR_DIA_KG_CO2 = 0.5

/**
 * Configurações dos campos do formulário
 */
export const CONFIGURACOES_FORMULARIO = {
  USER_ID: {
    LABEL: 'ID do Usuário',
    PLACEHOLDER: 'Digite seu ID',
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
  },
  DATA_ADESAO: {
    LABEL: 'Data de Adesão',
    MIN_DATE: '2020-01-01', // Data mínima permitida
  },
}

/**
 * Mensagens de erro
 */
export const MENSAGENS_ERRO = {
  CALCULO_FALHOU: 'Falha ao calcular o impacto. Verifique os dados informados.',
  CAMPOS_OBRIGATORIOS: 'Preencha todos os campos obrigatórios.',
  DATA_INVALIDA: 'Data inválida. Não pode ser uma data futura.',
  USER_ID_INVALIDO: 'ID do usuário deve ter entre 3 e 50 caracteres.',
}

/**
 * Mensagens de sucesso
 */
export const MENSAGENS_SUCESSO = {
  CALCULADO: 'Impacto calculado com sucesso!',
}

/**
 * Labels e textos da interface
 */
export const TEXTOS_INTERFACE = {
  TITULO: 'Linha do Tempo de Impacto',
  SUBTITULO: 'Rastreie sua jornada sustentável.',
  BOTAO_CALCULAR: 'Ver Impacto',
  BOTAO_CALCULANDO: 'Calculando...',
  LABEL_DIAS: 'Dias',
  LABEL_CO2_EVITADO: 'CO₂ Evitado',
}