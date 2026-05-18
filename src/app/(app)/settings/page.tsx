'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      // Profile update via Supabase to be wired up
      await new Promise((r) => setTimeout(r, 500))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Configurações" description="Informações da sua conta." />

      <Card>
        <CardHeader><CardTitle>Perfil</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input name="full_name" label="Nome completo" placeholder="Seu nome" />
            <Button type="submit" variant="accent" loading={isPending}>
              {saved ? <><Check size={14} /> Salvo!</> : 'Salvar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
