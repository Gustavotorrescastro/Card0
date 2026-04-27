'use client';

import { useState } from 'react';

export default function ComparadorSustentabilidade() {
  const [escala, setEscala] = useState<number>(1000);
  const [cenario, setCenario] = useState<'fisico' | 'digital'>('fisico');
  const [regiao, setRegiao] = useState<'brasil' | 'europa'>('brasil');
  const [anosUso, setAnosUso] = useState<number>(3); 

  const calcularPegada = () => {
    if (cenario === 'fisico') {
      const custoEmissaoInicial = escala * 5.0; 
      const quantidadeRenovacoes = Math.floor(anosUso / 3);
      const custoRenovacoes = escala * quantidadeRenovacoes * 5.0;
      
      return custoEmissaoInicial + custoRenovacoes;
    } else {
      const custoBaseAnual = 0.5; 
      const multiplicadorMatriz = regiao === 'brasil' ? 0.2 : 1.8;
      
      return escala * custoBaseAnual * multiplicadorMatriz * anosUso;
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-gray-50 rounded-xl shadow-md space-y-6 text-slate-800">
      <h1 className="text-2xl font-bold">Calculadora de Impacto Ambiental</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-2">Quantidade de Cartões: {escala}</label>
          <input 
            type="range" 
            min="100" max="10000" step="100"
            value={escala}
            onChange={(e) => setEscala(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Tempo de Análise: {anosUso} anos</label>
          <input 
            type="range" 
            min="1" max="15" step="1"
            value={anosUso}
            onChange={(e) => setAnosUso(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <p className="text-xs text-gray-500 mt-1">
            * Cartões físicos são renovados automaticamente a cada 3 anos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Cenário</label>
          <select 
            value={cenario} 
            onChange={(e) => setCenario(e.target.value as 'fisico' | 'digital')}
            className="w-full p-2 border rounded bg-white"
          >
            <option value="fisico">Cartão Físico</option>
            <option value="digital">Wallet (Apple/Google Pay)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Matriz Energética</label>
          <select 
            value={regiao} 
            onChange={(e) => setRegiao(e.target.value as 'brasil' | 'europa')}
            className={`w-full p-2 border rounded ${cenario === 'fisico' ? 'bg-gray-200 text-gray-400' : 'bg-white'}`}
            disabled={cenario === 'fisico'} 
          >
            <option value="brasil">Brasil (Hidrelétrica)</option>
            <option value="europa">Europa (Mista/Carvão)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 p-6 bg-green-100 rounded-lg text-center transition-all duration-300">
        <h2 className="text-xl font-bold text-green-800">Impacto Estimado</h2>
        <p className="text-4xl font-black text-green-600 mt-2">
          {calcularPegada().toFixed(2)} <span className="text-lg font-medium">kg CO₂</span>
        </p>
      </div>
    </div>
  );
}