'use client'

import { useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'

import AuthFooter from './AuthFooter'
import Card0Logo from './Card0Logo'
import EdenredLogo from './EdenredLogo'
import Stepper from './Stepper'

type AuthStep = 'login' | 'details' | 'password' | 'done' | 'forgot' | 'reset'

type AuthScreenProps = {
  initialStep?: AuthStep
}

const stepIndex: Record<AuthStep, number> = {
  login: 0,
  details: 1,
  password: 2,
  done: 3,
  forgot: 0,
  reset: 0,
}

const estados = ['Pernambuco', 'Sao Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia']

type StoredUser = {
  name?: string
  email?: string
  birthDate?: string
  city?: string
  state?: string
}

function formatarData(data?: string) {
  if (!data) return 'Não informado'

  const [ano, mes, dia] = data.split('-')
  if (ano && mes && dia) return `${dia}/${mes}/${ano}`

  return data
}

function formatarLocalizacao(city?: string, state?: string) {
  const partes = [city, state].filter(Boolean)
  return partes.length > 0 ? `${partes.join(' - ')}, Brasil` : 'Não informado'
}

function salvarProfileAutenticado(user: StoredUser) {
  const userProfile = {
    name: user.name || 'Usuário Gestor',
    email: user.email || '',
    empresa: 'Edenred',
    dataNascimento: formatarData(user.birthDate),
    localizacao: formatarLocalizacao(user.city, user.state),
  }

  localStorage.setItem('userEmail', userProfile.email)
  localStorage.setItem('userName', userProfile.name)
  localStorage.setItem('userProfile', JSON.stringify(userProfile))
  window.dispatchEvent(new Event('userProfileUpdated'))
}

export default function AuthScreen({ initialStep = 'login' }: AuthScreenProps) {
  const router = useRouter()
  const [step, setStep] = useState<AuthStep>(initialStep)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [emailWarning, setEmailWarning] = useState('')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    birthDate: '',
    city: '',
    state: '',
  })
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  })
  const [resetData, setResetData] = useState({
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  })

  const passwordChecks = useMemo(
    () => ({
      length: passwords.password.length >= 8,
      uppercase: /[A-Z]/.test(passwords.password),
      number: /\d/.test(passwords.password),
      symbol: /[^A-Za-z0-9]/.test(passwords.password),
      match:
        passwords.password.length > 0 &&
        passwords.password === passwords.confirmPassword,
    }),
    [passwords]
  )

  const allPasswordChecks = Object.values(passwordChecks).every(Boolean)
  const resetPasswordChecks = useMemo(
    () => ({
      length: resetData.password.length >= 8,
      uppercase: /[A-Z]/.test(resetData.password),
      number: /\d/.test(resetData.password),
      symbol: /[^A-Za-z0-9]/.test(resetData.password),
      match:
        resetData.password.length > 0 &&
        resetData.password === resetData.confirmPassword,
    }),
    [resetData]
  )
  const allResetPasswordChecks = Object.values(resetPasswordChecks).every(Boolean)
  const cadastroAtivo = step === 'details' || step === 'password' || step === 'done'

  const voltarParaLogin = () => {
    setError('')
    setNotice('')
    setEmailWarning('')
    setStep('login')
    router.push('/login')
  }

  const navegarEtapaAnterior = (index: number) => {
    if (index >= stepIndex[step]) return

    const stepByIndex: AuthStep[] = ['login', 'details', 'password', 'done']
    const nextStep = stepByIndex[index]

    if (nextStep === 'login') {
      voltarParaLogin()
      return
    }

    setError('')
    setStep(nextStep)
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setNotice('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Email ou senha incorretos.')
      }

      localStorage.setItem('userLoggedIn', 'true')
      salvarProfileAutenticado({
        ...data.user,
        email: data.user?.email || loginData.email,
      })
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar.')
    } finally {
      setLoading(false)
    }
  }

  const handleDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setEmailWarning('')
    setLoading(true)

    try {
      const response = await fetch(
        `/api/auth/register?email=${encodeURIComponent(profile.email)}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao validar e-mail.')
      }

      if (data.exists) {
        setEmailWarning('Este e-mail já está cadastrado. Faça login ou use outro e-mail.')
        return
      }

      setStep('password')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar e-mail.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!allPasswordChecks) {
      setError('A senha precisa cumprir todas as regras antes de continuar.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          birthDate: profile.birthDate,
          city: profile.city,
          state: profile.state,
          password: passwords.password,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar cadastro.')
      }

      salvarProfileAutenticado({
        name: profile.name,
        email: profile.email,
        birthDate: profile.birthDate,
        city: profile.city,
        state: profile.state,
      })
      setStep('done')
      setNotice('Enviamos um e-mail de verificação. Confirme seu e-mail antes de fazer login.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao realizar cadastro.')
    } finally {
      setLoading(false)
    }
  }

  const finishRegistration = () => {
    setStep('login')
    setLoginData((current) => ({ ...current, email: profile.email }))
    setNotice('Depois de verificar seu e-mail, entre com sua senha para acessar o sistema.')
    router.push('/login')
  }

  const solicitarRecuperacaoSenha = async () => {
    const email = (loginData.email || resetData.email).trim()
    setError('')
    setNotice('')

    if (!email) {
      setError('Digite seu e-mail no campo de login para receber o código de verificação.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar código de recuperação.')
      }

      setResetData({
        email,
        code: '',
        password: '',
        confirmPassword: '',
      })
      setNotice('Enviamos um código de verificação para o e-mail informado.')
      setStep('reset')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar código de recuperação.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!allResetPasswordChecks) {
      setError('A nova senha precisa cumprir todas as regras antes de continuar.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetData.email,
          code: resetData.code,
          password: resetData.password,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao redefinir senha.')
      }

      setLoginData({ email: resetData.email, password: '' })
      setResetData({ email: '', code: '', password: '', confirmPassword: '' })
      setStep('login')
      setNotice('Senha alterada com sucesso. Faça login com a nova senha.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f3f3f3] text-black">
      <header className="w-full border-t border-black bg-white">
        <div className="flex h-14 w-full items-center justify-between px-10">
          <EdenredLogo className="h-10 w-24" />
          <button
            type="button"
            onClick={voltarParaLogin}
            className="flex items-center gap-1 rounded-full bg-[#ff2b1d] px-7 py-2.5 text-sm font-medium text-white"
          >
            Entrar
            <ChevronDown size={14} />
          </button>
        </div>
      </header>

      <div className="flex h-9 items-center justify-center bg-[#f3f3f3]">
        <Card0Logo className="h-5 w-auto" priority />
      </div>

      <main className="flex w-full flex-1 flex-col px-4 pb-10">
        <Stepper
          activeIndex={stepIndex[step]}
          onStepClick={cadastroAtivo ? navegarEtapaAnterior : undefined}
        />

        {step === 'login' && (
          <section className="mx-auto flex min-h-[540px] w-full max-w-[725px] flex-col rounded-xl bg-[#dfdfdf] px-12 py-12">
            <div className="mb-12 flex justify-center">
              <div className="flex items-center gap-3 text-[#ff2b1d]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff2b1d] text-xs font-black text-white">
                  Ticket
                </div>
                <div className="h-10 w-px bg-[#ff2b1d]" />
                <EdenredLogo compact />
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-1 flex-col">
              <div className="space-y-9">
                <Field
                  label="Email"
                  type="email"
                  value={loginData.email}
                  placeholder="seunome@email.com"
                  inputClassName="h-[47px] rounded-full border-0 px-6"
                  onChange={(value) => setLoginData({ ...loginData, email: value })}
                />
                <Field
                  label="Senha"
                  type="password"
                  value={loginData.password}
                  placeholder="sua senha aqui"
                  inputClassName="h-[47px] rounded-full border-0 px-6"
                  onChange={(value) =>
                    setLoginData({ ...loginData, password: value })
                  }
                />
              </div>

              {error && <ErrorMessage message={error} />}
              {notice && <NoticeMessage message={notice} />}

              <div className="mt-auto space-y-5 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-9 min-w-32 rounded-full bg-[#ff2b1d] px-11 text-sm font-medium text-white disabled:bg-[#b9b9b9]"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
                <button
                  type="button"
                  onClick={solicitarRecuperacaoSenha}
                  disabled={loading}
                  className="block w-full text-sm font-medium text-[#ff2b1d]"
                >
                  Esqueceu sua senha?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep('details')
                    router.push('/cadastro')
                  }}
                  className="block w-full text-sm"
                >
                  Ainda nao tem conta? Cadastre-se agora.
                </button>
              </div>
            </form>
          </section>
        )}

        {step === 'reset' && (
          <section className="mx-auto w-full max-w-[725px] rounded-xl bg-[#dfdfdf] px-16 py-8">
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <EdenredLogo />
              </div>
              <h1 className="text-3xl font-bold">Redefina sua senha</h1>
              <p className="mt-1 text-lg">
                Informe o código enviado por e-mail e escolha uma nova senha.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="mt-8 space-y-7">
              <Field
                label="E-mail"
                type="email"
                value={resetData.email}
                inputClassName="h-[47px] rounded-full border-0 px-6"
                onChange={(value) => setResetData({ ...resetData, email: value })}
              />
              <Field
                label="Código de verificação"
                value={resetData.code}
                placeholder="Digite o código recebido"
                inputClassName="h-[47px] rounded-full border-0 px-6 text-center tracking-[0.35em]"
                onChange={(value) => setResetData({ ...resetData, code: value })}
              />
              <Field
                label="Nova senha"
                type="password"
                value={resetData.password}
                placeholder="Digite aqui"
                inputClassName="h-[47px] rounded-full border-0 px-6"
                onChange={(value) => setResetData({ ...resetData, password: value })}
              />
              <Field
                label="Confirme a nova senha"
                type="password"
                value={resetData.confirmPassword}
                placeholder="Digite aqui"
                inputClassName="h-[47px] rounded-full border-0 px-6"
                onChange={(value) => setResetData({ ...resetData, confirmPassword: value })}
              />

              <div className="space-y-1 pl-5 text-sm">
                <PasswordCheck ok={resetPasswordChecks.length}>
                  Minimo de <strong>8 caracteres</strong>
                </PasswordCheck>
                <PasswordCheck ok={resetPasswordChecks.uppercase}>
                  Incluir pelo menos <strong>uma letra maiuscula</strong>
                </PasswordCheck>
                <PasswordCheck ok={resetPasswordChecks.number}>
                  Incluir pelo menos <strong>um numero</strong>
                </PasswordCheck>
                <PasswordCheck ok={resetPasswordChecks.symbol}>
                  Incluir pelo menos <strong>um simbolo</strong>
                </PasswordCheck>
                <PasswordCheck ok={resetPasswordChecks.match}>
                  Confirmacao igual a senha
                </PasswordCheck>
              </div>

              {error && <ErrorMessage message={error} />}
              {notice && <NoticeMessage message={notice} />}

              <div className="flex justify-center">
                <PrimaryButton label="Alterar senha" loading={loading} />
              </div>

              <p className="text-center text-sm">
                Não recebeu o código?{' '}
                <button
                  type="button"
                  onClick={solicitarRecuperacaoSenha}
                  className="font-semibold text-[#e91d2a] hover:underline"
                >
                  Enviar novamente
                </button>
              </p>

              <LoginShortcut onClick={voltarParaLogin} />
            </form>
          </section>
        )}

        {step === 'details' && (
          <section className="mx-auto w-full max-w-[725px] rounded-xl bg-[#dfdfdf] px-12 py-8">
            <AuthTitle subtitle="Preencha seus dados para criar sua conta" />

            <form onSubmit={handleDetails} className="mt-8 space-y-6">
              <Field
                label="Nome Completo"
                value={profile.name}
                placeholder="Digite aqui"
                inputClassName="h-[47px] rounded-full border-0 px-6"
                onChange={(value) => setProfile({ ...profile, name: value })}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field
                  label="E-mail"
                  type="email"
                  value={profile.email}
                  placeholder="Digite aqui"
                  inputClassName="h-[47px] rounded-full border-0 px-6"
                  onChange={(value) => {
                    setEmailWarning('')
                    setError('')
                    setProfile({ ...profile, email: value })
                  }}
                />
                <Field
                  label="Data de nascimento"
                  type="date"
                  value={profile.birthDate}
                  inputClassName="h-[47px] rounded-full border-0 px-6"
                  onChange={(value) =>
                    setProfile({ ...profile, birthDate: value })
                  }
                />
                <Field
                  label="Cidade"
                  value={profile.city}
                  placeholder="Selecione"
                  inputClassName="h-[47px] rounded-full border-0 px-6"
                  onChange={(value) => setProfile({ ...profile, city: value })}
                />
                <SelectField
                  label="Estado"
                  value={profile.state}
                  onChange={(value) => setProfile({ ...profile, state: value })}
                />
              </div>

              {emailWarning && <ErrorMessage message={emailWarning} />}
              {error && <ErrorMessage message={error} />}

              <div className="flex justify-center pt-2">
                <PrimaryButton label="Proximo" loading={loading} />
              </div>

              <LoginShortcut onClick={voltarParaLogin} />
            </form>
          </section>
        )}

        {step === 'password' && (
          <section className="mx-auto w-full max-w-[725px] rounded-xl bg-[#dfdfdf] px-16 py-8">
            <AuthTitle subtitle="Preencha seus dados para criar sua conta" />

            <form onSubmit={handleRegister} className="mt-8 space-y-8">
              <Field
                label="Senha"
                type="password"
                value={passwords.password}
                placeholder="Digite aqui"
                labelClassName="text-2xl"
                inputClassName="h-[47px] rounded-full border-0 px-6"
                onChange={(value) =>
                  setPasswords({ ...passwords, password: value })
                }
              />
              <Field
                label="Confirme a senha"
                type="password"
                value={passwords.confirmPassword}
                placeholder="Digite aqui"
                labelClassName="text-2xl"
                inputClassName="h-[47px] rounded-full border-0 px-6"
                onChange={(value) =>
                  setPasswords({ ...passwords, confirmPassword: value })
                }
              />

              <div className="space-y-1 pl-5 text-sm">
                <PasswordCheck ok={passwordChecks.length}>
                  Minimo de <strong>8 caracteres</strong>
                </PasswordCheck>
                <PasswordCheck ok={passwordChecks.uppercase}>
                  Incluir pelo menos <strong>uma letra maiuscula</strong>
                </PasswordCheck>
                <PasswordCheck ok={passwordChecks.number}>
                  Incluir pelo menos <strong>um numero</strong>
                </PasswordCheck>
                <PasswordCheck ok={passwordChecks.symbol}>
                  Incluir pelo menos <strong>um simbolo</strong>
                </PasswordCheck>
                <PasswordCheck ok={passwordChecks.match}>
                  Confirmacao igual a senha
                </PasswordCheck>
              </div>

              {error && <ErrorMessage message={error} />}

              <div className="flex justify-center">
                <PrimaryButton label="Proximo" loading={loading} />
              </div>

              <LoginShortcut onClick={voltarParaLogin} />
            </form>
          </section>
        )}

        {step === 'done' && (
          <section className="mx-auto flex min-h-[635px] w-full max-w-[740px] flex-col items-center rounded-xl bg-[#dfdfdf] px-12 py-7 text-center">
            <EdenredLogo />
            <h1 className="mt-9 text-[44px] leading-tight">
              Cadastro quase concluído!
            </h1>
            <p className="mt-2 max-w-xl text-2xl">
              Enviamos um e-mail de verificação para {profile.email}. Confirme seu e-mail antes de fazer login.
            </p>
            {notice && <NoticeMessage message={notice} />}
            <CheckCircle2
              className="mt-16 text-[#ff2b1d]"
              size={160}
              strokeWidth={1.5}
            />
            <button
              type="button"
              onClick={finishRegistration}
              className="mt-auto h-11 min-w-[330px] rounded-full bg-[#e91d2a] px-10 text-xl text-white"
            >
              Ir para o login
            </button>
          </section>
        )}
      </main>

      <AuthFooter />
    </div>
  )
}

function AuthTitle({ subtitle }: { subtitle: string }) {
  return (
    <div className="text-center">
      <div className="mb-2 flex justify-center">
        <EdenredLogo />
      </div>
      <h1 className="text-3xl font-bold">Crie sua conta</h1>
      <p className="mt-1 text-lg">{subtitle}</p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  labelClassName = '',
  inputClassName = '',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  labelClassName?: string
  inputClassName?: string
}) {
  return (
    <label className="block space-y-2">
      <span className={`block text-base font-medium ${labelClassName}`}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        required
        className={`h-6 w-full rounded-md border border-[#555555] bg-white px-2 text-sm outline-none placeholder:text-[#b4b4b4] focus:ring-2 focus:ring-[#ff2b1d]/30 ${inputClassName}`}
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-base font-medium">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="h-[47px] w-full appearance-none rounded-full border-0 bg-white px-6 text-sm text-[#777777] outline-none focus:ring-2 focus:ring-[#ff2b1d]/30"
      >
        <option value="">Selecione</option>
        {estados.map((estado) => (
          <option key={estado} value={estado}>
            {estado}
          </option>
        ))}
      </select>
    </label>
  )
}

function PrimaryButton({
  label,
  loading,
}: {
  label: string
  loading: boolean
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-9 min-w-[246px] items-center justify-center gap-1 rounded-full bg-[#e91d2a] px-8 text-sm font-medium text-white disabled:bg-[#b9b9b9]"
    >
      {loading ? 'Processando...' : label}
      {!loading && <ArrowRight size={16} />}
    </button>
  )
}

function LoginShortcut({ onClick }: { onClick: () => void }) {
  return (
    <p className="text-center text-sm">
      Já possui login?{' '}
      <button
        type="button"
        onClick={onClick}
        className="font-semibold text-[#e91d2a] hover:underline"
      >
        Fazer login
      </button>
    </p>
  )
}

function PasswordCheck({
  ok,
  children,
}: {
  ok: boolean
  children: ReactNode
}) {
  return (
    <div className="flex min-h-5 items-center gap-2">
      <span className="flex h-4 w-4 items-center justify-center">
        {ok && <Check size={17} strokeWidth={2.2} />}
      </span>
      <span className={ok ? 'text-black' : 'text-black/65'}>{children}</span>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
      {message}
    </div>
  )
}

function NoticeMessage({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">
      {message}
    </div>
  )
}
