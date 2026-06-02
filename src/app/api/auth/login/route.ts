import { NextResponse } from 'next/server'
import { getUsers } from '@/lib/db'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const isAdmin = email === 'admin@card0.com.br' && password === 'senha123'
  if (isAdmin) {
    return NextResponse.json({
      message: 'OK',
      user: {
        name: 'Administrador',
        email: 'admin@card0.com.br',
        city: 'Recife',
        state: 'Pernambuco',
      },
    }, { status: 200 })
  }

  const users = getUsers()
  const user = users.find((u: any) => u.email === email && u.password === password)

  if (!user) {
    return NextResponse.json(
        { error: 'Email ou senha incorretos. Tente novamente.' },
        { status: 401 }
    )
  }

  if (!user.emailVerified) {
    return NextResponse.json(
        { error: 'Você precisa verificar seu e-mail antes de fazer login. Verifique sua caixa de entrada.' },
        { status: 403 }
    )
  }

  return NextResponse.json({
    message: 'OK',
    user: {
      name: user.name,
      email: user.email,
      city: user.city,
      state: user.state,
    },
  }, { status: 200 })
}