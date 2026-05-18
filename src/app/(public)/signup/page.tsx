import type { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from '@/features/auth/_components/signup-form'

export const metadata: Metadata = { title: 'Criar conta' }

export default function SignupPage() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Comece grátis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          7 dias de trial com até 1.500 plays.
        </p>
      </div>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link href="/login" className="text-foreground hover:text-accent transition-colors font-medium">
          Entrar
        </Link>
      </p>
    </div>
  )
}
