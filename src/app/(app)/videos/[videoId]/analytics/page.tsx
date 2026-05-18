import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { getVideoAnalytics } from '@/features/analytics/_lib/queries'
import { formatDuration, formatNumber } from '@/lib/utils'
import { Play, Clock, CheckCircle, MousePointerClick, Smartphone, Monitor } from 'lucide-react'

export const metadata: Metadata = { title: 'Analytics' }

export default async function VideoAnalyticsPage(props: PageProps<'/videos/[videoId]/analytics'>) {
  const { videoId } = await props.params
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: video } = await supabase
    .from('videos')
    .select('id, title, user_id')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single()

  if (!video) notFound()

  const analytics = await getVideoAnalytics(supabase, videoId)

  return (
    <div>
      <PageHeader
        title="Analytics"
        description={video.title}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Play size={16} />} label="Total de plays" value={formatNumber(analytics.totalPlays)} />
        <StatCard icon={<Clock size={16} />} label="Watch time médio" value={formatDuration(analytics.avgWatchSeconds)} />
        <StatCard icon={<CheckCircle size={16} />} label="Taxa de conclusão" value={`${analytics.completionRate}%`} />
        <StatCard icon={<MousePointerClick size={16} />} label="Cliques no CTA" value={formatNumber(analytics.ctaClicks)} />
      </div>

      {/* Device breakdown */}
      <Card>
        <CardContent>
          <h3 className="text-sm font-medium text-foreground mb-4">Dispositivos</h3>
          <div className="space-y-3">
            {Object.entries(analytics.deviceBreakdown).map(([device, count]) => {
              const pct = analytics.totalPlays > 0 ? Math.round((count / analytics.totalPlays) * 100) : 0
              return (
                <div key={device} className="flex items-center gap-3">
                  {device === 'mobile' ? <Smartphone size={14} className="text-muted-foreground" /> : <Monitor size={14} className="text-muted-foreground" />}
                  <span className="text-sm text-muted-foreground capitalize w-20">{device}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-surface-raised overflow-hidden">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">{pct}%</span>
                </div>
              )
            })}
            {Object.keys(analytics.deviceBreakdown).length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum dado ainda.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">{icon}<span className="text-xs">{label}</span></div>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  )
}
