import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Aqui você adicionaria a lógica para salvar no banco de dados (Ex: Prisma/PostgreSQL)
    console.log('Solicitação de cadastro recebida:', { name, email })

    // Simulação de sucesso
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Usuário criado com sucesso', user: { name, email } },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar cadastro' },
      { status: 500 }
    )
  }
}