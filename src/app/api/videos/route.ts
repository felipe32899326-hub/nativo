import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createBunnyVideo } from '@/lib/bunny/client'

export async function GET(request: NextRequest) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check video limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('videos_limit')
    .eq('id', user.id)
    .single()

  const { count } = await supabase
    .from('videos')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_deleted', false)

  if (profile && count !== null && count >= profile.videos_limit) {
    return NextResponse.json({ error: 'Limite de vídeos atingido' }, { status: 403 })
  }

  const { title } = await request.json()
  if (!title?.trim()) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
  }

  // Create video on Bunny
  const bunnyVideo = await createBunnyVideo(title)

  // Insert in Supabase
  const { data: video, error } = await supabase
    .from('videos')
    .insert({
      user_id: user.id,
      title: title.trim(),
      bunny_video_id: bunnyVideo.guid,
      bunny_library_id: process.env.BUNNY_LIBRARY_ID,
      bunny_status: 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ videoId: video.id, bunnyVideoId: bunnyVideo.guid })
}
