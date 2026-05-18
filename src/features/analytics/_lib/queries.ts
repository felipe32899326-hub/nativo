import type { SupabaseClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getVideoAnalytics(supabase: SupabaseClient<any>, videoId: string) {
  const [{ data: sessions, count: totalPlays }, { data: ctaEvents }] = await Promise.all([
    supabase
      .from('play_sessions')
      .select('watch_seconds, completed, device_type, segments_data', { count: 'exact' })
      .eq('video_id', videoId),
    supabase
      .from('cta_events')
      .select('cta_index, clicked_at_second')
      .eq('video_id', videoId),
  ])

  if (!sessions) {
    return { totalPlays: 0, avgWatchSeconds: 0, completionRate: 0, ctaClicks: 0, deviceBreakdown: {} }
  }

  const totalPlaysCount = totalPlays ?? 0
  const avgWatchSeconds =
    totalPlaysCount > 0
      ? sessions.reduce((acc, s) => acc + (s.watch_seconds ?? 0), 0) / totalPlaysCount
      : 0

  const completedCount = sessions.filter((s) => s.completed).length
  const completionRate =
    totalPlaysCount > 0 ? Math.round((completedCount / totalPlaysCount) * 100) : 0

  const deviceBreakdown = sessions.reduce<Record<string, number>>((acc, s) => {
    const device = s.device_type ?? 'unknown'
    acc[device] = (acc[device] ?? 0) + 1
    return acc
  }, {})

  return {
    totalPlays: totalPlaysCount,
    avgWatchSeconds: Math.round(avgWatchSeconds),
    completionRate,
    ctaClicks: ctaEvents?.length ?? 0,
    deviceBreakdown,
  }
}
