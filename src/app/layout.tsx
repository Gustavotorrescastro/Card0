import './globals.css' // Importante para o Tailwind carregar
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Card0 - Edenred',
    description: 'Simulador de Risco Operacional',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    )
}