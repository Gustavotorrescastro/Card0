'use client'

import { useState } from 'react'
import { Edit2, ChevronDown, X, Save } from 'lucide-react'
import { useUser } from '@/context/UserContext'

export default function Dashboard() {
  const { profile, updateProfile } = useUser()

  // Estado do modal de edição de perfil
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({ ...profile })

  // Estado do modal de adicionar cartão
  const [adicionandoCartao, setAdicionandoCartao] = useState(false)
  const [novoCartao, setNovoCartao] = useState('')

  // Sincroniza o form com o perfil atual ao abrir
  const abrirEdicao = () => {
    setFormData({ ...profile })
    setEditando(true)
  }

  const salvarEdicao = () => {
    updateProfile(formData)
    setEditando(false)
  }

  const primeiroNome = profile.name.split(' ')[0]

  return (
    <div className="space-y-6 pb-16 w-full px-1 md:px-0 font-sans">

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
                onClick={salvarEdicao}
                className="flex-1 bg-brand-secondary text-white py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Save size={14} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL ADICIONAR CARTÃO ===== */}
      {adicionandoCartao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-brand-border w-full max-w-sm p-8 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-brand-secondary uppercase tracking-tight">Adicionar Cartão</h2>
              <button onClick={() => setAdicionandoCartao(false)} className="text-slate-400 hover:text-brand-primary transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Número do Cartão</label>
              <input
                type="text"
                value={novoCartao}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
                  const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
                  setNovoCartao(formatted)
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-text tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setAdicionandoCartao(false)}
                className="flex-1 border border-slate-200 text-slate-500 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert(`Cartão ${novoCartao} adicionado!`)
                  setNovoCartao('')
                  setAdicionandoCartao(false)
                }}
                className="flex-1 bg-brand-primary text-white py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de Boas-vindas */}
      <h1 className="text-2xl md:text-3xl font-black text-brand-text tracking-tight pt-2">
        Olá, {primeiroNome}.
      </h1>

      {/* LINHA 1: PERFIL + MEUS CARTÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Card de Perfil */}
        <div className="lg:col-span-7 bg-brand-surface p-8 rounded-[2rem] border border-brand-border shadow-sm flex flex-col md:flex-row gap-8 items-center relative min-h-[300px]">
          {/* Botão Editar — abre modal */}
          <button
            onClick={abrirEdicao}
            className="absolute top-6 right-6 text-slate-400 hover:text-brand-secondary transition-colors"
            title="Editar perfil"
          >
            <Edit2 size={18} />
          </button>

          {/* Avatar SVG */}
          <div className="shrink-0">
            <svg className="w-40 h-40 text-brand-text" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="6" fill="white"/>
              <circle cx="50" cy="40" r="16" fill="currentColor"/>
              <path d="M18 78C18 64.7452 28.7452 54 42 54H58C71.2548 54 82 64.7452 82 78V82H18V78Z" fill="currentColor"/>
            </svg>
          </div>

          {/* Dados do perfil — dinâmicos via contexto */}
          <div className="space-y-4 text-left w-full">
            <h2 className="text-2xl font-black text-brand-text tracking-tight">{profile.name}</h2>
            <div className="space-y-2 text-xs md:text-sm font-semibold">
              <div className="flex gap-2">
                <span className="text-slate-400 font-bold min-w-[100px]">Empresa:</span>
                <span className="text-brand-text">{profile.empresa}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 font-bold min-w-[100px]">Data de Nasc.:</span>
                <span className="text-brand-text">{profile.dataNascimento}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 font-bold min-w-[100px]">Local:</span>
                <span className="text-brand-text">{profile.localizacao}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 font-bold min-w-[100px]">Email:</span>
                <span className="text-brand-text font-bold">{profile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Meus Cartões */}
        <div className="lg:col-span-5 bg-brand-surface p-8 rounded-[2rem] border border-brand-border shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-black text-brand-text uppercase tracking-wider mb-4">Meus Cartões Ticket:</h3>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Número do Cartão</label>
              <div className="bg-[#EAEAEA] p-3 rounded-xl text-xs font-bold text-brand-text tracking-wider text-center select-all">
                6033 **** **** 1234
              </div>
            </div>

            {/* Grid de Bandeiras */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="border border-brand-border rounded-xl p-2 flex items-center justify-center bg-white h-12 shadow-sm cursor-pointer hover:border-brand-secondary/40 transition-all">
                <span className="font-extrabold text-[#115C34] text-xs italic tracking-tighter flex items-center gap-0.5">
                  Taggy <span className="w-2 h-2 bg-[#84CC16] rounded-full animate-pulse" />
                </span>
              </div>
              <div className="border border-brand-border rounded-xl p-2 flex flex-col items-center justify-center bg-white h-12 shadow-sm cursor-pointer hover:border-brand-secondary/40 transition-all">
                <div className="flex items-center gap-0.5">
                  <span className="font-black text-brand-secondary text-[10px]">Ticket</span>
                  <span className="font-black text-green-600 text-[10px]">Log</span>
                </div>
              </div>
              <div className="border border-brand-border rounded-xl p-2 flex items-center justify-center gap-1.5 bg-white h-12 shadow-sm cursor-pointer hover:border-brand-secondary/40 transition-all">
                <span className="font-black text-black text-[10px] italic">Repom</span>
                <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              </div>
              <div className="border border-brand-border rounded-xl p-2 flex items-center justify-center bg-white h-12 shadow-sm cursor-pointer hover:border-brand-secondary/40 transition-all">
                <div className="border border-green-600 px-1 py-0.5 rounded flex items-center gap-0.5">
                  <span className="text-slate-400 font-semibold text-[8px]">pag</span>
                  <span className="text-green-600 font-extrabold text-[9px]">bem</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Adicionar Cartão — abre modal */}
          <button
            onClick={() => setAdicionandoCartao(true)}
            className="w-full bg-brand-primary text-white py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all mt-6 shadow-sm"
          >
            Adicionar cartão
          </button>
        </div>
      </div>

      {/* LINHA 2: CUSTO/IMPACTO + SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Painel de Custo/Impacto */}
        <div className="lg:col-span-5 bg-brand-surface p-8 rounded-[2rem] border border-brand-border shadow-sm flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-brand-text uppercase tracking-wider">Painel de custo/impacto</h3>
              <button className="flex items-center gap-1 bg-white border border-brand-border px-3 py-1 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition-all">
                Ver histórico <ChevronDown size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 h-48 items-end relative py-4">
              <div className="flex flex-col items-center h-full justify-end">
                <div className="w-16 bg-slate-200 rounded-2xl h-36 relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-brand-secondary w-full h-[78%] rounded-2xl flex items-center justify-center">
                    <span className="text-white font-black text-xs">78%</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-center gap-1">
                  <div className="bg-slate-100 p-2 rounded-xl">
                    <svg className="w-4 h-4 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Custo</span>
                </div>
              </div>

              <div className="absolute left-1/2 top-4 bottom-16 w-px bg-brand-border -translate-x-1/2" />

              <div className="flex flex-col items-center h-full justify-end">
                <div className="w-16 bg-slate-200 rounded-2xl h-36 relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-brand-secondary w-full h-[21%] rounded-2xl flex items-center justify-center">
                    <span className="text-white font-black text-[10px]">21%</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-center gap-1">
                  <div className="bg-slate-100 p-2 rounded-xl">
                    <svg className="w-4 h-4 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7-4.8 4.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Impacto</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-border pt-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold">
              Sua meta estimada para este ano é de até 2,0 kg CO₂
            </p>
          </div>
        </div>

        {/* Score de Sustentabilidade */}
        <div className="lg:col-span-7 bg-brand-surface p-8 rounded-[2rem] border border-brand-border shadow-sm flex flex-col justify-between min-h-[360px]">
          <h3 className="text-xs font-black text-brand-text uppercase tracking-wider">Score de Sustentabilidade Operacional</h3>

          <div className="flex items-center justify-center h-48 relative">
            <svg width="200" height="200" viewBox="0 0 100 100" className="rotate-90">
              <path d="M 20,80 A 38,38 0 1,1 80,80" fill="none" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round"/>
              <path
                d="M 20,80 A 38,38 0 1,1 80,80"
                fill="none"
                stroke="#162056"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="180"
                strokeDashoffset={180 - (180 * 82) / 100}
              />
              <circle cx="50" cy="12" r="6" fill="#6B7280" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-xs font-black text-brand-text uppercase tracking-widest">Eficiência</span>
              <span className="text-4xl font-black text-brand-text tracking-tighter">82%</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-bold text-center max-w-sm mx-auto leading-relaxed pb-2">
            82% dos insumos operacionais e transações desta conta utilizam fontes compensadas.
          </p>
        </div>
      </div>
    </div>
  )
}
