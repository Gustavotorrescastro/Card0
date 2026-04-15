// src/app/api/auth/login/route.ts completo
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Para teste: Aceitar o padrão antigo OU qualquer email que venha do seu formulário
    if (password.length >= 6) { // Regra simples para teste
      return NextResponse.json(
        { message: 'Login realizado com sucesso', user: { email } },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 })
  }
}