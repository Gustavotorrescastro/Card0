'use client'
import React,{useState} from 'react'
import {useRouter} from 'next/navigation'
interface LoginFormProps{
  onLogin?: (email: string, password: string) => void
}

const LoginForm=({onLogin}:LoginFormProps):React.JSX.Element=>{
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  const router=useRouter()
  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault()
    setLoading(true)
    setError('')
    if(!email||!password){
      setError('Por favor, preencha todos os campos.')
      setLoading(false)
      return
    }
    try{
      await simulateLogin(email,password)
      if(onLogin){
        onLogin(email,password)
      }
      router.push('/simulador-risco-operacional')
    }catch(err){
      setError('Email ou senha incorretos.')
    }finally{
      setLoading(false)
    }
  }
  const simulateLogin=async(email:string,password:string):Promise<void>=>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        if(email==='usuario@edenred.com'&&password==='edenred123'){
          resolve()
        }else{
          reject(new Error('Invalid credentials'))
        }
      },1000)
    })
  }

  return(
    <div className="w-full max-w-md p-8 bg-edenred-surface rounded-xl shadow-2xl border border-edenred-border">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-edenred-primary">Login</h2>
          <p className="text-edenred-textSecondary mt-2">Simulador de Risco Operacional</p>
        </div>
        {error&&(
          <div className="bg-red-50 border-l-4 border-edenred-primary text-red-700 p-4 text-sm rounded animate-pulse">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-edenred-text">Email</label>
          <input type="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-2 border border-edenred-border rounded-lg focus:ring-2 focus:ring-edenred-primary focus:border-transparent outline-none transition-all text-edenred-text" placeholder="seu@email.com" required/>
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-edenred-text">Senha</label>
          <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-2 border border-edenred-border rounded-lg focus:ring-2 focus:ring-edenred-primary focus:border-transparent outline-none transition-all text-edenred-text" placeholder="Digite sua senha" required/>
        </div>
        <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${loading?'bg-gray-400 cursor-not-allowed':'bg-edenred-primary hover:bg-edenred-secondary shadow-md hover:shadow-lg'}`}>
          {loading?(
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Autenticando...
            </span>
          ):'Entrar'}
        </button>
        <div className="pt-4 border-t border-edenred-border text-center">
          <p className="text-[10px] uppercase tracking-wider text-edenred-textSecondary mb-2 font-bold">Credenciais de Acesso</p>
          <div className="bg-edenred-background p-2 rounded text-xs text-edenred-text font-mono">usuario@edenred.com<br/>edenred123</div>
        </div>
      </form>
    </div>
  )
}
export default LoginForm