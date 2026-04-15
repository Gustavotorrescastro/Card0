import { ThemeProvider } from '@/context/ThemeContext'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning> 
      {/* suppressHydrationWarning evita erros de conflito claro/escuro no primeiro carregamento */}
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}