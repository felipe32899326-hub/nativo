import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Target } from 'lucide-react'

export const metadata: Metadata = { title: 'Conversões' }

export default function ConversoesPage() {
  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
        <Target size={20} className="text-accent" />
        Conversões
      </h1>

      <Card>
        <CardContent className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Target size={28} className="text-muted-foreground" />
          </div>
          <p className="text-base font-medium text-foreground mb-1">Conversões</p>
          <p className="text-sm text-muted-foreground">
            Configure pixels e integrações para rastrear conversões. Em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
