// Stub types — replace with output of `supabase gen types typescript --local`

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ProfileRow {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  is_blocked: boolean
  plan_id: string
  trial_ends_at: string | null
  plays_used: number
  plays_limit: number
  videos_limit: number
  created_at: string
  updated_at: string
}

export interface VideoRow {
  id: string
  user_id: string
  title: string
  description: string | null
  bunny_video_id: string | null
  bunny_library_id: string | null
  bunny_status: number
  playback_url: string | null
  thumbnail_url: string | null
  preview_url: string | null
  duration_seconds: number | null
  player_config: Json
  is_published: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface PlaySessionRow {
  id: string
  video_id: string
  session_id: string
  viewer_id: string | null
  embed_origin: string | null
  device_type: 'mobile' | 'tablet' | 'desktop' | null
  country_code: string | null
  started_at: string
  ended_at: string | null
  watch_seconds: number
  completed: boolean
  segments_data: Json | null
  created_at: string
}

export interface CtaEventRow {
  id: string
  video_id: string
  session_id: string
  cta_index: number
  cta_url: string | null
  clicked_at_second: number | null
  created_at: string
}

export interface PlanRow {
  id: string
  name: string
  plays_limit: number
  videos_limit: number
  trial_days: number | null
  is_active: boolean
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: { id: string; email: string } & Partial<Omit<ProfileRow, 'id' | 'email'>>
        Update: Partial<ProfileRow>
        Relationships: []
      }
      videos: {
        Row: VideoRow
        Insert: { user_id: string; title: string } & Partial<Omit<VideoRow, 'user_id' | 'title'>>
        Update: Partial<VideoRow>
        Relationships: []
      }
      play_sessions: {
        Row: PlaySessionRow
        Insert: { video_id: string; session_id: string } & Partial<Omit<PlaySessionRow, 'video_id' | 'session_id'>>
        Update: Partial<PlaySessionRow>
        Relationships: []
      }
      cta_events: {
        Row: CtaEventRow
        Insert: Omit<CtaEventRow, 'id' | 'created_at'>
        Update: Partial<CtaEventRow>
        Relationships: []
      }
      plans: {
        Row: PlanRow
        Insert: PlanRow
        Update: Partial<PlanRow>
        Relationships: []
      }
    }
    Views: Record<string, { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: never[] }>
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>
    Enums: Record<string, string>
    CompositeTypes: Record<string, Record<string, unknown>>
  }
}

export type Profile = ProfileRow
export type Video = VideoRow & { player_config: PlayerConfig }
export type PlaySession = PlaySessionRow
export type CtaEvent = CtaEventRow

// player_config shape stored in videos.player_config
export interface PlayerConfig {
  segments?: Array<{ start: number; end: number; label?: string }>
  videos?: Array<{ playbackUrl: string; thumbnailUrl?: string }>
  ctas?: Array<{
    timestamp: number
    text: string
    url: string
    style?: 'primary' | 'outline'
  }>
  expertName?: string
  expertAvatarUrl?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}
