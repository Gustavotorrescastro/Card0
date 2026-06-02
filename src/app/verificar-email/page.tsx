'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import Card0Logo from '@/components/Card0Logo'

function VerifyContent() {
    const searchParams = useSearchParams()
    const status = searchParams.get('status')

    const states = {
        success: {
            icon: <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />,
            title: 'E-mail verificado!',
            message: 'Sua conta foi ativada com sucesso. Agora você pode fazer login.',
            cta: 'Ir para o login',
            href: '/login',
            color: 'text-green-600',
        },
        expired: {
            icon: <Clock className="w-16 h-16 text-yellow-500 mx-auto" />,
            title: 'Link expirado',
            message: 'Este link de verificação expirou. O link é válido por 24 horas após o cadastro. Por favor, cadastre-se novamente.',
            cta: 'Refazer cadastro',
            href: '/cadastro',
            color: 'text-yellow-600',
        },
        invalid: {
            icon: <XCircle className="w-16 h-16 text-red-500 mx-auto" />,
            title: 'Link inválido',
            message: 'Este link de verificação não é válido ou já foi utilizado.',
            cta: 'Ir para o login',
            href: '/login',
            color: 'text-red-600',
        },
    }

    const current = states[status as keyof typeof states] ?? states.invalid

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="mb-6">
                    <Card0Logo />
                </div>

                <div className="mb-4">{current.icon}</div>

                <h1 className={`text-2xl font-bold mb-3 ${current.color}`}>
                    {current.title}
                </h1>

                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    {current.message}
                </p>

                <Link
                    href={current.href}
                    className="inline-block w-full bg-[#FF6600] hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    {current.cta}
                </Link>
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyContent />
        </Suspense>
    )
}
