import { Montserrat } from 'next/font/google'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { UserProvider } from '@/context/UserContext'
import PageTitle from '@/components/PageTitle'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Card∅',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning className={montserrat.variable}>
      <body className={montserrat.className}>
        <PageTitle />
        <AuthProvider>
          <UserProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
