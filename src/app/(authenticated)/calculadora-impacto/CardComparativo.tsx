'use client'

import { TrendingDown, Sparkles } from 'lucide-react'
import { ResultadoTCO } from './tipos'
import { formatarMoeda } from './calculos'

interface CardComparativoProps {
  resultado: ResultadoTCO
}

/**
 * Card comparativo: Cartão Físico vs Cartão Digital.
 * Mostra também a economia potencial em % e R$.
 */
export default function CardComparativo({ resultado }: CardComparativoProps) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#c7e6ed] shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-black text-[#1c2241]/60 uppercase tracking-widest mb-1">
          Comparativo final
        </p>
        <h3 className="text-lg font-black text-[#1c2241] uppercase tracking-tight">
          Físico vs Digital
        </h3>
      </div>

      {/* Comparativo: duas colunas iguais com VS no meio */}
      <div className="flex items-stretch gap-3 mb-6">
        {/* Físico */}
        <div className="flex-1 min-w-0 bg-[#1c2241] p-5 rounded-3xl text-white">
          <p className="text-[10px] font-black text-[#91d0d1] uppercase tracking-widest mb-2 truncate">
            Cartão físico (TCO)
          </p>
          <p className="text-lg lg:text-xl font-black leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {formatarMoeda(resultado.fisico.custoTotal)}
          </p>
        </div>

        {/* VS */}
        <div className="flex items-center justify-center px-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            VS
          </span>
        </div>

        {/* Digital */}
        <div className="flex-1 min-w-0 bg-[#91d0d1]/20 p-5 rounded-3xl border-2 border-[#91d0d1]">
          <p className="text-[10px] font-black text-[#2f56a3] uppercase tracking-widest mb-2 truncate">
            Cartão digital (estimado)
          </p>
          <p className="text-lg lg:text-xl font-black text-[#1c2241] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {formatarMoeda(resultado.digital)}
          </p>
        </div>
      </div>

      {/* Economia */}
      <div className="bg-gradient-to-br from-green-500/10 to-[#91d0d1]/20 p-6 rounded-3xl border border-green-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500/20 rounded-2xl shrink-0">
            <Sparkles size={24} className="text-green-700" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-green-800 uppercase tracking-widest mb-2">
              Economia potencial com solução digital
            </p>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <div className="flex items-baseline gap-2">
                <TrendingDown size={20} className="text-green-700" />
                <span className="text-3xl font-black text-green-700">
                  {resultado.economiaPercentual.toFixed(1)}%
                </span>
              </div>

              <span className="text-slate-400 font-bold">|</span>

              <span className="text-xl font-black text-[#1c2241] break-words">
                {formatarMoeda(resultado.economiaAbsoluta)}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
              Valor economizado ao migrar a operação atual para a solução
              digital.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
