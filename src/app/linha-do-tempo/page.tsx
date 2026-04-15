"use client";
import React, { useState } from 'react';
import Page from '@/components/Page';
import axios from 'axios';
interface ImpactData{
    userId: string;
    startDate: string;
    accumulatedImpact: {
        days: number;
        totalKgCO2: number;
        message: string;
    };
}

export default function TimelinePage(){
    const [userId, setUserId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [impactData, setImpactData] = useState<ImpactData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleCalculate = async(e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try{
            const response = await axios.get(`/api/linha-do-tempo?userId=${userId}&startDate=${startDate}`);
            setImpactData(response.data);
        }catch(err){
            setError('Falha ao calcular o impacto. Por favor, verifique os parâmetros.');
        }finally{
            setLoading(false);
        }
    };
    return (
        <Page>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-edenred-border mt-10">
                <h1 className="text-3xl font-bold text-edenred-primary mb-6 text-center">Linha do Tempo de Impacto</h1>
                <p className="text-edenred-textSecondary mb-8 text-center">
                    Descubra quanto impacto ambiental foi evitado desde a adesão aos pagamentos digitais.
                </p>
                <form onSubmit={handleCalculate} className="space-y-6">
                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-edenred-text mb-2">ID do Usuário</label>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-edenred-border rounded-md focus:outline-none focus:ring-2 focus:ring-edenred-primary focus:border-transparent"
                            placeholder="Ex: 12345"
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-edenred-text mb-2">Data de Adesão (Digital)</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-edenred-border rounded-md focus:outline-none focus:ring-2 focus:ring-edenred-primary focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-edenred-primary text-white font-bold py-3 rounded-md hover:bg-edenred-secondary transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Calculando...' : 'Calcular Impacto Acumulado'}
                    </button>
                </form>
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-edenred-primary border border-red-200 rounded-md">
                        {error}
                    </div>
                )}
                {impactData && (
                    <div className="mt-8 p-6 bg-edenred-light border border-edenred-primary rounded-lg text-center shadow-sm">
                        <h2 className="text-xl font-bold text-edenred-dark mb-4">Resultado</h2>
                        <div className="flex flex-col gap-4">
                            <div className="bg-white p-4 rounded-md shadow-sm border border-edenred-border">
                                <span className="block text-sm text-edenred-textSecondary mb-1">Dias no Digital</span>
                                <span className="text-3xl font-black text-edenred-primary">{impactData.accumulatedImpact.days}</span>
                            </div>
                            <div className="bg-white p-4 rounded-md shadow-sm border border-edenred-border">
                                <span className="block text-sm text-edenred-textSecondary mb-1">CO₂ Evitado (kg)</span>
                                <span className="text-3xl font-black text-[#1FA64B]">{impactData.accumulatedImpact.totalKgCO2.toFixed(2)}</span>
                            </div>
                        </div>
                        <p className="mt-6 text-edenred-text font-medium">{impactData.accumulatedImpact.message}</p>
                    </div>
                )}
            </div>
        </Page>
    );
}
