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
    <div className="bg-white p-6 rounded-3xl border border-[#c7e6ed] shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <label className="text-xs font-black text-[#1c2241]/60 uppercase tracking-widest">
          Quantidade de cartões
        </label>
        <span className="text-2xl font-black text-[#1c2241]">
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
        className="w-full h-2 bg-[#f6edee] rounded-lg appearance-none cursor-pointer accent-[#2f56a3]"
      />

      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>{min.toLocaleString('pt-BR')}</span>
        <span>{max.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}
