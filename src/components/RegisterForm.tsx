'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card0Logo from './Card0Logo'
import { CheckCircle2, Mail } from 'lucide-react'

const RegisterForm = (): React.JSX.Element => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar cadastro.')
      }

      // Mostra tela de confirmação em vez de alert()
      setDone(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Tela de sucesso — instrui o usuário a verificar o e-mail
  if (done) {
    return (
        <div className="w-full max-w-md p-8 bg-brand-surface rounded-xl shadow-2xl border border-brand-border text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-brand-primary mb-2">Cadastro realizado!</h2>
          <p className="text-brand-text mb-4">
            Enviamos um link de verificação para
          </p>
          <div className="flex items-center justify-center gap-2 bg-gray-50 border border-brand-border rounded-lg px-4 py-3 mb-6">
            <Mail className="w-4 h-4 text-brand-primary flex-shrink-0" />
            <span className="font-semibold text-brand-text text-sm break-all">{formData.email}</span>
          </div>
          <p className="text-sm text-brand-textSecondary mb-6">
            Clique no link do e-mail para ativar sua conta. O link expira em <strong>24 horas</strong>.
          </p>
          <button
              onClick={() => router.push('/login')}
              className="w-full py-3 rounded-lg font-bold text-white bg-brand-primary hover:bg-brand-secondary transition-all shadow-md"
          >
            Ir para o login
          </button>
        </div>
    )
  }

  return (
      <div className="w-full max-w-md p-8 bg-brand-surface rounded-xl shadow-2xl border border-brand-border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-brand-primary">Cadastro</h2>
            <div className="mt-3 flex justify-center">
              <Card0Logo className="h-7 w-auto" />
            </div>
          </div>

          {error && (
              <div className="bg-red-50 border-l-4 border-brand-primary text-red-700 p-4 text-sm rounded animate-pulse">
                {error}
              </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-brand-text">Nome Completo</label>
            <input
                type="text"
                className="w-full px-4 py-2 border border-brand-border rounded-lg outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-text"
                placeholder="Ex: João Silva"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-brand-text">E-mail</label>
            <input
                type="email"
                className="w-full px-4 py-2 border border-brand-border rounded-lg outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-text"
                placeholder="seu@email.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-brand-text">Senha</label>
            <input
                type="password"
                className="w-full px-4 py-2 border border-brand-border rounded-lg outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-text"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-brand-text">Confirmar Senha</label>
            <input
                type="password"
                className="w-full px-4 py-2 border border-brand-border rounded-lg outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-text"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
            />
          </div>

          <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-secondary shadow-md'
              }`}
          >
            {loading ? 'Processando...' : 'Criar Conta'}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-brand-textSecondary">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-brand-primary font-bold hover:underline">
                Faça Login
              </Link>
            </p>
          </div>
        </form>
      </div>
  )
}

export default RegisterForm
