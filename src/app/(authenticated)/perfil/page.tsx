'use client'

import { useState } from 'react'
import { User, Mail, Shield, MapPin, Edit2, Leaf, X, Save, LogOut, CalendarDays } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

export default function PerfilPage() {
  const { profile, updateProfile } = useUser()
  const router = useRouter()

  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({ ...profile })

  const abrirEdicao = () => {
    setFormData({ ...profile })
    setEditando(true)
  }

  const salvar = () => {
    updateProfile(formData)
    setEditando(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userProfile')
    router.push('/login')
  }

  return (
    <div className="space-y-8 pb-16 w-full px-1 md:px-0 font-sans">

      {/* ===== MODAL EDITAR PERFIL ===== */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-brand-border w-full max-w-md p-8 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-brand-secondary uppercase tracking-tight">Editar Perfil</h2>
              <button onClick={() => setEditando(false)} className="text-slate-400 hover:text-brand-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Nome Completo', key: 'name', type: 'text' },
                { label: 'E-mail', key: 'email', type: 'email' },
                { label: 'Empresa', key: 'empresa', type: 'text' },
                { label: 'Data de Nascimento', key: 'dataNascimento', type: 'text', placeholder: 'dd/mm/aa' },
                { label: 'Localização', key: 'localizacao', type: 'text' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{label}</label>
                  <input
                    type={type}
                    value={formData[key as keyof typeof formData]}
                    placeholder={placeholder}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditando(false)}
                className="flex-1 border border-slate-200 text-slate-500 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                className="flex-1 bg-brand-secondary text-white py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Save size={14} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CARD DE PERFIL ===== */}
      <div className="bg-brand-surface rounded-3xl shadow-sm border border-brand-border overflow-hidden">
        {/* Capa */}
        <div className="h-32 bg-gradient-to-r from-brand-secondary to-brand-tertiary" />

        <div className="px-10 pb-10">
          <div className="relative -top-12 flex items-end justify-between">
            {/* Avatar */}
            <div className="bg-[#F0F2F5] p-2 rounded-3xl">
              <div className="bg-brand-secondary w-32 h-32 rounded-2xl flex items-center justify-center text-brand-tertiary">
                <User size={64} />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={abrirEdicao}
                className="bg-brand-secondary text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg text-xs uppercase tracking-wider"
              >
                <Edit2 size={14} /> Editar Perfil
              </button>
              <button
                onClick={handleLogout}
                className="bg-brand-primary text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg text-xs uppercase tracking-wider"
                title="Sair da conta"
              >
                <LogOut size={14} /> Sair
              </button>
            </div>
          </div>

          {/* Nome e cargo */}
          <div className="mt-4">
            <h1 className="text-2xl font-black text-brand-secondary uppercase tracking-tight">{profile.name}</h1>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">Administrador de Sustentabilidade</p>
          </div>

          {/* Cards de informação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <InfoCard
              icon={<Mail className="text-brand-secondary" size={18} />}
              label="E-mail Corporativo"
              value={profile.email}
            />
            <InfoCard
              icon={<Shield className="text-brand-secondary" size={18} />}
              label="Empresa"
              value={profile.empresa}
            />
            <InfoCard
              icon={<CalendarDays className="text-brand-secondary" size={18} />}
              label="Data de Nascimento"
              value={profile.dataNascimento}
            />
            <InfoCard
              icon={<MapPin className="text-brand-secondary" size={18} />}
              label="Localização"
              value={profile.localizacao}
            />
            <InfoCard
              icon={<Leaf className="text-brand-primary" size={18} />}
              label="Impacto Acumulado"
              value="1.2t CO₂ evitado"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
      <div className="p-3 bg-white rounded-2xl shadow-sm shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-brand-secondary leading-tight truncate">{value}</p>
      </div>
    </div>
  )
}
