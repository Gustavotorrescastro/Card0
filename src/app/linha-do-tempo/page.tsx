"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import axios from 'axios';
import { Calendar, Leaf, Trophy } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setMounted(true), []);

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

  // Enquanto não monta, mantém um fundo neutro para evitar flash de cor
  if (!mounted) return <div className="min-h-screen bg-white dark:bg-[#0F0F0F]" />;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 dark:bg-[#1A1A1A] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 transition-colors">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Linha do Tempo de Impacto</h1>
                <p className="text-gray-600 dark:text-gray-400">Rastreie sua jornada sustentável.</p>
              </div>

              <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">ID do Usuário</label>
                  <input 
                    type="text" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Data de Adesão</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    required 
                    className="w-full px-4 py-3 bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="md:col-span-2 w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-md"
                >
                  {loading ? 'Calculando...' : 'Ver Impacto'}
                </button>
              </form>

              {impactData && (
                <div className="mt-12 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#252525] p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
                      <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary"><Calendar size={28} /></div>
                      <div>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Dias</span>
                        <span className="text-3xl font-black">{impactData.accumulatedImpact.days}</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-[#252525] p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
                      <div className="p-3 bg-green-500/10 rounded-full text-green-500"><Leaf size={28} /></div>
                      <div>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">CO₂ Evitado</span>
                        <span className="text-3xl font-black text-green-600 dark:text-green-500">{impactData.accumulatedImpact.totalKgCO2.toFixed(2)} kg</span>
                      </div>
                    </div>
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