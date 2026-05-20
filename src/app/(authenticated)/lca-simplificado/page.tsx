'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Recycle, HelpCircle, ChevronRight, Play, ArrowLeft,
  Building, Truck, Monitor, Trash2
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function LcaSimplificadoPage() {
  // --- Estados do Simulador Principal ---
  const [quantidade, setQuantidade] = useState(13600)
  const [material, setMaterial] = useState('pvc')
  const [matriz, setMatriz] = useState('br')

  // --- Estado da Fase Selecionada para Detalhamento ---
  const [faseDetalhe, setFaseDetalhe] = useState<'producao' | 'transporte' | 'uso' | 'descarte' | null>(null)

  // --- Fatores de Cálculo ---
  const fatoresMaterial = {
    pvc: { label: 'PVC Convencional', mult: 1.0 },
    pvc_rec: { label: 'PVC Reciclado', mult: 0.6 },
    metal: { label: 'Metal Premium', mult: 2.5 }
  }

  const fatoresMatriz = {
    br: { label: 'Brasil (Limpa/Hidro)', mult: 1.0 },
    ue: { label: 'União Europeia', mult: 2.2 },
    usa: { label: 'Estados Unidos', mult: 2.8 }
  }

  // Pegada de carbono base por cartão físico nas fases (em kg CO2e)
  // Total base: 0.172 kg CO2e por cartão (2.34 tCO2e para 13.600 cartões)
  const co2Base = {
    producao: 0.072,  // 42%
    transporte: 0.031, // 18%
    uso: 0.048,        // 28%
    descarte: 0.021    // 12%
  }

  // --- Cálculos de Ciclo de Vida ---
  const lcaCalculos = useMemo(() => {
    const matMult = fatoresMaterial[material as keyof typeof fatoresMaterial]?.mult || 1.0
    const matzMult = fatoresMatriz[matriz as keyof typeof fatoresMatriz]?.mult || 1.0

    // Valores em kg CO2e
    const prodFis = quantidade * co2Base.producao * matMult
    const transFis = quantidade * co2Base.transporte * matzMult
    const usoFis = quantidade * co2Base.uso * matzMult
    const descFis = quantidade * co2Base.descarte * matMult

    const totalFis = prodFis + transFis + usoFis + descFis

    // Reduções do digital
    const prodDig = prodFis * 0.22  // -78%
    const transDig = transFis * 0.17 // -83%
    const usoDig = usoFis * 0.48     // -52%
    const descDig = descFis * 0.18   // -82%
    const totalDig = prodDig + transDig + usoDig + descDig

    // Árvores equivalentes
    // 1 árvore da Mata Atlântica absorve em média 15.6 kg CO2e por ano
    const arvoresEquivalentes = Math.max(1, Math.round(totalFis / 15.6))

    return {
      prodFis: prodFis / 1000, // em tCO2e
      transFis: transFis / 1000,
      usoFis: usoFis / 1000,
      descFis: descFis / 1000,
      totalFis: totalFis / 1000,

      prodDig: prodDig / 1000,
      transDig: transDig / 1000,
      usoDig: usoDig / 1000,
      descDig: descDig / 1000,
      totalDig: totalDig / 1000,

      arvores: arvoresEquivalentes,
      totalFisKg: totalFis,
      totalDigKg: totalDig
    }
  }, [quantidade, material, matriz])

  // --- Dados do Donut Chart ---
  const chartData = [
    { name: 'Produção', value: lcaCalculos.prodFis, color: '#162056' },
    { name: 'Transporte', value: lcaCalculos.transFis, color: '#7FC2E4' },
    { name: 'Uso', value: lcaCalculos.usoFis, color: '#E1EA80' },
    { name: 'Descarte', value: lcaCalculos.descFis, color: '#F72717' }
  ]

  // Detalhes por fase para exibição interativa
  const detalhesFase = {
    producao: {
      titulo: 'Produção',
      total: lcaCalculos.prodFis,
      percent: '42%',
      itens: [
        { label: 'Extração e Refino de PVC', val: (lcaCalculos.prodFis * 0.5).toFixed(2) },
        { label: 'Fabricação do Substrato', val: (lcaCalculos.prodFis * 0.3).toFixed(2) },
        { label: 'Laminação e Impressão', val: (lcaCalculos.prodFis * 0.2).toFixed(2) }
      ]
    },
    transporte: {
      titulo: 'Transporte',
      total: lcaCalculos.transFis,
      percent: '18%',
      itens: [
        { label: 'Frete Fábrica - Centro de Distribuição', val: (lcaCalculos.transFis * 0.4).toFixed(2) },
        { label: 'Embalagem de Envio Postal', val: (lcaCalculos.transFis * 0.2).toFixed(2) },
        { label: 'Entrega Final (Last Mile)', val: (lcaCalculos.transFis * 0.4).toFixed(2) }
      ]
    },
    uso: {
      titulo: 'Uso',
      total: lcaCalculos.usoFis,
      percent: '28%',
      itens: [
        { label: 'Maquininhas POS nas transações', val: (lcaCalculos.usoFis * 0.35).toFixed(2) },
        { label: 'Reemissão operacional (perda/roubo)', val: (lcaCalculos.usoFis * 0.15).toFixed(2) },
        { label: 'Processamento em nuvem das bandeiras', val: (lcaCalculos.usoFis * 0.2).toFixed(2) },
        { label: 'Energia da infraestrutura bancária', val: (lcaCalculos.usoFis * 0.3).toFixed(2) }
      ]
    },
    descarte: {
      titulo: 'Descarte',
      total: lcaCalculos.descFis,
      percent: '12%',
      itens: [
        { label: 'Coleta de Lixo Eletrônico', val: (lcaCalculos.descFis * 0.3).toFixed(2) },
        { label: 'Incineração/Aterro (PVC Tradicional)', val: (lcaCalculos.descFis * 0.6).toFixed(2) },
        { label: 'Emissões de Fragmentação de Microplásticos', val: (lcaCalculos.descFis * 0.1).toFixed(2) }
      ]
    }
  }

  return (
    <div className="space-y-8 pb-16 w-full max-w-7xl mx-auto px-1 md:px-0">
      
      {/* CABEÇALHO DA PÁGINA */}
      <section className="pb-2">
        <h1 className="text-3xl font-bold text-[#162056] tracking-tight">Operação e execução</h1>
        <p className="text-slate-500 text-sm font-medium mt-1 leading-relaxed max-w-4xl">
          Gerencie o ciclo de vida dos seus cartões físicos através do descarte consciente e compensação de carbono.
        </p>
      </section>

      {/* SEÇÃO 1: INPUTS E CARBONO GERADO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Card de Configuração (Borda Azul conforme Imagem) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border-2 border-[#1E90FF] shadow-sm flex flex-col justify-center space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            {/* Slider de Quantidade */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-[#162056] uppercase tracking-wider text-sm">Quantidade de cartões</span>
                <span className="font-black text-[#162056] text-lg bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100">{quantidade.toLocaleString('pt-BR')}</span>
              </div>
              
              <input 
                type="range"
                min="100"
                max="100000"
                step="100"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#162056]"
              />
              
              <div className="flex justify-between text-[10px] text-slate-400 font-extrabold">
                <span>100</span>
                <span>100.000</span>
              </div>
            </div>

            {/* Dropdown de Matriz Energética */}
            <div className="w-full md:w-56 space-y-2">
              <label className="text-xs font-black text-[#162056] uppercase tracking-wider block">Matriz energética</label>
              <select 
                value={matriz}
                onChange={(e) => setMatriz(e.target.value)}
                className="w-full bg-[#EAEAEA] border-none text-xs rounded-xl p-4 font-bold text-[#162056] focus:outline-none appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23162056' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '12px' }}
              >
                {Object.entries(fatoresMatriz).map(([key, val]) => (
                  <option key={key} value={key}>{val.label.split(' ')[0]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card Carbono Gerado com Árvore Vetorial Estilizada */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="relative z-10 space-y-4">
            <span className="text-xs font-black text-[#162056] uppercase tracking-wider block">Carbono gerado</span>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black tracking-tight text-[#162056]">{Math.round(lcaCalculos.totalFisKg)}kg</span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold max-w-[240px] leading-snug">
              de CO₂ são gerados durante o ciclo dos vida dos cartões físicos.
            </p>
          </div>

          <div className="relative z-10 border-t border-slate-100 pt-4 flex items-center gap-1.5 text-slate-400">
             <span className="text-[10px] font-bold">↑ O processo físico gera {(lcaCalculos.totalFisKg - lcaCalculos.totalDigKg).toFixed(1)} kg de CO₂ a mais que o digital</span>
          </div>

          {/* Árvore Vetorial do Canto Direito (Conforme Imagem) */}
          <div className="absolute right-6 bottom-4 flex flex-col items-center select-none pointer-events-none">
            {/* Copa da Árvore (círculos translúcidos sobrepostos) */}
            <div className="relative w-36 h-28 flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-full bg-[#E1EA80]/50" style={{ transform: 'translate(-16px, -12px)' }} />
              <div className="absolute w-16 h-16 rounded-full bg-[#E1EA80]/50" style={{ transform: 'translate(16px, -12px)' }} />
              <div className="absolute w-16 h-16 rounded-full bg-[#E1EA80]/60" style={{ transform: 'translate(0px, -24px)' }} />
              <div className="absolute w-14 h-14 rounded-full bg-[#E1EA80]/40" style={{ transform: 'translate(-24px, 12px)' }} />
              <div className="absolute w-14 h-14 rounded-full bg-[#E1EA80]/40" style={{ transform: 'translate(24px, 12px)' }} />
              <div className="absolute w-16 h-16 rounded-full bg-[#E1EA80]/70" style={{ transform: 'translate(0px, 8px)' }} />
            </div>
            {/* Tronco da Árvore */}
            <div className="w-3.5 h-16 bg-[#8B0000] rounded-full -mt-4 shadow-inner" />
            
            {/* Texto de Equivalência */}
            <span className="text-[8px] font-semibold text-slate-400 tracking-tight mt-2">Equivalente a {lcaCalculos.arvores} {lcaCalculos.arvores === 1 ? 'árvore' : 'árvores'}/ano</span>
          </div>
        </div>

      </div>

      {/* SEÇÃO 2: INTELIGÊNCIA DE CICLO DE VIDA (LCA) SIMPLIFICADO */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-black text-[#162056] uppercase tracking-tight">
            Inteligência de Ciclo de Vida (LCA) simplificado
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Impacto ambiental por fase de ciclo de vida do cartão físico.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Gráfico Donut (Col-Span 5) */}
          <div className="lg:col-span-5 h-[260px] relative flex items-center justify-center bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="cursor-pointer hover:opacity-85 transition-opacity outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${Number(value || 0).toFixed(2)} tCO₂e`, 'Emissão']}
                  contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Texto Centralizado */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-[#162056] tracking-tight">{lcaCalculos.totalFis.toFixed(2)} tCO₂e</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Pegada Total</span>
            </div>
          </div>

          {/* Cards Laterais / Modo de Detalhamento Dinâmico (Col-Span 7) */}
          <div className="lg:col-span-7 relative min-h-[220px]">
            <AnimatePresence mode="wait">
              {faseDetalhe === null ? (
                // --- LISTA GERAL DAS FASES ---
                <motion.div 
                  key="list"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {/* Produção */}
                  <div 
                    onClick={() => setFaseDetalhe('producao')}
                    className="bg-[#EAEAEA] p-5 rounded-2xl border border-transparent hover:border-slate-300 transition-all cursor-pointer text-center group flex flex-col justify-between h-[180px]"
                  >
                    <div className="mx-auto p-2.5 bg-white/70 rounded-xl text-[#162056] group-hover:scale-110 transition-transform">
                      <Building size={16} />
                    </div>
                    <span className="text-[11px] font-black text-[#162056] uppercase tracking-wider block mt-2">Produção</span>
                    <div>
                      <p className="text-2xl font-black text-[#162056]">42%</p>
                      <p className="text-[10px] text-[#162056]/60 font-semibold">{lcaCalculos.prodFis.toFixed(2)} tCO₂e</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 mt-2 bg-white/80 py-1 rounded-lg">Ver detalhes</span>
                  </div>

                  {/* Transporte */}
                  <div 
                    onClick={() => setFaseDetalhe('transporte')}
                    className="bg-[#EAEAEA] p-5 rounded-2xl border border-transparent hover:border-slate-300 transition-all cursor-pointer text-center group flex flex-col justify-between h-[180px]"
                  >
                    <div className="mx-auto p-2.5 bg-white/70 rounded-xl text-[#7FC2E4] group-hover:scale-110 transition-transform">
                      <Truck size={16} />
                    </div>
                    <span className="text-[11px] font-black text-[#162056] uppercase tracking-wider block mt-2">Transporte</span>
                    <div>
                      <p className="text-2xl font-black text-[#162056]">18%</p>
                      <p className="text-[10px] text-[#162056]/60 font-semibold">{lcaCalculos.transFis.toFixed(2)} tCO₂e</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 mt-2 bg-white/80 py-1 rounded-lg">Ver detalhes</span>
                  </div>

                  {/* Uso */}
                  <div 
                    onClick={() => setFaseDetalhe('uso')}
                    className="bg-[#EAEAEA] p-5 rounded-2xl border border-transparent hover:border-slate-300 transition-all cursor-pointer text-center group flex flex-col justify-between h-[180px]"
                  >
                    <div className="mx-auto p-2.5 bg-white/70 rounded-xl text-[#E1EA80] group-hover:scale-110 transition-transform">
                      <Monitor size={16} />
                    </div>
                    <span className="text-[11px] font-black text-[#162056] uppercase tracking-wider block mt-2">Uso</span>
                    <div>
                      <p className="text-2xl font-black text-[#162056]">28%</p>
                      <p className="text-[10px] text-[#162056]/60 font-semibold">{lcaCalculos.usoFis.toFixed(2)} tCO₂e</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 mt-2 bg-white/80 py-1 rounded-lg">Ver detalhes</span>
                  </div>

                  {/* Descarte */}
                  <div 
                    onClick={() => setFaseDetalhe('descarte')}
                    className="bg-[#EAEAEA] p-5 rounded-2xl border border-transparent hover:border-slate-300 transition-all cursor-pointer text-center group flex flex-col justify-between h-[180px]"
                  >
                    <div className="mx-auto p-2.5 bg-white/70 rounded-xl text-[#F72717] group-hover:scale-110 transition-transform">
                      <Trash2 size={16} />
                    </div>
                    <span className="text-[11px] font-black text-[#162056] uppercase tracking-wider block mt-2">Descarte</span>
                    <div>
                      <p className="text-2xl font-black text-[#162056]">12%</p>
                      <p className="text-[10px] text-[#162056]/60 font-semibold">{lcaCalculos.descFis.toFixed(2)} tCO₂e</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 mt-2 bg-white/80 py-1 rounded-lg">Ver detalhes</span>
                  </div>
                </motion.div>
              ) : (
                // --- DETALHES DE UMA FASE SELECIONADA ---
                <motion.div 
                  key="detail"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-[#B0B4C0]/50 p-6 rounded-3xl border border-slate-300/40 space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-300 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#162056] uppercase tracking-wider">Fase de {detalhesFase[faseDetalhe].titulo}</span>
                      <span className="text-[9px] font-black bg-[#162056] text-white px-2 py-0.5 rounded-full">{detalhesFase[faseDetalhe].percent}</span>
                    </div>
                    <span className="text-xs font-black text-[#162056]">{detalhesFase[faseDetalhe].total.toFixed(2)} tCO₂e</span>
                  </div>

                  <div className="space-y-2">
                    {detalhesFase[faseDetalhe].itens.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] font-semibold text-slate-600">
                        <span>{item.label}</span>
                        <span className="font-extrabold text-[#162056]">{item.val} tCO₂e</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-300 flex justify-between items-center">
                    <span className="text-[9px] font-black text-[#162056]/50 uppercase tracking-widest">Apoio a tomada de decisão</span>
                    <button 
                      onClick={() => setFaseDetalhe(null)}
                      className="bg-white/80 text-[#162056] hover:bg-white text-[10px] font-bold px-4 py-1.5 rounded-xl border border-slate-300 transition-all flex items-center gap-1"
                    >
                      <ArrowLeft size={12} /> Voltar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: COMPARAR IMPACTO FÍSICO VS. DIGITAL POR FASE */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-black text-[#162056] uppercase tracking-tight">
            Comparar impacto físico vs. digital por fase
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Valores em tCO₂e
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Produção */}
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-black text-[#162056] uppercase tracking-wider flex items-center gap-1">
              <Building size={12} /> Produção
            </span>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-semibold">Físico</span>
                <span className="font-black text-[#162056]">{lcaCalculos.prodFis.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#162056] h-full rounded-full" style={{ width: '100%' }} />
              </div>
              
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-400 font-semibold">Digital</span>
                <span className="font-black text-[#162056]">{lcaCalculos.prodDig.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#7FC2E4] h-full rounded-full" style={{ width: '22%' }} />
              </div>
            </div>
            <div className="mt-4 text-[9px] font-black text-[#F72717] flex items-center gap-0.5">
               <span>↓ 78% menor</span>
            </div>
          </div>

          {/* Transporte */}
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-black text-[#162056] uppercase tracking-wider flex items-center gap-1">
              <Truck size={12} /> Transporte
            </span>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-semibold">Físico</span>
                <span className="font-black text-[#162056]">{lcaCalculos.transFis.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#162056] h-full rounded-full" style={{ width: '100%' }} />
              </div>
              
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-400 font-semibold">Digital</span>
                <span className="font-black text-[#162056]">{lcaCalculos.transDig.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#7FC2E4] h-full rounded-full" style={{ width: '17%' }} />
              </div>
            </div>
            <div className="mt-4 text-[9px] font-black text-[#F72717] flex items-center gap-0.5">
               <span>↓ 83% menor</span>
            </div>
          </div>

          {/* Uso */}
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-black text-[#162056] uppercase tracking-wider flex items-center gap-1">
              <Monitor size={12} /> Uso
            </span>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-semibold">Físico</span>
                <span className="font-black text-[#162056]">{lcaCalculos.usoFis.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#162056] h-full rounded-full" style={{ width: '100%' }} />
              </div>
              
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-400 font-semibold">Digital</span>
                <span className="font-black text-[#162056]">{lcaCalculos.usoDig.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#7FC2E4] h-full rounded-full" style={{ width: '48%' }} />
              </div>
            </div>
            <div className="mt-4 text-[9px] font-black text-[#F72717] flex items-center gap-0.5">
               <span>↓ 52% menor</span>
            </div>
          </div>

          {/* Descarte */}
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-black text-[#162056] uppercase tracking-wider flex items-center gap-1">
              <Trash2 size={12} /> Descarte
            </span>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-semibold">Físico</span>
                <span className="font-black text-[#162056]">{lcaCalculos.descFis.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#162056] h-full rounded-full" style={{ width: '100%' }} />
              </div>
              
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-400 font-semibold">Digital</span>
                <span className="font-black text-[#162056]">{lcaCalculos.descDig.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#7FC2E4] h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>
            <div className="mt-4 text-[9px] font-black text-[#F72717] flex items-center gap-0.5">
               <span>↓ 82% menor</span>
            </div>
          </div>

          {/* Total do Ciclo de Vida (Card Cinza Escuro conforme Imagem) */}
          <div className="p-5 bg-[#B0B4C0] rounded-2xl flex flex-col justify-between text-black">
            <span className="text-[10px] font-black uppercase tracking-wider">Total do ciclo de vida</span>
            
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center border-b border-black/10 pb-1.5">
                <span className="text-[10px] font-bold text-black/60">Físico</span>
                <span className="text-sm font-black">{lcaCalculos.totalFis.toFixed(2)} tCO₂e</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-[10px] font-bold text-black/60">Digital</span>
                <span className="text-sm font-black">{lcaCalculos.totalDig.toFixed(2)} tCO₂e</span>
              </div>
            </div>

            <div className="mt-4 text-xs font-black flex items-center gap-0.5">
               <span>↓ 72% menor</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
