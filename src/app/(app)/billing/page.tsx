import type { Metadata } from 'next'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'

export const metadata: Metadata = { title: 'Plano' }

export default async function BillingPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  const playsUsedPct = Math.min(100, Math.round((profile.plays_used / profile.plays_limit) * 100))

  return (
    <div className="max-w-lg">
      <PageHeader title="Plano" description="Seu uso atual e limites." />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Plano atual</CardTitle>
            <Badge variant={profile.plan_id === 'trial' ? 'warning' : 'success'}>
              {profile.plan_id.charAt(0).toUpperCase() + profile.plan_id.slice(1)}
            </Badge>
          </div>
          {profile.trial_ends_at && profile.plan_id === 'trial' && (
            <CardDescription>
              Trial expira em {new Date(profile.trial_ends_at).toLocaleDateString('pt-BR')}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Plays usage */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Plays usados</span>
              <span className="font-medium">
                {formatNumber(profile.plays_used)} / {formatNumber(profile.plays_limit)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${playsUsedPct}%` }}
              />
            </div>
          </div>

          {/* Videos usage */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Limite de vídeos</span>
            <span className="font-medium">{formatNumber(profile.videos_limit)} vídeos</span>
          </div>

          <div className="rounded-lg bg-surface-raised p-4 text-sm text-muted-foreground">
            Planos pagos com mais plays e vídeos em breve. Acompanhe as novidades.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
