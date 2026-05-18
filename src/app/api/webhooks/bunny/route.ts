import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import {
  buildPlaybackUrl,
  buildThumbnailUrl,
  buildPreviewUrl,
  verifyBunnyWebhookSignature,
} from '@/lib/bunny/client'
import { BUNNY_STATUS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  const secret = process.env.BUNNY_WEBHOOK_SECRET
  const tokenParam = request.nextUrl.searchParams.get('secret')

  if (secret && tokenParam !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.text()

  let payload: {
    VideoGuid: string
    VideoLibraryId: number
    Status: number
    Duration?: number
  }

  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { VideoGuid: bunnyVideoId, Status: status, Duration: duration } = payload

  const supabase = getSupabaseServiceClient()

  const updateData: Record<string, unknown> = { bunny_status: status }

  if (status === BUNNY_STATUS.FINISHED) {
    updateData.playback_url = buildPlaybackUrl(bunnyVideoId)
    updateData.thumbnail_url = buildThumbnailUrl(bunnyVideoId)
    updateData.preview_url = buildPreviewUrl(bunnyVideoId)
    if (duration) updateData.duration_seconds = Math.round(duration)
  }

  const { error } = await supabase
    .from('videos')
    .update(updateData)
    .eq('bunny_video_id', bunnyVideoId)

  if (error) {
    console.error('Webhook Supabase update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
