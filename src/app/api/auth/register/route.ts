import { NextResponse } from 'next/server'
import { getUsers, saveUser } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')?.trim().toLowerCase()

  if (!email) {
    return NextResponse.json(
      { error: 'Email é obrigatório' },
      { status: 400 }
    )
  }

  const users = getUsers()
  const exists = users.some((u: any) => String(u.email).toLowerCase() === email)

  return NextResponse.json({ exists })
}

export async function POST(request: Request) {
  try{
    const body = await request.json()
    const { name, email, password, birthDate, city, state } = body
    if(!name || !email || !password){
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }
    const users = getUsers()
    const userExists = users.find((u: any) => String(u.email).toLowerCase() === String(email).toLowerCase())
    if(userExists){
      return NextResponse.json(
        { error: 'Este email já está cadastrado.' },
        { status: 400 }
      )
    }
    saveUser({ name, email, password, birthDate, city, state })
    return NextResponse.json(
      { message: 'Usuário criado com sucesso', user: { name, email, birthDate, city, state } },
      { status: 201 }
    )
  }catch(error){
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar cadastro' },
      { status: 500 }
    )
  }
}
