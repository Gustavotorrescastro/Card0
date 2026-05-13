'use client'

import { Leaf, BarChart3, PieChart as PieIcon } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts'

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
  return (
    <div className="p-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* SEÇÃO DE PROPÓSITO */}
        <section className="bg-white p-10 rounded-[3rem] border border-[#c7e6ed] shadow-sm flex flex-col md:flex-row items-center gap-10">
          <div className="w-40 h-40 bg-[#1c2241] rounded-full flex items-center justify-center text-[#91d0d1] shadow-2xl shrink-0">
             <Leaf size={64} />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-black text-[#1c2241] uppercase tracking-tighter">O Propósito do Card0</h2>
              <div className="w-4 h-4 bg-slate-200 rounded-sm hidden md:block" /> {/* Elemento decorativo da imagem */}
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-3xl">
              A plataforma Card0 foi desenvolvida para oferecer transparência total sobre o impacto ambiental e financeiro da sua operação de cartões. Nosso objetivo é capacitar gestores com dados precisos para a transição do físico para o digital, reduzindo a pegada de carbono e otimizando a eficiência operacional através de simuladores inteligentes e análises em tempo real.
            </p>
          </div>
        </section>

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
    </div>
  )
}