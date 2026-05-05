'use client'
import { useState, useEffect } from 'react'
import { Leaf } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import ComparadorSustentabilidade from '@/components/ComparadorSustentabilidade'

export default function CalculadoraImpactoPage(){
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted){
    return <div className="min-h-screen bg-[#f6edee]" />
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#f6edee]">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#c7e6ed]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#91d0d1]/20 rounded-2xl">
                    <Leaf className="text-[#1c2241]" size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-[#1c2241] uppercase tracking-tighter">
                      Calculadora de Impacto
                    </h1>
                    <p className="text-slate-500 font-medium">
                      Analise a migração de cartões físicos para digitais.
                    </p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-[#f6edee]">
                  <ComparadorSustentabilidade />
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}