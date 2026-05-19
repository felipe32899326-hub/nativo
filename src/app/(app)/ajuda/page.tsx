import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { HelpCircle, Mail, MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'Ajuda' }

export default function AjudaPage() {
  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
        <HelpCircle size={20} className="text-accent" />
        Ajuda
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
              <Mail size={18} className="text-accent" />
            </div>
            <h2 className="mb-1 text-base font-semibold text-foreground">Email</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Entre em contato direto com nosso suporte.
            </p>
            <a
              href="mailto:suporte@nativo.app"
              className="text-sm text-accent hover:underline"
            >
              suporte@nativo.app
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
              <MessageSquare size={18} className="text-accent" />
            </div>
            <h2 className="mb-1 text-base font-semibold text-foreground">Chat</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Fale com nosso time pelo chat (em breve).
            </p>
            <span className="text-sm text-muted-foreground">Disponível em breve</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
