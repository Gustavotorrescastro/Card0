'use client'

interface ControleQuantidadeProps {
  valor: number
  min: number
  max: number
  step: number
  onChange: (valor: number) => void
}

/**
 * Controle de quantidade de cartões via slider
 */
export default function ControleQuantidade({
  valor,
  min,
  max,
  step,
  onChange,
}: ControleQuantidadeProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <label className="text-xs font-black text-[#162056]/60 uppercase tracking-widest">
          Quantidade de cartões
        </label>
        <span className="text-2xl font-black text-[#162056]">
          {valor.toLocaleString('pt-BR')}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-[#F5F5F5] rounded-lg appearance-none cursor-pointer accent-[#F72717]"
      />

      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>{min.toLocaleString('pt-BR')}</span>
        <span>{max.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}
