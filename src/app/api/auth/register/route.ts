import { NextResponse } from 'next/server'
import { getUsers, saveUser } from '@/lib/db'

export async function POST(request: Request) {
  try{
    const body = await request.json()
    const { name, email, password } = body
    if(!name || !email || !password){
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }
    const users = getUsers()
    const userExists = users.find((u: any) => u.email === email)
    if(userExists){
      return NextResponse.json(
        { error: 'Este email já está cadastrado.' },
        { status: 400 }
      )
    }
    saveUser({ name, email, password })
    return NextResponse.json(
      { message: 'Usuário criado com sucesso', user: { name, email } },
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