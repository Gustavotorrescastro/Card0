'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { PontoProjecao } from './tipos'
import { formatarMoeda, formatarMoedaAbreviada } from './calculos'

interface GraficoProjecaoProps {
  pontos: PontoProjecao[]
  quantidadeAtual: number
}

/**
 * Gráfico de linha mostrando como o TCO cresce com o tamanho da operação.
 */
export default function GraficoProjecao({
  pontos,
  quantidadeAtual,
}: GraficoProjecaoProps) {
  // Encontra o ponto mais próximo da quantidade atual para destacar
  const pontoAtual = pontos.reduce((prev, curr) =>
    Math.abs(curr.quantidade - quantidadeAtual) <
    Math.abs(prev.quantidade - quantidadeAtual)
      ? curr
      : prev
  )

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#c7e6ed] shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-black text-[#1c2241]/60 uppercase tracking-widest mb-1">
          Projeção de crescimento
        </p>
        <h3 className="text-lg font-black text-[#1c2241] uppercase tracking-tight">
          Impacto do crescimento da operação
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Como o TCO cresce de acordo com a quantidade de cartões emitidos.
        </p>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pontos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="quantidade"
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatarMoedaAbreviada}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value, name) => {
                const numero =
                  typeof value === "number"
                    ? value
                    : Number(value ?? 0);

                const nome = String(name);

                return [
                  formatarMoeda(numero),
                  nome === "tcoFisico" ? "Físico" : "Digital",
                ];
              }}
            />
            <Line
              type="monotone"
              dataKey="tcoFisico"
              stroke="#1c2241"
              strokeWidth={3}
              dot={{ fill: '#1c2241', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="tcoDigital"
              stroke="#91d0d1"
              strokeWidth={3}
              dot={{ fill: '#91d0d1', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <ReferenceDot
              x={pontoAtual.quantidade}
              y={pontoAtual.tcoFisico}
              r={8}
              fill="#2f56a3"
              stroke="white"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[#f6edee]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1c2241]" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Físico
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#91d0d1]" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Digital
          </span>
        </div>
      </div>
    </div>
  )
}
