import type { Metadata } from 'next'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/utils'
import { Play, Clock, MousePointerClick, Upload } from 'lucide-react'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: profile }, { data: videos }, { count: totalPlays }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('videos').select('id, title, thumbnail_url, bunny_status, created_at').eq('user_id', user.id).eq('is_deleted', false).order('created_at', { ascending: false }).limit(5),
    supabase.from('play_sessions').select('id', { count: 'exact', head: true }).in(
      'video_id',
      (await supabase.from('videos').select('id').eq('user_id', user.id).eq('is_deleted', false)).data?.map(v => v.id) ?? [],
    ),
  ])

  const playsUsedPct = profile ? Math.min(100, Math.round((profile.plays_used / profile.plays_limit) * 100)) : 0

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua conta."
        action={
          <Button asChild variant="accent" size="sm">
            <Link href="/videos/upload">
              <Upload size={14} />
              Novo vídeo
            </Link>
          </Button>
        }
      />

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={<Play size={16} />}
          label="Plays totais"
          value={formatNumber(profile?.plays_used ?? 0)}
        />
        <MetricCard
          icon={<Play size={16} />}
          label="Plays restantes"
          value={profile ? formatNumber(profile.plays_limit - profile.plays_used) : '—'}
        />
        <MetricCard
          icon={<Clock size={16} />}
          label="Vídeos ativos"
          value={formatNumber(videos?.filter(v => v.bunny_status === 4).length ?? 0)}
        />
        <MetricCard
          icon={<MousePointerClick size={16} />}
          label="Plays (mês)"
          value={formatNumber(totalPlays ?? 0)}
        />
      </div>

      {/* Usage bar */}
      {profile && (
        <Card className="mb-8">
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Uso do plano</span>
              <span className="text-sm font-medium">
                {formatNumber(profile.plays_used)} / {formatNumber(profile.plays_limit)} plays
              </span>
            </div>
            <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${playsUsedPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent videos */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Vídeos recentes</h2>
        {videos && videos.length > 0 ? (
          <div className="space-y-2">
            {videos.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 hover:border-border/60 hover:bg-surface-raised transition-colors"
              >
                <div className="h-12 w-20 rounded-lg bg-surface-raised overflow-hidden shrink-0">
                  {video.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={video.thumbnail_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {video.bunny_status === 4 ? 'Pronto' : video.bunny_status === 5 ? 'Erro' : 'Processando...'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center py-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">Nenhum vídeo ainda.</p>
              <Button asChild variant="accent" size="sm">
                <Link href="/videos/upload">
                  <Upload size={14} />
                  Fazer upload
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">{icon} <span className="text-xs">{label}</span></div>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  )
}
