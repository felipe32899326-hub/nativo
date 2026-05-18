import 'server-only'

let posthogClient: import('posthog-node').PostHog | null = null

export async function getPostHogServerClient() {
  if (!posthogClient) {
    const { PostHog } = await import('posthog-node')
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) return null

    posthogClient = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return posthogClient
}
