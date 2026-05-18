import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoStatusBadge } from '@/features/videos/_components/video-status-badge'
import { NativoPlayer } from '@/features/player/_components/nativo-player'
import { VideoConfigEditor } from './video-config-editor'
import type { PlayerConfig } from '@/types/player'
import { BarChart2, Code, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'Vídeo' }

export default async function VideoDetailPage(props: PageProps<'/videos/[videoId]'>) {
  const { videoId } = await props.params
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: video } = await supabase
    .from('videos')
    .select('*')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single()

  if (!video) notFound()

  const cfg = (video.player_config ?? {}) as PlayerConfig
  const playerConfig: PlayerConfig = {
    ...cfg,
    videoId: video.id,
    sessionId: 'preview',
    playbackUrl: video.playback_url ?? undefined,
    autoplay: false,
    muted: true,
  }

  return (
    <div>
      <div className="mb-5">
        <Link href="/videos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} />
          Voltar para vídeos
        </Link>
      </div>

      <PageHeader
        title={video.title}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/videos/${videoId}/analytics`}>
                <BarChart2 size={14} />
                Analytics
              </Link>
            </Button>
            <Button asChild variant="accent" size="sm">
              <Link href={`/videos/${videoId}/embed`}>
                <Code size={14} />
                Embed
              </Link>
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-6">
        <VideoStatusBadge status={video.bunny_status} />
        {video.duration_seconds && (
          <span className="text-xs text-muted-foreground">
            {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Player preview */}
        <div className="shrink-0">
          {video.playback_url ? (
            <NativoPlayer config={playerConfig} />
          ) : (
            <div className="aspect-[9/16] rounded-2xl bg-surface-raised flex items-center justify-center text-sm text-muted-foreground border border-border">
              {video.bunny_status < 4 ? 'Processando...' : 'Erro no processamento'}
            </div>
          )}
        </div>

        {/* Config editor */}
        <div>
          <VideoConfigEditor video={video} />
        </div>
      </div>
    </div>
  )
}
