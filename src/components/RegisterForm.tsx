'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const RegisterForm = (): React.JSX.Element => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validação básica de senha
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

    try {
      // Aqui chamamos a rota de API que criamos em /api/auth/register
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

      // Sucesso: Redireciona para o login
      alert('Conta criada com sucesso!')
      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-brand-surface rounded-xl shadow-2xl border border-brand-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-brand-primary">Cadastro</h2>
          <p className="text-brand-textSecondary mt-2">Crie sua conta no Card0</p>
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