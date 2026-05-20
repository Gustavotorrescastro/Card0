'use client'

import { TrendingUp } from 'lucide-react'
import { formatarMoeda } from './calculos'

interface CardCustoTotalProps {
  valor: number
  percentualOperacao: number
}

/**
 * Card de destaque com o custo total da operação física.
 * Inclui um gauge circular grande centralizado com texto explicativo abaixo.
 */
export default function CardCustoTotal({
  valor,
  percentualOperacao,
}: CardCustoTotalProps) {
  // Cálculo do gauge: arco de 180° (semicírculo)
  const percentualLimitado = Math.min(100, Math.max(0, percentualOperacao))
  const raio = 110
  const circunferenciaArco = Math.PI * raio
  const offset =
    circunferenciaArco - (percentualLimitado / 100) * circunferenciaArco

  // Cor do arco baseada no percentual (verde → amarelo → vermelho)
  const corArco =
    percentualLimitado < 40
      ? '#22c55e'
      : percentualLimitado < 70
        ? '#f59e0b'
        : '#ef4444'

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#E2E8F0] shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-[#162056]">
        <TrendingUp size={80} />
      </div>

      <div className="relative z-10">
        <p className="text-xs font-black text-[#162056]/60 uppercase tracking-widest mb-2">
          Custo total da operação
        </p>

        <h3 className="text-4xl font-black text-[#162056] mb-8">
          {formatarMoeda(valor)}
        </h3>

        <div className="pt-6 border-t border-[#F5F5F5]">
          {/* Gauge circular grande centralizado */}
          <div className="flex justify-center">
            <div
              className="relative"
              style={{ width: 260, height: 160 }}
            >
              <svg
                width="260"
                height="160"
                viewBox="0 0 260 160"
                className="overflow-visible"
              >
                {/* Arco de fundo (cinza) */}
                <path
                  d={`M 20 145 A ${raio} ${raio} 0 0 1 240 145`}
                  fill="none"
                  stroke="#F5F5F5"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                {/* Arco preenchido (animado) */}
                <path
                  d={`M 20 145 A ${raio} ${raio} 0 0 1 240 145`}
                  fill="none"
                  stroke={corArco}
                  strokeWidth="22"
                  strokeLinecap="round"
                  strokeDasharray={circunferenciaArco}
                  strokeDashoffset={offset}
                  style={{
                    transition:
                      'stroke-dashoffset 0.8s ease-out, stroke 0.5s',
                  }}
                />
                {/* Marcadores 0% e 100% */}
                <text
                  x="20"
                  y="160"
                  textAnchor="middle"
                  style={{ fontSize: 11, fontWeight: 900, fill: '#94a3b8' }}
                >
                  0%
                </text>
                <text
                  x="240"
                  y="160"
                  textAnchor="middle"
                  style={{ fontSize: 11, fontWeight: 900, fill: '#94a3b8' }}
                >
                  100%
                </text>
              </svg>

              {/* Valor central */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span
                  className="text-5xl font-black leading-none"
                  style={{ color: corArco }}
                >
                  {percentualLimitado.toFixed(1)}%
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                  Da operação
                </span>
              </div>
            </div>
          </div>

          {/* Texto explicativo abaixo do gráfico */}
          <p className="text-sm text-slate-500 font-medium leading-relaxed text-center mt-6 max-w-md mx-auto">
            Os custos totais representam{' '}
            <span className="font-black" style={{ color: corArco }}>
              {percentualLimitado.toFixed(1)}%
            </span>{' '}
            do investimento esperado em operação física no horizonte máximo
            projetado.
          </p>
        </div>
      </div>
    </div>
  )
}
