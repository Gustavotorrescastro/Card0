import { NextResponse } from 'next/server'
import { verifyUserEmail } from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
        return NextResponse.redirect(
            new URL('/verificar-email?status=invalid', request.url)
        )
    }

    const result = verifyUserEmail(token)

    if (result.success) {
        return NextResponse.redirect(
            new URL('/verificar-email?status=success', request.url)
        )
    } else {
        const status = result.message.includes('expirado') ? 'expired' : 'invalid'
        return NextResponse.redirect(
            new URL(`/verificar-email?status=${status}`, request.url)
        )
    }
}