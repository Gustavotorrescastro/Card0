// src/app/(authenticated)/calculadora-impacto/TermometroCerteza.tsx
'use client'

import React from 'react'

interface TermometroCertezaProps {
  camposObrigatorios: { name: string; preenchido: boolean }[]
}

export default function TermometroCerteza({ camposObrigatorios }: TermometroCertezaProps) {
  const total = camposObrigatorios.length
  const preenchidos = camposObrigatorios.filter((c) => c.preenchido).length
  const percentual = total > 0 ? (preenchidos / total) * 100 : 0

  let nivel: 'Baixo' | 'Médio' | 'Alto' = 'Baixo'
  let corTexto = 'text-red-600'
  let corBg = 'bg-red-500'
  
  if (percentual >= 100) {
    nivel = 'Alto'
    corTexto = 'text-emerald-600'
    corBg = 'bg-emerald-500'
  } else if (percentual >= 50) {
    nivel = 'Médio'
    corTexto = 'text-amber-500'
    corBg = 'bg-amber-500'
  }

  const camposFaltantes = camposObrigatorios.filter((c) => !c.preenchido)

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Termômetro de Certeza
          </span>
          <span className={`text-xs font-black uppercase tracking-wider ${corTexto} bg-opacity-10 bg-current px-2 py-0.5 rounded-full`}>
            Nível: {nivel}
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
          <div 
            className={`h-full ${corBg} transition-all duration-500 ease-out`} 
            style={{ width: `${percentual}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 font-medium mb-4">
          Acurácia de {Math.round(percentual)}% baseada no refinamento das variáveis inseridas.
        </p>
      </div>

      {/* Gatilhos de Revisão */}
      <div className="mt-auto">
        {nivel !== 'Alto' && camposFaltantes.length > 0 ? (
          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
            <p className="text-[11px] font-bold text-amber-700 mb-1">
              ⚠️ Ajuste os seguintes filtros para máxima precisão:
            </p>
            <ul className="list-disc pl-4 text-xs text-amber-900/80 space-y-0.5 font-medium">
              {camposFaltantes.map((campo, index) => (
                <li key={index}>{campo.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              ✅ Perfeito! Dados refinados geram projeções altamente realistas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}