"use client";
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import axios from 'axios';
import { Calendar, Leaf, Trophy } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext'; // Importação necessária

interface ImpactData {
  userId: string;
  startDate: string;
  accumulatedImpact: {
    days: number;
    totalKgCO2: number;
    message: string;
  };
}

export default function TimelinePage() {
  const { theme } = useTheme(); // Consumindo o tema para lógica extra se necessário
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/linha-do-tempo?userId=${userId}&startDate=${startDate}`);
      setImpactData(response.data);
    } catch (err) {
      setError('Falha ao calcular o impacto. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Alterado: bg-white para o modo claro e dark:bg-[#0F0F0F] para o escuro
    <div className="min-h-screen flex flex-col bg-edenred-background dark:bg-[#0F0F0F] transition-colors duration-300">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Card Principal: bg-white no claro, bg-[#1A1A1A] no escuro */}
            <div className="bg-white dark:bg-[#1A1A1A] p-8 rounded-2xl shadow-xl border border-edenred-border dark:border-gray-800 transition-colors">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-edenred-text dark:text-white mb-2">
                  Linha do Tempo de Impacto
                </h1>
                <p className="text-edenred-text-secondary dark:text-gray-400">
                  Rastreie sua jornada sustentável desde a adesão ao digital.
                </p>
              </div>

              <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-edenred-text dark:text-gray-300">ID do Usuário</label>
                  <input 
                    type="text" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 bg-white dark:bg-[#121212] border border-edenred-border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-edenred-primary outline-none text-edenred-text dark:text-white transition-all"
                    placeholder="Ex: 12345"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-edenred-text dark:text-gray-300">Data de Adesão</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 bg-white dark:bg-[#121212] border border-edenred-border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-edenred-primary outline-none text-edenred-text dark:text-white transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="md:col-span-2 w-full bg-edenred-primary text-white font-bold py-4 rounded-xl hover:bg-edenred-secondary transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Processando dados...' : 'Calcular Impacto Acumulado'}
                </button>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 rounded-xl text-center">
                  {error}
                </div>
              )}

              {impactData && (
                <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Subcards de resultado */}
                    <div className="bg-gray-50 dark:bg-[#252525] p-6 rounded-xl border border-edenred-border dark:border-gray-700 flex items-center space-x-4">
                      <div className="p-3 bg-edenred-primary/10 rounded-full text-edenred-primary">
                        <Calendar size={28} />
                      </div>
                      <div>
                        <span className="block text-xs text-edenred-text-secondary dark:text-gray-400 uppercase font-bold tracking-widest">Dias no Digital</span>
                        <span className="text-3xl font-black text-edenred-text dark:text-white">{impactData.accumulatedImpact.days}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-[#252525] p-6 rounded-xl border border-edenred-border dark:border-gray-700 flex items-center space-x-4">
                      <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                        <Leaf size={28} />
                      </div>
                      <div>
                        <span className="block text-xs text-edenred-text-secondary dark:text-gray-400 uppercase font-bold tracking-widest">CO₂ Evitado</span>
                        <span className="text-3xl font-black text-green-600 dark:text-green-500">{impactData.accumulatedImpact.totalKgCO2.toFixed(2)} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-edenred-primary/5 dark:bg-edenred-primary/10 p-6 rounded-xl border border-edenred-primary/20 text-center">
                    <Trophy className="mx-auto mb-3 text-edenred-primary" size={32} />
                    <p className="text-edenred-text dark:text-gray-200 font-medium italic">
                      "{impactData.accumulatedImpact.message}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}