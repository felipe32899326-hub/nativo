import type { Metadata } from 'next'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { VideoStatusBadge } from '@/features/videos/_components/video-status-badge'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Play } from 'lucide-react'

export const metadata: Metadata = { title: 'Vídeos' }

export default async function VideosPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader
        title="Vídeos"
        description={`${videos?.length ?? 0} vídeo(s)`}
        action={
          <Button asChild variant="accent" size="sm">
            <Link href="/videos/upload">
              <Upload size={14} />
              Novo vídeo
            </Link>
          </Button>
        }
      />

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="group rounded-xl border border-border bg-surface overflow-hidden hover:border-border/60 transition-colors"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-surface-raised relative overflow-hidden">
                {video.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Play size={24} />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <VideoStatusBadge status={video.bunny_status} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(video.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Play size={32} className="text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-foreground mb-1">Nenhum vídeo ainda</p>
            <p className="text-xs text-muted-foreground mb-5">
              Faça upload da sua primeira VSL para começar.
            </p>
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
  )
}
