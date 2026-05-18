import { BUNNY_STATUS } from '@/lib/constants'

interface PollOptions {
  videoId: string
  onStatusChange: (status: number) => void
  intervalMs?: number
  timeoutMs?: number
}

export async function pollVideoStatus({
  videoId,
  onStatusChange,
  intervalMs = 3000,
  timeoutMs = 600_000,
}: PollOptions): Promise<'finished' | 'error' | 'timeout'> {
  const startTime = Date.now()

  return new Promise((resolve) => {
    const tick = async () => {
      if (Date.now() - startTime > timeoutMs) {
        resolve('timeout')
        return
      }

      try {
        const res = await fetch(`/api/videos/${videoId}`)
        if (!res.ok) {
          setTimeout(tick, intervalMs)
          return
        }

        const video = await res.json()
        onStatusChange(video.bunny_status)

        if (video.bunny_status === BUNNY_STATUS.FINISHED) {
          resolve('finished')
          return
        }

        if (video.bunny_status === BUNNY_STATUS.ERROR) {
          resolve('error')
          return
        }

        setTimeout(tick, intervalMs)
      } catch {
        setTimeout(tick, intervalMs)
      }
    }

    setTimeout(tick, intervalMs)
  })
}
