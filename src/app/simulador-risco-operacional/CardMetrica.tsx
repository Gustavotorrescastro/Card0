import { LucideIcon } from 'lucide-react' // Lib Icons

interface CardMetricaProps {
  titulo: string
  valor: string | number
  icone: LucideIcon
  corBorda: 'red' | 'orange' | 'green'
  corTexto?: string
}

/**
 * Componente de card para exibir uma métrica
 * 
 * @param titulo - Título da métrica
 * @param valor - Valor a ser exibido
 * @param icone - Ícone do lucide-react
 * @param corBorda - Cor da borda esquerda do card
 * @param corTexto - Cor do texto do valor (opcional)
 */
export default function CardMetrica({
  titulo,
  valor,
  icone: Icone,
  corBorda,
  corTexto,
}: CardMetricaProps) {
  const coresBorda = {
    red: 'border-red-600',
    orange: 'border-orange-500',
    green: 'border-green-500',
  }

  const coresTexto = {
    red: 'text-red-600 dark:text-red-400',
    orange: 'text-orange-600 dark:text-orange-400',
    green: 'text-green-600 dark:text-green-400',
  }

  return (
    <div className={`bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border-l-4 ${coresBorda[corBorda]} shadow-md`}>
      <div className="flex items-center space-x-3 mb-2 text-gray-500 dark:text-gray-400">
        <Icone size={18} />
        <span className="text-xs uppercase font-bold tracking-widest">{titulo}</span>
      </div>
      <div className={`text-3xl font-bold ${corTexto || coresTexto[corBorda]}`}>
        {typeof valor === 'number' ? valor.toLocaleString('pt-BR') : valor}
      </div>
    </div>
  )
}