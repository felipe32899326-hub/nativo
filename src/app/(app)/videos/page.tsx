import type { Metadata } from 'next'
import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { VideoStatusBadge } from '@/features/videos/_components/video-status-badge'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Play, Search, FolderPlus, Video as VideoIcon, BarChart2, Code, MoreVertical } from 'lucide-react'

export const metadata: Metadata = { title: 'Meus vídeos' }

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
      {/* Header with title + tabs + actions */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <VideoIcon size={20} className="text-accent" />
            Meus vídeos
          </h1>
          <nav className="flex items-center gap-5 text-sm">
            <span className="text-accent font-medium">Biblioteca</span>
            <Link href="/videos?tab=top" className="text-muted-foreground hover:text-foreground transition-colors">
              Top vídeos
            </Link>
            <Link href="/videos?tab=trash" className="text-muted-foreground hover:text-foreground transition-colors">
              Lixeira
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar vídeos"
              className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="md">
            <FolderPlus size={14} />
            Nova Pasta
          </Button>
          <Button asChild variant="accent" size="md">
            <Link href="/videos/upload">
              <Upload size={14} />
              Upload
            </Link>
          </Button>
        </div>
      </div>

      {videos && videos.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised">
                <th className="w-10 px-4 py-3 text-left">
                  <input type="checkbox" className="rounded border-border" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-32">Criado em</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-24">Plays</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-32">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {videos.map((video) => (
                <tr key={video.id} className="hover:bg-surface-raised transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-border" />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/videos/${video.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="h-9 w-14 shrink-0 overflow-hidden rounded bg-surface-raised">
                        {video.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <Play size={12} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-accent transition-colors">
                          {video.title}
                        </p>
                        <div className="mt-0.5">
                          <VideoStatusBadge status={video.bunny_status} />
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(video.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">0</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/videos/${video.id}/analytics`}
                        className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Analytics"
                      >
                        <BarChart2 size={14} />
                      </Link>
                      <Link
                        href={`/videos/${video.id}/embed`}
                        className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Embed"
                      >
                        <Code size={14} />
                      </Link>
                      <button
                        type="button"
                        className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Mais"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Play size={28} className="text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-foreground mb-1">Nenhum vídeo ainda</p>
            <p className="text-sm text-muted-foreground mb-5">
              Faça upload da sua primeira VSL para começar.
            </p>
            <Button asChild variant="accent" size="md">
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
