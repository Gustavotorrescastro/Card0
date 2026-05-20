'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Header from '@/components/Header'
import TopNavbar from '@/components/TopNavbar'
import Link from 'next/link'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-[#F0F2F5] font-sans">
        {/* Barra superior com largura total */}
        <Header />
        
        {/* Conteúdo da página */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col items-center">
          {/* Logo CARD.O centralizado abaixo da barra superior */}
          <div className="my-6">
            <Link href="/dashboard" className="text-3xl font-black tracking-[0.2em] text-[#162056] hover:opacity-85 transition-opacity">
              CARD.O
            </Link>
          </div>
          
          {/* Barra de navegação */}
          <TopNavbar />
          
          {/* Conteúdo específico da página */}
          <main className="w-full mt-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
