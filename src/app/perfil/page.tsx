'use client'

import { User, Mail, Shield, MapPin, Edit2, Leaf } from 'lucide-react' // Adicionado Leaf aqui
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function PerfilPage() {
  return (
    <div className="flex min-h-screen bg-[#f6edee]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="p-8 max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-[3rem] shadow-xl border border-[#c7e6ed] overflow-hidden">
            {/* Capa do Perfil */}
            <div className="h-32 bg-gradient-to-r from-[#1c2241] to-[#2f56a3]" />
            
            <div className="px-10 pb-10">
              <div className="relative -top-12 flex items-end justify-between">
                <div className="bg-[#f6edee] p-2 rounded-[2.5rem]">
                  <div className="bg-[#1c2241] w-32 h-32 rounded-[2rem] flex items-center justify-center text-[#91d0d1]">
                    <User size={64} />
                  </div>
                </div>
                <button className="bg-[#1c2241] text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:opacity-90 transition-all shadow-lg">
                  <Edit2 size={18} /> Editar Perfil
                </button>
              </div>

              <div className="mt-4">
                <h1 className="text-3xl font-black text-[#1c2241] uppercase tracking-tighter">Usuário Gestor</h1>
                <p className="text-slate-500 font-medium">Administrador de Sustentabilidade</p>
              </div>

              {/* Cards de Informação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <InfoCard 
                  icon={<Mail className="text-[#2f56a3]" />} 
                  label="E-mail Corporativo" 
                  value="gestor@card0.com.br" 
                />
                <InfoCard 
                  icon={<Shield className="text-[#2f56a3]" />} 
                  label="Nível de Acesso" 
                  value="Administrador Master" 
                />
                <InfoCard 
                  icon={<MapPin className="text-[#2f56a3]" />} 
                  label="Localização" 
                  value="Recife, Pernambuco" 
                />
                <InfoCard 
                  icon={<Leaf className="text-[#15803d]" size={20} />} 
                  label="Impacto Acumulado" 
                  value="1.2t CO₂ evitado" 
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Subcomponente de Card para organizar o código
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-6 bg-[#f6edee]/50 rounded-3xl border border-[#c7e6ed]">
      <div className="p-3 bg-white rounded-2xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-lg font-bold text-[#1c2241] leading-tight">{value}</p>
      </div>
    </div>
  )
}