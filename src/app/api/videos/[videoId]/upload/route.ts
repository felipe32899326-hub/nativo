import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

// Stream-proxy upload to Bunny — keeps API key server-side
export async function PUT(
  request: NextRequest,
  ctx: RouteContext<'/api/videos/[videoId]/upload'>,
) {
  const { videoId } = await ctx.params
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify video ownership + get bunny ID
  const { data: video } = await supabase
    .from('videos')
    .select('bunny_video_id')
    .eq('id', videoId)
    .eq('user_id', user.id)
    .single()

  if (!video?.bunny_video_id) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 })
  }

  const libraryId = process.env.BUNNY_LIBRARY_ID!
  const apiKey = process.env.BUNNY_STREAM_API_KEY!
  const bunnyUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${video.bunny_video_id}`

  // Pipe the request body directly to Bunny
  const bunnyRes = await fetch(bunnyUrl, {
    method: 'PUT',
    headers: {
      AccessKey: apiKey,
      'Content-Type': request.headers.get('Content-Type') ?? 'application/octet-stream',
    },
    body: request.body,
    // @ts-expect-error — Node.js fetch supports duplex: 'half' for streaming uploads
    duplex: 'half',
  })

  if (!bunnyRes.ok) {
    return NextResponse.json({ error: 'Upload to Bunny failed' }, { status: 502 })
  }

  // Mark as uploaded
  await supabase
    .from('videos')
    .update({ bunny_status: 1 })
    .eq('id', videoId)
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
