'use client'

import { useState, useMemo } from 'react'
import { Recycle, Map as MapIcon, TreeDeciduous, Cloud, MapPin, ArrowRight, CheckCircle2, ShieldCheck, Download, X, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LogisticaReversaPage() {
  const [quantidade, setQuantidade] = useState(5000)
  const [projetoOffset, setProjetoOffset] = useState('amazonia')
  const [showModal, setShowModal] = useState<null | 'certificado' | 'offset'>(null)
  const [loading, setLoading] = useState(false)

  // Cálculos de reciclagem (estimativas)
  const metricasReciclagem = useMemo(() => {
    const plasticoPorCartao = 0.005 // 5g de PVC
    const co2EvitadoPorKg = 1.6 // 1.6kg CO2 por kg de PVC reciclado
    const totalPlastico = quantidade * plasticoPorCartao
    const totalCO2 = totalPlastico * co2EvitadoPorKg
    return {
      plastico: totalPlastico.toFixed(1),
      co2: totalCO2.toFixed(1),
      metais: (quantidade * 0.0001).toFixed(2) // Estimativa de metais recuperados
    }
  }, [quantidade])

  const projetos = [
    { id: 'amazonia', name: 'Reflorestamento Amazônico', cost: 15, unit: 'ton', description: 'Proteção de áreas degradadas e plantio de espécies nativas.' },
    { id: 'energia-eolica', name: 'Parques Eólicos Nordeste', cost: 12, unit: 'ton', description: 'Geração de energia limpa substituindo fontes fósseis.' },
  ]

  const pontosColeta = [
    { nome: 'Unidade Centro - Digital Bank', endereco: 'Rua das Flores, 123 - Centro', status: 'Seguro' },
    { nome: 'EcoPonto Sul', endereco: 'Av. das Árvores, 456 - Boa Viagem', status: 'Seguro' },
    { nome: 'Shopping Recife (Quiosque)', endereco: 'Rua Padre Carapuceiro, 777', status: 'Seguro' },
  ]

  const handleAction = (type: 'certificado' | 'offset') => {
    setLoading(true)
    // Simula processamento
    setTimeout(() => {
      setLoading(false)
      setShowModal(type)
    }, 1500)
  }

  return (
    <div className="space-y-8 pb-16 w-full px-1 md:px-0">
      {/* MODAL DE SUCESSO */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#162056]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowModal(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-[#162056] transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-[#7FC2E4]/20 rounded-full flex items-center justify-center text-[#7FC2E4] mx-auto">
                  {showModal === 'certificado' ? <CheckCircle2 size={40} /> : <Heart size={40} />}
                </div>

                <div>
                  <h3 className="text-2xl font-black text-[#162056] uppercase tracking-tighter">
                    {showModal === 'certificado' ? 'Certificado Pronto!' : 'Compensação Realizada!'}
                  </h3>
                  <p className="text-slate-500 font-medium mt-2 text-xs">
                    {showModal === 'certificado' 
                      ? 'Seu selo de reciclagem foi gerado com base nas métricas de descarte.' 
                      : `Você contribuiu com o projeto ${projetos.find(p => p.id === projetoOffset)?.name}.`}
                  </p>
                </div>

                <div className="bg-[#F5F5F5] p-6 rounded-3xl border border-[#E2E8F0]">
                   <div className="flex justify-between text-xs font-bold text-[#162056] uppercase tracking-widest mb-1">
                      <span>{showModal === 'certificado' ? 'ID do Documento' : 'CO₂ Compensado'}</span>
                      <span className="text-[#7FC2E4]">{showModal === 'certificado' ? '#C02-2024-X' : `${metricasReciclagem.co2}kg`}</span>
                   </div>
                </div>

                <button 
                  onClick={() => setShowModal(null)}
                  className="w-full bg-[#162056] text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-[#162056]/20"
                >
                  {showModal === 'certificado' ? (
                    <><Download size={18} /> Baixar PDF</>
                  ) : 'Concluído'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER DA PÁGINA */}
      <section className="text-center space-y-4">
        <div className="inline-flex p-3 bg-[#7FC2E4]/20 rounded-2xl text-[#7FC2E4] mb-2">
          <Recycle size={32} />
        </div>
        <h1 className="text-4xl font-black text-[#162056] uppercase tracking-tighter">Logística Reversa</h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-xs">
          Gerencie o ciclo de vida dos seus cartões físicos através do descarte consciente e compensação de carbono.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. CALCULADORA DE BENEFÍCIO */}
        <section className="bg-white p-8 rounded-[3rem] border border-[#E2E8F0] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#162056] rounded-xl text-[#7FC2E4]">
                <Cloud size={20} />
              </div>
              <h2 className="text-xl font-black text-[#162056] uppercase tracking-tight">Benefício da Reciclagem</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                  Quantidade de cartões para descarte: <span className="text-[#162056] text-sm ml-2">{quantidade.toLocaleString()} un</span>
                </label>
                <input 
                  type="range" 
                  min="500" 
                  max="50000" 
                  step="500"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full h-2 bg-[#F5F5F5] rounded-full appearance-none cursor-pointer accent-[#162056]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-[#F5F5F5] rounded-3xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">PVC Recuperado</p>
                  <p className="text-xl font-black text-[#162056]">{metricasReciclagem.plastico}kg</p>
                </div>
                <div className="text-center p-4 bg-[#F5F5F5] rounded-3xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">CO₂ Evitado</p>
                  <p className="text-xl font-black text-green-600">{metricasReciclagem.co2}kg</p>
                </div>
                <div className="text-center p-4 bg-[#F5F5F5] rounded-3xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Metais Nobres</p>
                  <p className="text-xl font-black text-[#F72717]">{metricasReciclagem.metais}g</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#E2E8F0] flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium italic">Dados baseados em padrões ABNT de reciclagem eletrônica.</p>
            <button 
              disabled={loading}
              onClick={() => handleAction('certificado')}
              className="bg-[#162056] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Gerar Certificado'}
            </button>
          </div>
        </section>

        {/* 2. PONTOS DE COLETA (MOCK MAPA) */}
        <section className="bg-white p-8 rounded-[3rem] border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-[#F72717] rounded-xl text-white">
              <MapIcon size={20} />
            </div>
            <h2 className="text-xl font-black text-[#162056] uppercase tracking-tight">Pontos de Coleta Seguros</h2>
          </div>

          <div className="flex-1 flex flex-col gap-4 relative z-10">
             {pontosColeta.map((ponto, idx) => (
               <div key={idx} className="flex items-start gap-4 p-4 rounded-3xl hover:bg-[#F5F5F5]/50 transition-all border border-transparent hover:border-[#E2E8F0] group cursor-pointer">
                 <div className="bg-[#7FC2E4]/10 p-3 rounded-2xl text-[#162056] group-hover:bg-[#162056] group-hover:text-[#7FC2E4] transition-all">
                    <MapPin size={20} />
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-black text-[#162056]">{ponto.nome}</p>
                   <p className="text-xs text-slate-500 font-medium">{ponto.endereco}</p>
                   <div className="mt-2 flex items-center gap-1 text-green-600">
                     <ShieldCheck size={12} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Descarte Seguro com Trituração</span>
                   </div>
                 </div>
                 <ArrowRight size={16} className="text-slate-300 group-hover:text-[#162056]" />
               </div>
             ))}
          </div>

          {/* BACKGROUND DECORATIVO (GRID DE MAPA MOCK) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="grid grid-cols-10 h-full w-full">
              {[...Array(100)].map((_, i) => (
                <div key={i} className="border border-[#162056]" />
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* 3. OFFSET DE CARBONO */}
      <section className="bg-[#162056] p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <TreeDeciduous size={180} />
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-8 text-[#7FC2E4]">
            <TreeDeciduous size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Compensação (Carbon Offset)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <p className="text-white/70 font-medium leading-relaxed text-xs">
                Para emissões que ainda não podem ser evitadas, oferecemos a opção de compensação direta. Seus investimentos são direcionados a projetos certificados.
              </p>
              
              <div className="space-y-4">
                {projetos.map((proj) => (
                  <div 
                    key={proj.id}
                    onClick={() => setProjetoOffset(proj.id)}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                      projetoOffset === proj.id ? 'border-[#7FC2E4] bg-[#7FC2E4]/10' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="font-black text-sm uppercase tracking-wider">{proj.name}</h3>
                      {projetoOffset === proj.id && <CheckCircle2 size={20} className="text-[#7FC2E4]" />}
                    </div>
                    <p className="text-xs text-white/50 mb-4">{proj.description}</p>
                    <p className="text-[10px] font-black text-[#E1EA80] uppercase tracking-[0.2em]">Custo por {proj.unit}: R$ {proj.cost}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-[3rem] p-8 border border-white/10 flex flex-col justify-center items-center text-center">
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-4">Total para Compensar</p>
              <h4 className="text-5xl font-black text-[#E1EA80] mb-2">{metricasReciclagem.co2}kg</h4>
              <p className="text-xs text-white/60 mb-8 italic">CO₂ equivalente gerado</p>
              
              <button 
                disabled={loading}
                onClick={() => handleAction('offset')}
                className="w-full bg-[#E1EA80] text-[#162056] py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#E1EA80]/10 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-6 h-6 border-2 border-[#162056]/30 border-t-[#162056] rounded-full animate-spin" /> : 'Compensar Agora'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
