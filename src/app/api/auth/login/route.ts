import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Lógica temporária: aceita qualquer email se a senha tiver >= 6 caracteres
  if (password && password.length >= 6) {
    return NextResponse.json({ message: 'OK' }, { status: 200 })
  }

  return NextResponse.json({ error: 'Senha demasiado curta ou inválida' }, { status: 401 })
}