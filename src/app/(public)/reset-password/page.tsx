import type { Metadata } from 'next'
import Link from 'next/link'
import { ResetPasswordForm } from '@/features/auth/_components/reset-password-form'

export const metadata: Metadata = { title: 'Recuperar senha' }

export default function ResetPasswordPage() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Recuperar senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enviaremos um link para o seu email.
        </p>
      </div>

      <ResetPasswordForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Lembrou a senha?{' '}
        <Link href="/login" className="text-foreground hover:text-accent transition-colors font-medium">
          Voltar ao login
        </Link>
      </p>
    </div>
  )
}
