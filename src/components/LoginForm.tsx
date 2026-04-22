'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void
}

const LoginForm = ({ onLogin }: LoginFormProps): React.JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Email ou senha incorretos.')
      }

      if (onLogin) onLogin(email, password)
      
      // REDIRECIONAMENTO PARA A ROTA /dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-brand-surface rounded-xl shadow-2xl border border-brand-border">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-primary">Login</h2>
          <p className="text-brand-textSecondary mt-2">Card0 - Edenred</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-brand-primary text-red-700 p-4 text-sm rounded animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-brand-text">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-brand-text" 
            placeholder="seu@email.com" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-brand-text">Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-brand-text" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-secondary shadow-md hover:shadow-lg'}`}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-sm text-brand-textSecondary mt-4">
          Não tem conta? <Link href="/cadastro" className="text-brand-primary font-bold hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginForm