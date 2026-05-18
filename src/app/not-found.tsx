import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-accent mb-4">404</p>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">O link pode ter expirado ou a página foi removida.</p>
        <Button asChild variant="accent">
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  )
}
