'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, X, Plus } from 'lucide-react'

export default function SegurancaPage() {
  const [domains, setDomains] = useState<string[]>([''])

  function addDomain() {
    setDomains([...domains, ''])
  }

  function removeDomain(index: number) {
    setDomains(domains.filter((_, i) => i !== index))
  }

  function updateDomain(index: number, value: string) {
    const updated = [...domains]
    updated[index] = value
    setDomains(updated)
  }

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
        <Shield size={20} className="text-accent" />
        Segurança
      </h1>

      <Card>
        <CardContent>
          <h2 className="mb-2 text-base font-semibold text-foreground">Domínios permitidos</h2>
          <p className="mb-1 text-sm text-muted-foreground">
            Cadastre abaixo os domínios permitidos para executar o vídeo.
          </p>
          <p className="mb-1 text-sm text-muted-foreground">
            Se o vídeo for inserido em algum domínio que não estiver listado abaixo, o mesmo não será executado.
          </p>
          <p className="mb-5 text-sm text-muted-foreground">
            Para subdomínios como{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">exemplo.seudominio.com</code>, pode ser usado{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">*</code> para substituir o subdomínio. Ex:{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">*.seudominio.com</code>
          </p>

          <div className="space-y-2">
            {domains.map((domain, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-1 items-stretch rounded-lg border border-border overflow-hidden focus-within:ring-2 focus-within:ring-accent">
                  <span className="flex items-center bg-muted px-3 text-sm text-muted-foreground">
                    http(s)://
                  </span>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => updateDomain(i, e.target.value)}
                    placeholder="seudominio.com.br"
                    className="flex-1 bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDomain(i)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-destructive hover:bg-red-50 transition-colors"
                  title="Remover"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addDomain}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Plus size={14} />
            Adicionar Domínio
          </button>

          <div className="mt-6 border-t border-border pt-5">
            <Button variant="accent" size="md">
              Salvar alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
