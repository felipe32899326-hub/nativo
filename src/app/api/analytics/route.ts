import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { getPostHogServerClient } from '@/lib/posthog/client'
import { ANALYTICS_EVENTS } from '@/lib/constants'

const ALLOWED_EVENTS = new Set<string>(Object.values(ANALYTICS_EVENTS))

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    const text = await request.text()
    body = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { event, videoId, sessionId, ...rest } = body

  if (!event || !videoId || !sessionId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!ALLOWED_EVENTS.has(event as string)) {
    return NextResponse.json({ error: 'Unknown event' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()

  // Verify the video is published (prevents spoofed events)
  const { data: video } = await supabase
    .from('videos')
    .select('id, user_id, is_published')
    .eq('id', videoId as string)
    .single()

  if (!video?.is_published) {
    return NextResponse.json({ error: 'Video not available' }, { status: 404 })
  }

  const deviceType = rest.deviceType as string | undefined
  const embedOrigin = rest.embedOrigin as string | undefined
  const countryCode = request.headers.get('x-vercel-ip-country') ?? undefined

  // PostHog server-side capture
  const posthog = await getPostHogServerClient()
  if (posthog) {
    posthog.capture({
      distinctId: (rest.viewerId as string) ?? `anon_${sessionId}`,
      event: event as string,
      properties: {
        videoId,
        sessionId,
        deviceType,
        embedOrigin,
        countryCode,
        ...rest,
      },
    })
    await posthog.shutdown()
  }

  // Handle each event type
  if (event === ANALYTICS_EVENTS.VIDEO_PLAY) {
    await supabase.from('play_sessions').upsert(
      {
        video_id: videoId as string,
        session_id: sessionId as string,
        viewer_id: rest.viewerId as string | undefined,
        embed_origin: embedOrigin,
        device_type: deviceType as 'mobile' | 'tablet' | 'desktop' | undefined,
        country_code: countryCode,
        started_at: new Date().toISOString(),
      },
      { onConflict: 'video_id,session_id', ignoreDuplicates: true },
    )
  } else if (event === ANALYTICS_EVENTS.VIDEO_HEARTBEAT) {
    const watchSeconds = (rest.watchSeconds as number | undefined) ?? 0
    await supabase
      .from('play_sessions')
      .update({ watch_seconds: watchSeconds })
      .eq('video_id', videoId as string)
      .eq('session_id', sessionId as string)
  } else if (event === ANALYTICS_EVENTS.VIDEO_COMPLETE || event === ANALYTICS_EVENTS.VIDEO_ABANDON) {
    await supabase
      .from('play_sessions')
      .update({
        ended_at: new Date().toISOString(),
        watch_seconds: (rest.watchSeconds as number) ?? 0,
        completed: event === ANALYTICS_EVENTS.VIDEO_COMPLETE,
        segments_data: rest.segmentsData ?? null,
      })
      .eq('video_id', videoId as string)
      .eq('session_id', sessionId as string)
  } else if (event === ANALYTICS_EVENTS.CTA_CLICK) {
    await supabase.from('cta_events').insert({
      video_id: videoId as string,
      session_id: sessionId as string,
      cta_index: (rest.ctaIndex as number) ?? 0,
      cta_url: rest.ctaUrl as string | undefined,
      clicked_at_second: rest.clickedAtSecond as number | undefined,
    })
  }

  return NextResponse.json({ ok: true })
}
