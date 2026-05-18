'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-semibold text-foreground">Algo deu errado</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Ocorreu um erro inesperado. Se o problema persistir, entre em contato com o suporte.
      </p>
      <Button variant="accent" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  )
}
