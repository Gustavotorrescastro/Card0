'use client'

import { Minus, Plus } from 'lucide-react'

interface ControleValorProps {
  valor: number
  min: number
  max: number
  step: number
  onChange: (valor: number) => void
}

/**
 * Controle de valor unitário por cartão com botões +/-
 */
export default function ControleValor({
  valor,
  min,
  max,
  step,
  onChange,
}: ControleValorProps) {
  const decrementar = () => {
    const novo = Math.max(min, Number((valor - step).toFixed(2)))
    onChange(novo)
  }

  const incrementar = () => {
    const novo = Math.min(max, Number((valor + step).toFixed(2)))
    onChange(novo)
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <label className="text-xs font-black text-[#162056]/60 uppercase tracking-widest">
          Valor por cartão
        </label>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Custo unitário
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={decrementar}
          disabled={valor <= min}
          className="p-3 rounded-2xl bg-[#F5F5F5] hover:bg-[#E2E8F0]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[#162056]"
          aria-label="Diminuir valor"
        >
          <Minus size={18} />
        </button>

        <div className="flex-1 text-center bg-[#F5F5F5]/50 rounded-2xl py-3 border border-[#E2E8F0]/50">
          <span className="text-2xl font-black text-[#162056]">
            R$ {valor.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <button
          onClick={incrementar}
          disabled={valor >= max}
          className="p-3 rounded-2xl bg-[#F5F5F5] hover:bg-[#E2E8F0]/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[#162056]"
          aria-label="Aumentar valor"
        >
          <Plus size={18} />
        </button>
      </div>

      <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
        Mín R$ {min.toFixed(2)} — Máx R$ {max.toFixed(2)}
      </p>
    </div>
  )
}
