'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Profile } from '@/lib/supabase/types'
import { AlertCircle, Check } from 'lucide-react'

interface AdminUserActionsProps {
  user: Profile
}

export function AdminUserActions({ user }: AdminUserActionsProps) {
  const [isBlocked, setIsBlocked] = useState(user.is_blocked)
  const [planId, setPlanId] = useState(user.plan_id)
  const [playsLimit, setPlaysLimit] = useState(String(user.plays_limit))
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    setError(null)
    setSaved(false)

    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_blocked: isBlocked,
          plan_id: planId,
          plays_limit: parseInt(playsLimit) || user.plays_limit,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Erro ao salvar')
        return
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <Card>
      <CardHeader><CardTitle>Ações</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Conta bloqueada</span>
          <button
            onClick={() => setIsBlocked(!isBlocked)}
            className={`relative h-6 w-11 rounded-full transition-colors ${isBlocked ? 'bg-destructive' : 'bg-surface-raised'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isBlocked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Plano</label>
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {['trial', 'free', 'pro', 'business'].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <Input
          label="Limite de plays"
          type="number"
          value={playsLimit}
          onChange={(e) => setPlaysLimit(e.target.value)}
          min="0"
        />

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <Button
          variant="accent"
          className="w-full"
          onClick={handleSave}
          loading={isPending}
        >
          {saved ? <><Check size={14} /> Salvo!</> : 'Salvar'}
        </Button>
      </CardContent>
    </Card>
  )
}
