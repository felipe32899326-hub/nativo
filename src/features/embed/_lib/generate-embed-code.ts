interface EmbedCodeOptions {
  videoId: string
  maxWidth?: number
  aspectRatio?: '9:16' | '16:9' | '1:1'
}

export function generateEmbedCode({
  videoId,
  maxWidth = 400,
  aspectRatio = '9:16',
}: EmbedCodeOptions): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nativo.app'
  const embedUrl = `${appUrl}/embed/${videoId}`

  const paddingTop =
    aspectRatio === '9:16'
      ? '177.78%'
      : aspectRatio === '16:9'
      ? '56.25%'
      : '100%'

  return `<div style="position:relative;padding-top:${paddingTop};max-width:${maxWidth}px;margin:0 auto;">
  <iframe
    src="${embedUrl}"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
    allow="autoplay;fullscreen;picture-in-picture"
    allowfullscreen
    loading="lazy"
    title="Nativo Player"
  ></iframe>
</div>`
}
