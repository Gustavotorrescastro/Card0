'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BriefcaseBusiness,
  CalendarDays,
  Edit2,
  LogOut,
  Mail,
  MapPin,
  Save,
  User,
  X,
} from 'lucide-react'
import { useUser } from '@/context/UserContext'

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
    <div className="w-full pb-16 font-sans text-black">
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black">Editar Perfil</h2>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#ffe5e5] text-[#ff2b1d] transition-all hover:bg-[#ff2b1d] hover:text-white"
                aria-label="Fechar edição"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Nome Completo', key: 'name', type: 'text' },
                { label: 'E-mail', key: 'email', type: 'email' },
                { label: 'Empresa', key: 'empresa', type: 'text' },
                { label: 'Data de Nascimento', key: 'dataNascimento', type: 'text', placeholder: 'dd/mm/aa' },
                { label: 'Localização', key: 'localizacao', type: 'text' },
              ].map(({ label, key, type, placeholder }) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-xs font-black text-slate-500">{label}</span>
                  <input
                    type={type}
                    value={formData[key as keyof typeof formData]}
                    placeholder={placeholder}
                    onChange={(event) => setFormData({ ...formData, [key]: event.target.value })}
                    className="h-12 w-full rounded-2xl border border-[#ffb4ae] bg-[#fff7f7] px-4 text-sm font-semibold outline-none transition-all focus:border-[#ff2b1d] focus:ring-2 focus:ring-[#ff2b1d]/20"
                  />
                </label>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="rounded-2xl border border-slate-200 py-3 text-sm font-black text-slate-500 transition-all hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={salvar}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff2b1d] py-3 text-sm font-black text-white transition-all hover:bg-[#e51f13]"
              >
                <Save size={16} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-[1040px] overflow-hidden rounded-2xl bg-white shadow-[0_14px_32px_rgba(0,0,0,0.22)]">
        <div className="h-[168px] rounded-b-2xl bg-[#ffd2cf]" />

        <div className="px-10 pb-20">
          <div className="relative -mt-[134px] flex min-h-[170px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col items-start">
              <div className="grid h-[190px] w-[190px] place-items-center rounded-full bg-black text-white">
                <div className="grid h-[158px] w-[158px] place-items-center rounded-full bg-white text-black">
                  <User size={128} fill="black" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-4 md:justify-end">
              <button
                type="button"
                onClick={abrirEdicao}
                className="inline-flex h-9 items-center gap-3 rounded-full bg-[#ffb4ae] px-6 text-sm font-black shadow-[0_8px_18px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#ff9f98]"
              >
                <Edit2 size={20} />
                Editar Perfil
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-9 items-center gap-3 rounded-full bg-[#ff2b1d] px-6 text-sm font-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#e51f13]"
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>

          <div className="mt-2 pl-4">
            <h1 className="text-[32px] font-black uppercase leading-none tracking-tight">{profile.name}</h1>
            <p className="mt-2 text-base font-medium text-[#555]">Administrador de Sustentabilidade</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-14 gap-y-12 px-0 md:grid-cols-2 md:px-1">
            <InfoCard icon={<Mail size={34} />} label="E-mail Corporativo" value={profile.email} />
            <InfoCard icon={<BriefcaseBusiness size={34} />} label="Empresa" value={profile.empresa} />
            <InfoCard icon={<CalendarDays size={34} />} label="Data de Nascimento" value={profile.dataNascimento} />
            <InfoCard icon={<MapPin size={34} />} label="Localização" value={profile.localizacao} />
          </div>

          <div className="mt-16 flex justify-center">
            <div className="relative flex min-h-[205px] w-full max-w-[530px] items-center justify-center overflow-hidden rounded-xl bg-[#f7fac5] p-8 text-center shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
              <LeafPattern />
              <div className="relative z-10">
                <p className="text-xl font-medium">Impacto acumulado</p>
                <strong className="mt-7 block text-[32px] font-black">1,2t CO₂ evitado</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-[82px] items-center gap-5 rounded-xl bg-white px-5 py-4 shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
      <div className="text-[#f0442b]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-base font-medium text-[#555]">{label}</p>
        <p className="truncate text-lg font-medium text-black">{value}</p>
      </div>
    </div>
  )
}

function LeafPattern() {
  return (
    <div className="absolute inset-0 opacity-30">
      {Array.from({ length: 28 }).map((_, index) => {
        const left = (index * 17) % 100
        const top = (index * 31) % 100
        return (
          <svg
            key={index}
            className="absolute h-20 w-20 text-[#dce861]"
            style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${index * 24}deg)` }}
            viewBox="0 0 80 80"
            fill="none"
          >
            <path
              d="M14 45C14 24 32 14 64 14C64 46 54 66 32 66C20 66 14 58 14 45Z"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path d="M24 56C36 43 48 31 62 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )
      })}
    </div>
  )
}
