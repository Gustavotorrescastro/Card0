import { NextResponse } from 'next/server'
import { createPasswordResetCode, getUserByEmail } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: 'Informe o e-mail para recuperar a senha.' },
        { status: 400 }
      )
    }

    const user = getUserByEmail(normalizedEmail)
    if (!user) {
      return NextResponse.json(
        { error: 'E-mail não encontrado.' },
        { status: 404 }
      )
    }

    const result = createPasswordResetCode(normalizedEmail)
    if (!result.success || !result.code) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    await sendPasswordResetEmail(normalizedEmail, user.name || 'usuário', result.code)

    return NextResponse.json({
      message: 'Enviamos um código de verificação para o e-mail informado.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar código de recuperação.' },
      { status: 500 }
    )
  }
}
