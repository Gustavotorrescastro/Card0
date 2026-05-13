'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Header from '@/components/Header'
import TopNavbar from '@/components/TopNavbar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-[#f6edee]">
        <Header />
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
