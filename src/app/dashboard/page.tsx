import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F]">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto text-white">
            <header className="mb-8">
              <h1 className="text-4xl font-bold">Bem-vindo ao Card0</h1>
              <p className="text-gray-400 mt-2">Selecione uma funcionalidade no menu lateral para começar.</p>
            </header>

            {/* Cards de Resumo Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 hover:border-edenred-primary transition-colors cursor-pointer">
                <h3 className="text-xl font-bold mb-2">Simulador de Risco</h3>
                <p className="text-gray-400 text-sm">Calcule o impacto ambiental e financeiro da migração digital.</p>
              </div>
              
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 hover:border-edenred-primary transition-colors cursor-pointer">
                <h3 className="text-xl font-bold mb-2">Linha do Tempo</h3>
                <p className="text-gray-400 text-sm">Visualize o acúmulo anual de riscos e reduções de CO2.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}