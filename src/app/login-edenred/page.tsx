'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, BarChart3, Building2, Globe2, Leaf, LockKeyhole, Mail, ShieldCheck, UserPlus } from 'lucide-react'

import EdenredLogo from '@/components/EdenredLogo'
import fotoFundoEdenred from '../../../FotoFundoEdenred.jpg'

type Mode = 'login' | 'register'

const defaultAdmins = [
  { email: 'admin@edenred.com.br', password: 'senha123', name: 'Administrador Edenred' },
  { email: 'admin@card0.com.br', password: 'senha123', name: 'Administrador Edenred' },
]

function getSavedAdmins() {
  try {
    return JSON.parse(localStorage.getItem('edenredAdmins') || '[]') as Array<{
      email: string
      password: string
      name: string
    }>
  } catch {
    return []
  }
}

function saveEdenredSession(admin: { email: string; name: string }) {
  const profile = {
    name: admin.name,
    email: admin.email,
    empresa: 'Edenred',
    dataNascimento: 'Não aplicável',
    localizacao: 'Administração Edenred',
  }

  localStorage.setItem('userLoggedIn', 'true')
  localStorage.setItem('userRole', 'edenred')
  localStorage.setItem('userEmail', admin.email)
  localStorage.setItem('userName', admin.name)
  localStorage.setItem('userProfile', JSON.stringify(profile))
  window.dispatchEvent(new Event('userProfileUpdated'))
}

export default function EdenredLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const submitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const email = form.email.trim().toLowerCase()
    const savedAdmins = getSavedAdmins()
    const admin = [...defaultAdmins, ...savedAdmins].find(
      (item) => item.email.toLowerCase() === email && item.password === form.password
    )

    if (!admin) {
      setLoading(false)
      setError('E-mail ou senha Edenred inválidos.')
      return
    }

    saveEdenredSession(admin)
    router.push('/dashboard')
  }

  const submitRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      setLoading(false)
      setError('Preencha nome, e-mail e uma senha com pelo menos 6 caracteres.')
      return
    }

    const admins = getSavedAdmins()
    const email = form.email.trim().toLowerCase()

    if ([...defaultAdmins, ...admins].some((item) => item.email.toLowerCase() === email)) {
      setLoading(false)
      setError('Este e-mail Edenred já possui acesso.')
      return
    }

    const admin = {
      name: form.name.trim(),
      email,
      password: form.password,
    }

    localStorage.setItem('edenredAdmins', JSON.stringify([...admins, admin]))
    saveEdenredSession(admin)
    router.push('/dashboard')
  }

  const isRegister = mode === 'register'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f3f3] text-black">
      <Image
        src={fotoFundoEdenred}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(243,243,243,0.98)_0%,rgba(243,243,243,0.9)_43%,rgba(243,243,243,0.64)_68%,rgba(243,243,243,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_20%,rgba(255,43,29,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.54)_0%,rgba(243,243,243,0.82)_100%)]" />
      <header className="relative z-20 border-t border-black bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" aria-label="Voltar para a Landing Page" className="inline-flex transition-transform hover:scale-105">
            <EdenredLogo className="h-10 w-24" />
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-[#ffb4ae] bg-white px-6 py-2 text-sm font-black text-[#ff2b1d] transition-all hover:bg-[#fff1ef]"
          >
            Login empresas
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl grid-cols-1 items-center gap-8 px-5 py-10 lg:grid-cols-[1fr_520px]">
        <div className="pointer-events-none absolute -right-32 top-10 h-[430px] w-[430px] rounded-full bg-[#ff2b1d]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 bottom-0 h-[360px] w-[360px] rounded-full bg-[#ffb4ae]/35 blur-3xl" />

        <div className="relative max-w-2xl">
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Gestão Edenred para clientes, carbono e migração digital.
          </h1>
          <p className="mt-5 max-w-xl text-lg font-semibold leading-relaxed text-[#555]">
            Acompanhe empresas-clientes, compare operação física vs. digital e priorize contas com maior economia de CO₂ dentro da mesma ferramenta.
          </p>

          <div className="mt-8 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
            <InfoCard icon={<Building2 size={22} />} label="Clientes Edenred" value="+130k" />
            <InfoCard icon={<Leaf size={22} />} label="CO₂ monitorado" value="117,7t" />
            <InfoCard icon={<Globe2 size={22} />} label="Mercados" value="44" />
          </div>

          <div className="mt-6 grid max-w-2xl grid-cols-1 gap-4 rounded-[2rem] border border-[#ffe1de] bg-white/80 p-5 shadow-sm backdrop-blur md:grid-cols-3">
            <MiniInsight icon={<ShieldCheck size={18} />} label="Acesso protegido" />
            <MiniInsight icon={<BarChart3 size={18} />} label="Dashboard executivo" />
            <MiniInsight icon={<ArrowRight size={18} />} label="Mesmas ferramentas" />
          </div>
        </div>

        <section className="relative rounded-[2rem] border border-white bg-white/90 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="absolute inset-x-8 top-0 h-1 rounded-full bg-[#ff2b1d]" />

          <div className="mb-7 flex rounded-full bg-[#f3f3f3] p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className={`h-11 flex-1 rounded-full text-sm font-black transition-all ${!isRegister ? 'bg-[#ff2b1d] text-white shadow-md' : 'text-[#555] hover:bg-[#fff1ef]'}`}
            >
              Login Edenred
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError('')
              }}
              className={`h-11 flex-1 rounded-full text-sm font-black transition-all ${isRegister ? 'bg-[#ff2b1d] text-white shadow-md' : 'text-[#555] hover:bg-[#fff1ef]'}`}
            >
              Cadastro Edenred
            </button>
          </div>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-[#ff2b1d] text-white shadow-lg shadow-[#ff2b1d]/25">
              {isRegister ? <UserPlus size={24} /> : <LockKeyhole size={24} />}
            </div>
            <h2 className="text-3xl font-black">
              {isRegister ? 'Criar acesso Edenred' : 'Entrar como Edenred'}
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#555]">
              {isRegister ? 'Cadastro administrativo sem verificação de e-mail nesta etapa.' : 'Use admin@edenred.com.br e senha123 para testar.'}
            </p>
          </div>

          <form onSubmit={isRegister ? submitRegister : submitLogin} className="space-y-5">
            {isRegister && (
              <AdminField
                label="Nome completo"
                value={form.name}
                placeholder="Nome do administrador"
                onChange={(value) => setForm({ ...form, name: value })}
              />
            )}
            <AdminField
              label="E-mail Edenred"
              type="email"
              value={form.email}
              placeholder="admin@edenred.com.br"
              icon={<Mail size={17} />}
              onChange={(value) => setForm({ ...form, email: value })}
            />
            <AdminField
              label="Senha"
              type="password"
              value={form.password}
              placeholder="Digite sua senha"
              icon={<LockKeyhole size={17} />}
              onChange={(value) => setForm({ ...form, password: value })}
            />
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff2b1d] px-8 text-sm font-black text-white shadow-lg shadow-[#ff2b1d]/20 transition-all hover:-translate-y-0.5 hover:bg-[#e51f13] disabled:bg-[#b9b9b9]"
            >
              {loading ? 'Processando...' : isRegister ? 'Criar e acessar dashboard' : 'Acessar dashboard'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

function InfoCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#ffe1de] bg-white p-5 shadow-sm">
      <div className="mb-4 inline-flex rounded-xl bg-[#ffe5e5] p-3 text-[#ff2b1d]">{icon}</div>
      <strong className="block text-2xl font-black">{value}</strong>
      <span className="mt-1 block text-xs font-bold text-[#555]">{label}</span>
    </div>
  )
}

function MiniInsight({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#fff7f7] px-4 py-3">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ffe5e5] text-[#ff2b1d]">
        {icon}
      </span>
      <span className="text-xs font-black leading-tight text-[#333]">{label}</span>
    </div>
  )
}

function AdminField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  icon?: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      <span className="flex h-12 items-center gap-3 rounded-full bg-white px-5 text-[#777] shadow-sm focus-within:ring-2 focus-within:ring-[#ff2b1d]/30">
        {icon}
        <input
          required
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none placeholder:text-[#aaa]"
        />
      </span>
    </label>
  )
}
