'use client'

import { History } from 'lucide-react'
import { TEXTOS_INTERFACE } from './constantes'
import { useLinhaDoTempo } from './useLinhaDoTempo'
import FormularioImpacto from './FormularioImpacto'
import ResultadosImpacto from './ResultadosImpacto'

export default function TimelinePage() {
  const { impactData, loading, error, calcularImpacto } = useLinhaDoTempo()

  return (
    <div className="space-y-8 pb-16 w-full max-w-3xl mx-auto px-1 md:px-0">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 transition-all">
        
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-brand-secondary rounded-3xl mb-6 shadow-lg">
            <History size={32} className="text-[#7FC2E4]" />
          </div>
          <h1 className="text-2xl font-black text-brand-secondary mb-2 uppercase tracking-tight">
            {TEXTOS_INTERFACE.TITULO}
          </h1>
          <p className="text-slate-500 text-xs font-semibold">
            {TEXTOS_INTERFACE.SUBTITULO}
          </p>
        </div>

        <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
          <FormularioImpacto
            onSubmit={calcularImpacto}
            loading={loading}
          />
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 text-xs font-bold text-center italic">
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