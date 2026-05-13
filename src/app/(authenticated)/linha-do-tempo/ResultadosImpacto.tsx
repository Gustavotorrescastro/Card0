import { Calendar, Leaf } from 'lucide-react'
import { ResultadosImpactoProps } from './tipos'
import { TEXTOS_INTERFACE } from './constantes'
import CardMetricaImpacto from './CardMetricaImpacto'

/**
 * Componente que exibe os resultados do cálculo de impacto
 */
export default function ResultadosImpacto({ dados }: ResultadosImpactoProps) {
  return (
    <div className="mt-12 space-y-6">
      {/* Mensagem de impacto */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
        <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
          {dados.accumulatedImpact.message}
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardMetricaImpacto
          icone={Calendar}
          label={TEXTOS_INTERFACE.LABEL_DIAS}
          valor={dados.accumulatedImpact.days}
          cor="primary"
        />

        <CardMetricaImpacto
          icone={Leaf}
          label={TEXTOS_INTERFACE.LABEL_CO2_EVITADO}
          valor={`${dados.accumulatedImpact.totalKgCO2.toFixed(2)} kg`}
          cor="green"
        />
      </div>

      {/* Informação adicional */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Desde {new Date(dados.startDate).toLocaleDateString('pt-BR')}
      </div>
    </div>
  )
}