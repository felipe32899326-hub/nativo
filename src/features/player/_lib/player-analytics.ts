import { ANALYTICS_EVENTS } from '@/lib/constants'
import { getDeviceType } from '@/lib/utils'

interface AnalyticsPayload {
  event: string
  videoId: string
  sessionId: string
  [key: string]: unknown
}

async function sendEvent(payload: AnalyticsPayload): Promise<void> {
  await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}

export function trackPlay(videoId: string, sessionId: string, viewerId?: string): void {
  sendEvent({
    event: ANALYTICS_EVENTS.VIDEO_PLAY,
    videoId,
    sessionId,
    viewerId,
    deviceType: getDeviceType(),
    embedOrigin: typeof window !== 'undefined' ? document.referrer || window.location.origin : null,
  })
}

export function trackHeartbeat(
  videoId: string,
  sessionId: string,
  currentTime: number,
  segmentIndex: number,
  watchSeconds: number,
): void {
  sendEvent({
    event: ANALYTICS_EVENTS.VIDEO_HEARTBEAT,
    videoId,
    sessionId,
    currentTime,
    segmentIndex,
    watchSeconds,
  })
}

export function trackSegmentComplete(
  videoId: string,
  sessionId: string,
  segmentIndex: number,
): void {
  sendEvent({
    event: ANALYTICS_EVENTS.VIDEO_SEGMENT_COMPLETE,
    videoId,
    sessionId,
    segmentIndex,
  })
}

export function trackCtaClick(
  videoId: string,
  sessionId: string,
  ctaIndex: number,
  ctaUrl: string,
  clickedAtSecond: number,
): void {
  sendEvent({
    event: ANALYTICS_EVENTS.CTA_CLICK,
    videoId,
    sessionId,
    ctaIndex,
    ctaUrl,
    clickedAtSecond,
  })
}

export function trackEnd(
  videoId: string,
  sessionId: string,
  watchSeconds: number,
  completed: boolean,
  segmentsData: unknown,
): void {
  const payload: AnalyticsPayload = {
    event: completed ? ANALYTICS_EVENTS.VIDEO_COMPLETE : ANALYTICS_EVENTS.VIDEO_ABANDON,
    videoId,
    sessionId,
    watchSeconds,
    completed,
    segmentsData,
  }

  // Use sendBeacon for reliability on page unload
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', JSON.stringify(payload))
  } else {
    sendEvent(payload)
  }
}
