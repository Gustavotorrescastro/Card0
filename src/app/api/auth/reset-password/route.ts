import { NextResponse } from 'next/server'
import { resetPasswordWithCode } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, code, password } = await request.json()

    if (!email || !code || !password) {
      return NextResponse.json(
        { error: 'E-mail, código e nova senha são obrigatórios.' },
        { status: 400 }
      )
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        { error: 'A nova senha deve ter no mínimo 8 caracteres.' },
        { status: 400 }
      )
    }

    const result = resetPasswordWithCode(
      String(email).trim().toLowerCase(),
      String(code).trim(),
      String(password)
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: result.message })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Erro ao redefinir senha.' },
      { status: 500 }
    )
  }
}
