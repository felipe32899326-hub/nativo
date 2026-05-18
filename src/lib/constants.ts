export const BUNNY_STATUS = {
  CREATED: 0,
  UPLOADED: 1,
  PROCESSING: 2,
  TRANSCODING: 3,
  FINISHED: 4,
  ERROR: 5,
} as const

export type BunnyStatus = (typeof BUNNY_STATUS)[keyof typeof BUNNY_STATUS]

export const BUNNY_STATUS_LABEL: Record<BunnyStatus, string> = {
  0: 'Criado',
  1: 'Enviado',
  2: 'Processando',
  3: 'Transcodificando',
  4: 'Pronto',
  5: 'Erro',
}

export const PLAN_IDS = {
  TRIAL: 'trial',
  FREE: 'free',
  PRO: 'pro',
  BUSINESS: 'business',
} as const

export type PlanId = (typeof PLAN_IDS)[keyof typeof PLAN_IDS]

export const PLAN_LIMITS: Record<PlanId, { plays: number; videos: number }> = {
  trial: { plays: 1500, videos: 10 },
  free: { plays: 1500, videos: 10 },
  pro: { plays: 50_000, videos: 100 },
  business: { plays: -1, videos: -1 },
}

export const ANALYTICS_EVENTS = {
  VIDEO_PLAY: 'video_play',
  VIDEO_HEARTBEAT: 'video_heartbeat',
  VIDEO_SEGMENT_COMPLETE: 'video_segment_complete',
  VIDEO_COMPLETE: 'video_complete',
  VIDEO_ABANDON: 'video_abandon',
  CTA_SHOWN: 'cta_shown',
  CTA_CLICK: 'cta_click',
} as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]
