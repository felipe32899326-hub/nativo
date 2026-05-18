'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signUp } from '../_lib/actions'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) setError(result.error)
      if (result?.success) setSuccess(result.success)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        name="full_name"
        type="text"
        label="Nome completo"
        placeholder="Seu nome"
        required
        autoComplete="name"
      />
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="você@empresa.com"
        required
        autoComplete="email"
      />
      <Input
        name="password"
        type="password"
        label="Senha"
        placeholder="Mínimo 8 caracteres"
        required
        minLength={8}
        autoComplete="new-password"
      />

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          {success}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full mt-1" loading={isPending}>
        Criar conta grátis
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Ao criar uma conta, você concorda com nossos{' '}
        <a href="#" className="underline hover:text-foreground transition-colors">
          Termos de Uso
        </a>
        .
      </p>
    </form>
  )
}
