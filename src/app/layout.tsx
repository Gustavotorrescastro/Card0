import './globals.css'
import type {Metadata} from 'next'
import React from 'react'
export const metadata: Metadata={
  title: 'Card0 - Edenred',
  description: 'Simulador de Risco Operacional',
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return(
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}