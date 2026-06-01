'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Header from '@/components/Header'
import TopNavbar from '@/components/TopNavbar'
import Footer from '@/components/Footer'
import Card0Logo from '@/components/Card0Logo'
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
        <div className="flex-1 w-full px-4 md:px-8 py-4 flex flex-col">
          <div className="my-2 flex w-full justify-center">
            <Link href="/dashboard" className="inline-flex hover:opacity-85 transition-opacity">
              <Card0Logo className="h-6 w-auto" priority />
            </Link>
          </div>
          
          {/* Barra de navegação */}
          <TopNavbar />
          
          {/* Conteúdo específico da página */}
          <main className="w-full mt-4">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
