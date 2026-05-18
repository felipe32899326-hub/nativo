import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { EmbedPlayer } from './embed-player'
import type { PlayerConfig } from '@/types/player'

export default async function EmbedPage(props: PageProps<'/embed/[videoId]'>) {
  const { videoId } = await props.params

  const supabase = await getSupabaseServerClient()

  // Fetch with anon key — RLS allows published videos
  const { data: video } = await supabase
    .from('videos')
    .select('id, playback_url, thumbnail_url, player_config, title')
    .eq('id', videoId)
    .eq('is_published', true)
    .eq('is_deleted', false)
    .single()

  if (!video || !video.playback_url) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <p className="text-white/50 text-sm">Vídeo não disponível.</p>
      </div>
    )
  }

  const cfg = (video.player_config ?? {}) as PlayerConfig
  const playerConfig: PlayerConfig = {
    ...cfg,
    videoId: video.id,
    sessionId: '',
    playbackUrl: video.playback_url,
    autoplay: cfg.autoplay ?? true,
    muted: cfg.muted ?? true,
  }

  return <EmbedPlayer config={playerConfig} />
}
