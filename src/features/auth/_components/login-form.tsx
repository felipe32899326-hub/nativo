'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signIn } from '../_lib/actions'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await signIn(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full mt-1" loading={isPending}>
        Entrar
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/reset-password" className="hover:text-foreground transition-colors">
          Esqueceu a senha?
        </Link>
      </p>
    </form>
  )
}
