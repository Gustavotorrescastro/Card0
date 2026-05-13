interface ControleSliderProps {
  label: string
  valor: number
  min: number
  max: number
  step: number
  unidade?: string
  onChange: (novoValor: number) => void
}

/**
 * Componente de controle deslizante (slider) reutilizável
 * 
 * @param label - Texto descritivo do controle
 * @param valor - Valor atual
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @param step - Incremento do slider
 * @param unidade - Unidade de medida (opcional, ex: "%", "kg")
 * @param onChange - Função chamada quando o valor muda
 */
export default function ControleSlider({
  label,
  valor,
  min,
  max,
  step,
  unidade = '',
  onChange,
}: ControleSliderProps) {
  return (
    <div className="bg-gray-50 dark:bg-[#1A1A1A] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between mb-4">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </label>
        <span className="text-2xl font-bold text-brand-primary">
          {valor.toLocaleString('pt-BR')}{unidade}
        </span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
      />
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <span>{min.toLocaleString('pt-BR')}</span>
        <span>{max.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}