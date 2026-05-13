'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { ResultadoTCO, ModoVisualizacao } from './tipos'
import { formatarMoeda, formatarMoedaAbreviada } from './calculos'

interface GraficoCamadasProps {
  resultado: ResultadoTCO
}

const CORES = {
  diretos: '#1c2241',
  indiretos: '#2f56a3',
  falha: '#91d0d1',
}

/**
 * Gráfico que mostra como o custo total é formado por camadas (TCO).
 * Permite alternar entre barra empilhada e gráfico de rosca.
 */
export default function GraficoCamadas({ resultado }: GraficoCamadasProps) {
  const [modo, setModo] = useState<ModoVisualizacao>('barra')

  // Dados para o gráfico de barra empilhada (uma única coluna)
  const dadosBarra = [
    {
      name: 'TCO',
      'Custos diretos': resultado.fisico.custosDiretos,
      'Custos indiretos': resultado.fisico.custosIndiretos,
      'Custos de falha': resultado.fisico.custosFalha,
    },
  ]

  // Dados para o gráfico de rosca
  const dadosRosca = [
    {
      name: 'Custos diretos',
      value: resultado.fisico.custosDiretos,
      cor: CORES.diretos,
    },
    {
      name: 'Custos indiretos',
      value: resultado.fisico.custosIndiretos,
      cor: CORES.indiretos,
    },
    {
      name: 'Custos de falha',
      value: resultado.fisico.custosFalha,
      cor: CORES.falha,
    },
  ]

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#c7e6ed] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black text-[#1c2241]/60 uppercase tracking-widest mb-1">
            Composição do custo
          </p>
          <h3 className="text-lg font-black text-[#1c2241] uppercase tracking-tight">
            Como o custo total é formado
          </h3>
        </div>

        <button
          onClick={() => setModo(modo === 'barra' ? 'rosca' : 'barra')}
          className="p-3 rounded-2xl bg-[#f6edee] hover:bg-[#c7e6ed]/30 transition-colors text-[#1c2241]"
          aria-label={`Alternar para gráfico de ${modo === 'barra' ? 'rosca' : 'barra'}`}
          title={`Ver como gráfico de ${modo === 'barra' ? 'rosca' : 'barra'}`}
        >
          {modo === 'barra' ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {modo === 'barra' ? (
            <BarChart data={dadosBarra} layout="vertical" margin={{ left: 0 }}>
              <XAxis
                type="number"
                tickFormatter={formatarMoedaAbreviada}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip
                formatter={(value: number) => formatarMoeda(value)}
                contentStyle={{ borderRadius: '15px', border: 'none' }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
              />
              <Bar
                dataKey="Custos diretos"
                stackId="a"
                fill={CORES.diretos}
                radius={[6, 0, 0, 6]}
              />
              <Bar
                dataKey="Custos indiretos"
                stackId="a"
                fill={CORES.indiretos}
              />
              <Bar
                dataKey="Custos de falha"
                stackId="a"
                fill={CORES.falha}
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={dadosRosca}
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
              >
                {dadosRosca.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatarMoeda(value)}
                contentStyle={{ borderRadius: '15px', border: 'none' }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legenda lateral com percentuais */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#f6edee]">
        <div className="text-center">
          <div
            className="w-3 h-3 rounded-full mx-auto mb-1"
            style={{ backgroundColor: CORES.diretos }}
          />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Diretos
          </p>
          <p className="text-sm font-black text-[#1c2241]">
            {resultado.percentualDireto.toFixed(0)}%
          </p>
        </div>
        <div className="text-center">
          <div
            className="w-3 h-3 rounded-full mx-auto mb-1"
            style={{ backgroundColor: CORES.indiretos }}
          />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Indiretos
          </p>
          <p className="text-sm font-black text-[#1c2241]">
            {resultado.percentualIndireto.toFixed(0)}%
          </p>
        </div>
        <div className="text-center">
          <div
            className="w-3 h-3 rounded-full mx-auto mb-1"
            style={{ backgroundColor: CORES.falha }}
          />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Falha
          </p>
          <p className="text-sm font-black text-[#1c2241]">
            {resultado.percentualFalha.toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  )
}
