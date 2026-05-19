import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FlaskConical, FolderPlus, Plus } from 'lucide-react'

export const metadata: Metadata = { title: 'Testes A/B' }

export default function TestesABPage() {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <FlaskConical size={20} className="text-accent" />
          Testes A/B
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md">
            <FolderPlus size={14} />
            Nova Pasta
          </Button>
          <Button variant="accent" size="md">
            <Plus size={14} />
            Novo teste
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FlaskConical size={28} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-foreground">
            Nenhum teste A/B encontrado. Que tal{' '}
            <button className="text-accent hover:underline">criar o primeiro teste</button>{' '}
            aqui?
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
