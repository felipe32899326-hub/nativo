import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { EmbedCodeSnippet } from '@/features/embed/_components/embed-code-snippet'
import { generateEmbedCode } from '@/features/embed/_lib/generate-embed-code'
import { NativoPlayer } from '@/features/player/_components/nativo-player'
import type { PlayerConfig } from '@/types/player'

export const metadata: Metadata = { title: 'Embed' }

export default async function EmbedPage(props: PageProps<'/videos/[videoId]/embed'>) {
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

  const embedCode = generateEmbedCode({ videoId: video.id })

  return (
    <div>
      <PageHeader
        title="Embed"
        description={`Player para: ${video.title}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Preview</h2>
          <div className="max-w-[280px]">
            {video.playback_url ? (
              <NativoPlayer config={playerConfig} />
            ) : (
              <div className="aspect-[9/16] rounded-2xl bg-surface-raised flex items-center justify-center text-sm text-muted-foreground">
                Aguardando processamento...
              </div>
            )}
          </div>
        </div>

        {/* Embed code */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Código de incorporação</CardTitle>
              <CardDescription>
                Cole este código em qualquer página HTML, WordPress, Webflow ou Framer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmbedCodeSnippet code={embedCode} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compatibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['WordPress', 'Webflow', 'Framer', 'Lovable', 'HTML puro', 'Shopify'].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
