import { NextResponse } from 'next/server'
import { getUsers } from '@/lib/db'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const users = getUsers()
  const user = users.find((u: any) => u.email === email && u.password === password)

  // Aceita admin hardcoded OU usuário do banco local
  const isAdmin = email === 'admin@card0.com.br' && password === 'senha123'

  if (user || isAdmin) {
    return NextResponse.json({ message: 'OK', user: user || { email: 'admin@card0.com.br' } }, { status: 200 })
  }

  return NextResponse.json({ error: 'Email ou senha incorretos. Tente novamente.' }, { status: 401 })
}