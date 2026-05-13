'use client'

import { History } from 'lucide-react'
import { TEXTOS_INTERFACE } from './constantes'
import { useLinhaDoTempo } from './useLinhaDoTempo'
import FormularioImpacto from './FormularioImpacto'
import ResultadosImpacto from './ResultadosImpacto'

export default function TimelinePage() {
  const { impactData, loading, error, calcularImpacto } = useLinhaDoTempo()

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-[#c7e6ed] transition-all">
        
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-[#1c2241] rounded-3xl mb-6 shadow-lg shadow-[#1c2241]/20">
            <History size={32} className="text-[#91d0d1]" />
          </div>
          <h1 className="text-3xl font-black text-[#1c2241] mb-2 uppercase tracking-tight">
            {TEXTOS_INTERFACE.TITULO}
          </h1>
          <p className="text-slate-500 font-medium">
            {TEXTOS_INTERFACE.SUBTITULO}
          </p>
        </div>

        <div className="bg-[#f6edee]/50 p-8 rounded-3xl border border-[#c7e6ed]/50">
          <FormularioImpacto
            onSubmit={calcularImpacto}
            loading={loading}
          />
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 text-sm font-bold text-center italic">
              {error}
            </p>
          </div>
        )}

        {impactData && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ResultadosImpacto dados={impactData} />
          </div>
        )}
      </div>
    </div>
  )
}