import { useState } from 'react'
import { FormularioImpactoProps } from './tipos'
import { CONFIGURACOES_FORMULARIO, TEXTOS_INTERFACE } from './constantes'

/**
 * Componente de formulário para calcular impacto
 */
export default function FormularioImpacto({
  onSubmit,
  loading,
}: FormularioImpactoProps) {
  const [userId, setUserId] = useState('')
  const [startDate, setStartDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ userId, startDate })
  }

  // Data máxima é hoje
  const hoje = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {CONFIGURACOES_FORMULARIO.USER_ID.LABEL}
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder={CONFIGURACOES_FORMULARIO.USER_ID.PLACEHOLDER}
          minLength={CONFIGURACOES_FORMULARIO.USER_ID.MIN_LENGTH}
          maxLength={CONFIGURACOES_FORMULARIO.USER_ID.MAX_LENGTH}
          required
          disabled={loading}
          className="w-full px-4 py-3 bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {CONFIGURACOES_FORMULARIO.DATA_ADESAO.LABEL}
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={CONFIGURACOES_FORMULARIO.DATA_ADESAO.MIN_DATE}
          max={hoje}
          required
          disabled={loading}
          className="w-full px-4 py-3 bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="md:col-span-2 w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? TEXTOS_INTERFACE.BOTAO_CALCULANDO : TEXTOS_INTERFACE.BOTAO_CALCULAR}
      </button>
    </form>
  )
}