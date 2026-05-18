import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/features/auth/_components/login-form'

export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Bem-vindo de volta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Entre na sua conta para continuar.
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Não tem conta?{' '}
        <Link href="/signup" className="text-foreground hover:text-accent transition-colors font-medium">
          Criar conta grátis
        </Link>
      </p>
    </div>
  )
}
