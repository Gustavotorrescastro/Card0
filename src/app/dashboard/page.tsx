'use client'

import { useState } from 'react'
import { Leaf, BarChart3, PieChart as PieIcon } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header' // Importação do Header padronizado

// Dados para os gráficos
const emissaoData = [
  { name: 'Jan', físico: 400, digital: 40 },
  { name: 'Fev', físico: 300, digital: 30 },
  { name: 'Mar', físico: 600, digital: 60 },
  { name: 'Abr', físico: 800, digital: 80 },
  { name: 'Mai', físico: 500, digital: 50 },
]

const materiaPrimaData = [
  { name: 'Plástico (PVC)', value: 45, color: '#1c2241' },
  { name: 'Papel/Envio', value: 25, color: '#2f56a3' },
  { name: 'Metais (Chip)', value: 20, color: '#3b6fb5' },
  { name: 'Outros', value: 10, color: '#91d0d1' },
]

export default function Dashboard() {
  const co2 = 1200 
  const staticTreePercentage = 100 

  return (
    <div className="flex min-h-screen bg-[#f6edee]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER PADRONIZADO (Igual às outras páginas) */}
        <Header />

        <main className="p-8 overflow-y-auto space-y-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* TOPO: STATUS E ÁRVORE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* Coluna 1: Stats Rápidos */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[2rem] border border-[#c7e6ed] shadow-sm">
                  <p className="text-xs font-black text-[#1c2241]/40 uppercase tracking-widest mb-1">Impacto Total</p>
                  <h3 className="text-3xl font-black text-[#1c2241]">{co2} <span className="text-sm font-normal">kg CO₂</span></h3>
                  <div className="mt-4 h-2 w-full bg-[#f6edee] rounded-full overflow-hidden">
                    <div className="h-full bg-[#22c55e]" style={{ width: `60%` }} />
                  </div>
                </div>
                
                <div className="bg-[#1c2241] p-6 rounded-[2rem] text-white shadow-xl">
                   <div className="flex items-center gap-3 mb-2 text-[#91d0d1]">
                    <Leaf size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Compromisso</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    Sua empresa está operando com eficiência ambiental positiva este mês.
                  </p>
                </div>
              </div>

              {/* Coluna 2: ÁRVORE DETALHADA ESTÁTICA */}
              <div className="relative flex flex-col items-center justify-center min-h-[400px]">
                <div className="absolute w-80 h-80 bg-[#22c55e]/10 blur-[100px] rounded-full" />
                
                <svg width="400" height="400" viewBox="0 0 200 200" className="drop-shadow-2xl">
                  <path d="M80 190 Q100 185 120 190" stroke="#3f2e2e" strokeWidth="2" fill="none" />
                  <path d="M95 185 Q100 150 90 100 Q100 120 110 100 Q105 150 105 185 Z" fill="#3f2e2e" />

                  <g stroke="#3f2e2e" strokeWidth="3" fill="none" strokeLinecap="round">
                    <path d="M95 140 Q70 120 50 130" className="opacity-80" />
                    <path d="M105 130 Q130 110 150 120" className="opacity-80" />
                    <path d="M100 110 Q90 80 70 70" className="opacity-80" />
                    <path d="M100 110 Q110 80 130 75" className="opacity-80" />
                  </g>

                  <g style={{ transform: `scale(${0.5 + (staticTreePercentage/150)})`, transformOrigin: 'bottom' }}>
                    <circle cx="70" cy="80" r="25" fill="#166534" opacity="0.6" />
                    <circle cx="130" cy="85" r="22" fill="#166534" opacity="0.6" />
                    <circle cx="100" cy="65" r="30" fill="#15803d" />
                    <circle cx="75" cy="110" r="20" fill="#15803d" />
                    <circle cx="125" cy="105" r="20" fill="#15803d" />
                    <circle cx="95" cy="60" r="15" fill="#22c55e" opacity="0.8" />
                    <circle cx="115" cy="75" r="12" fill="#91d0d1" opacity="0.4" />
                  </g>

                  <g fill="#91d0d1">
                    <circle cx="85" cy="70" r="3" />
                    <circle cx="115" cy="60" r="3" />
                    <circle cx="100" cy="90" r="3" />
                  </g>
                </svg>

                <div className="absolute bottom-4 bg-[#1c2241] px-6 py-1.5 rounded-full border border-[#91d0d1]/30">
                  <span className="text-[10px] font-black text-[#91d0d1] uppercase tracking-[0.3em]">Reserva de Carbono</span>
                </div>
              </div>

              {/* Coluna 3: Info Secundária */}
              <div className="bg-white/60 p-8 rounded-[2.5rem] border border-white flex flex-col justify-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-1 bg-[#91d0d1] rounded-full" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Ar Economizado</p>
                    <p className="text-xl font-black text-[#1c2241]">12.4M m³</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-1 bg-[#2f56a3] rounded-full" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Energia Poupada</p>
                    <p className="text-xl font-black text-[#1c2241]">450 kWh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO DE GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-[#c7e6ed] shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 className="text-[#2f56a3]" size={24} />
                  <h3 className="text-lg font-black text-[#1c2241] uppercase tracking-tight">Emissões: Físico vs Digital</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={emissaoData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '15px', border: 'none' }} />
                      <Bar dataKey="físico" fill="#1c2241" radius={[6, 6, 0, 0]} barSize={20} />
                      <Bar dataKey="digital" fill="#91d0d1" radius={[6, 6, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-[#c7e6ed] shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <PieIcon className="text-[#2f56a3]" size={24} />
                  <h3 className="text-lg font-black text-[#1c2241] uppercase tracking-tight">Uso de Matérias-Primas</h3>
                </div>
                <div className="h-[300px] w-full flex flex-col md:flex-row items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={materiaPrimaData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {materiaPrimaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="w-full md:w-64 space-y-3">
                    {materiaPrimaData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-bold text-slate-500">{item.name}</span>
                        </div>
                        <span className="text-xs font-black text-[#1c2241]">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}