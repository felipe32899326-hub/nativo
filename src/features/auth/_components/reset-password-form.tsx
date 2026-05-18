'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { resetPassword } from '../_lib/actions'

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await resetPassword(formData)
      if (result?.error) setError(result.error)
      if (result?.success) setSuccess(result.success)
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
        Enviar link de recuperação
      </Button>
    </form>
  )
}
