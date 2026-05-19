'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Settings as SettingsIcon, CreditCard, User, Users, Code, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'financeiro' | 'conta' | 'membros' | 'api'

const tabs: { id: Tab; label: string; icon: typeof CreditCard }[] = [
  { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
  { id: 'conta', label: 'Conta', icon: User },
  { id: 'membros', label: 'Membros', icon: Users },
  { id: 'api', label: 'API do Analytics', icon: Code },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('financeiro')

  return (
    <div>
      <h1 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
        <SettingsIcon size={20} className="text-accent" />
        Configurações
      </h1>

      {/* Tabs */}
      <div className="mb-5 flex items-center gap-6 border-b border-border">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 border-b-2 py-3 text-sm transition-colors -mb-px',
              tab === id
                ? 'border-accent text-accent font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'financeiro' && <FinanceiroTab />}
      {tab === 'conta' && <ContaTab />}
      {tab === 'membros' && <MembrosTab />}
      {tab === 'api' && <ApiTab />}
    </div>
  )
}

function FinanceiroTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Plano</p>
              <p className="text-2xl font-bold text-foreground">Trial</p>
              <p className="mt-1 text-sm text-muted-foreground">Gratuito por 7 dias</p>
            </div>
            <Button variant="accent" size="md">Alterar o meu plano</Button>
          </div>

          <div className="my-5 h-px bg-border" />

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Benefícios</span>
              <span className="text-foreground">1.500 plays + 10 vídeos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Uso do plano</span>
              <span className="text-foreground">0 / 1.500 plays</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-0 rounded-full bg-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Pagamento</p>
            <h2 className="mb-3 text-base font-semibold text-foreground">Formas de pagamento</h2>
            <p className="text-sm text-muted-foreground">Nenhum cartão cadastrado.</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Pagamento</p>
            <h2 className="mb-3 text-base font-semibold text-foreground">Histórico de faturas</h2>
            <p className="text-sm text-muted-foreground">Sem faturas ainda.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ContaTab() {
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <CardContent>
        <h2 className="mb-4 text-base font-semibold text-foreground">Informações da conta</h2>
        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <Input name="full_name" label="Nome completo" placeholder="Seu nome" />
          <Button type="submit" variant="accent">
            {saved ? <><Check size={14} /> Salvo!</> : 'Salvar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function MembrosTab() {
  return (
    <Card>
      <CardContent>
        <h2 className="mb-2 text-base font-semibold text-foreground">Membros</h2>
        <p className="text-sm text-muted-foreground">Convide membros da sua equipe (em breve).</p>
      </CardContent>
    </Card>
  )
}

function ApiTab() {
  return (
    <Card>
      <CardContent>
        <h2 className="mb-2 text-base font-semibold text-foreground">API do Analytics</h2>
        <p className="text-sm text-muted-foreground">Use a API para integrar dados em seus sistemas (em breve).</p>
      </CardContent>
    </Card>
  )
}
