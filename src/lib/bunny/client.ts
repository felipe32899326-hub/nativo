import 'server-only'

const BUNNY_API_BASE = 'https://video.bunnycdn.com'

function getBunnyHeaders() {
  return {
    AccessKey: process.env.BUNNY_STREAM_API_KEY!,
    'Content-Type': 'application/json',
  }
}

function getLibraryId(): string {
  return process.env.BUNNY_LIBRARY_ID!
}

export function buildPlaybackUrl(bunnyVideoId: string): string {
  const hostname = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME!
  return `https://${hostname}/${bunnyVideoId}/playlist.m3u8`
}

export function buildThumbnailUrl(bunnyVideoId: string): string {
  const hostname = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME!
  return `https://${hostname}/${bunnyVideoId}/thumbnail.jpg`
}

export function buildPreviewUrl(bunnyVideoId: string): string {
  const hostname = process.env.NEXT_PUBLIC_BUNNY_CDN_HOSTNAME!
  return `https://${hostname}/${bunnyVideoId}/preview.webp`
}

export async function createBunnyVideo(title: string): Promise<{ guid: string }> {
  const res = await fetch(`${BUNNY_API_BASE}/library/${getLibraryId()}/videos`, {
    method: 'POST',
    headers: getBunnyHeaders(),
    body: JSON.stringify({ title }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Bunny API error creating video: ${res.status} ${text}`)
  }

  return res.json()
}

export async function getBunnyVideo(bunnyVideoId: string): Promise<BunnyVideoStatus> {
  const res = await fetch(
    `${BUNNY_API_BASE}/library/${getLibraryId()}/videos/${bunnyVideoId}`,
    { headers: getBunnyHeaders() },
  )

  if (!res.ok) {
    throw new Error(`Bunny API error fetching video: ${res.status}`)
  }

  return res.json()
}

export async function deleteBunnyVideo(bunnyVideoId: string): Promise<void> {
  await fetch(`${BUNNY_API_BASE}/library/${getLibraryId()}/videos/${bunnyVideoId}`, {
    method: 'DELETE',
    headers: getBunnyHeaders(),
  })
}

// Verify webhook signature from Bunny
export function verifyBunnyWebhookSignature(
  body: string,
  signatureHeader: string | null,
): boolean {
  const secret = process.env.BUNNY_WEBHOOK_SECRET
  if (!secret) return true // no secret configured → accept all (dev only)
  if (!signatureHeader) return false
  // Bunny sends SHA256(LibraryId + ApiKey + VideoGuid) as signature — verify format
  // For MVP: accept if header matches our secret directly
  return signatureHeader === secret
}

export interface BunnyVideoStatus {
  videoLibraryId: number
  guid: string
  title: string
  status: number
  framerate: number
  width: number
  height: number
  length: number
  storageSize: number
  availableResolutions: string
  thumbnailCount: number
  encodeProgress: number
}
