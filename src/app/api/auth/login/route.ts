import { NextResponse } from 'next/server'
import { getUsers } from '@/lib/db'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const isAdmin =
    password === 'senha123' &&
    (email === 'admin@card0.com.br' || email === 'admin@edenred.com.br')
  if (isAdmin) {
    return NextResponse.json({
      message: 'OK',
      user: {
        name: 'Administrador Edenred',
        email,
        empresa: 'Edenred',
        city: 'Recife',
        state: 'Pernambuco',
        role: 'edenred',
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
      empresa: user.empresa || user.company || user.state || 'Empresa cliente',
      city: user.city,
      state: user.state,
      role: 'company',
    },
  }, { status: 200 })
}
