import { CardMetricaImpactoProps } from './tipos'

/**
 * Componente de card para exibir uma métrica de impacto
 * 
 * @param icone - Componente de ícone (ex: Calendar, Leaf)
 * @param label - Texto descritivo da métrica
 * @param valor - Valor a ser exibido
 * @param cor - Cor do tema ('primary' ou 'green')
 */
export default function CardMetricaImpacto({
  icone: Icone,
  label,
  valor,
  cor,
}: CardMetricaImpactoProps) {
  const coresIcone = {
    primary: 'bg-brand-primary/10 text-brand-primary',
    green: 'bg-green-500/10 text-green-500',
  }

  const coresValor = {
    primary: 'text-gray-900 dark:text-white',
    green: 'text-green-600 dark:text-green-500',
  }

  return (
    <div className="bg-white dark:bg-[#252525] p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${coresIcone[cor]}`}>
        <Icone size={28} />
      </div>
      <div>
        <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
          {label}
        </span>
        <span className={`text-3xl font-black ${coresValor[cor]}`}>
          {typeof valor === 'number' ? valor.toLocaleString('pt-BR') : valor}
        </span>
      </div>
    </div>
  )
}