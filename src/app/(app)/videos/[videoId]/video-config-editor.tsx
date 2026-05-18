'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Video, PlayerConfig } from '@/lib/supabase/types'
import { Check, AlertCircle } from 'lucide-react'

interface VideoConfigEditorProps {
  video: Video
}

export function VideoConfigEditor({ video }: VideoConfigEditorProps) {
  const cfg = (video.player_config ?? {}) as PlayerConfig
  const [title, setTitle] = useState(video.title)
  const [expertName, setExpertName] = useState(cfg.expertName ?? '')
  const [expertAvatarUrl, setExpertAvatarUrl] = useState(cfg.expertAvatarUrl ?? '')
  const [ctaText, setCtaText] = useState(cfg.ctas?.[0]?.text ?? '')
  const [ctaUrl, setCtaUrl] = useState(cfg.ctas?.[0]?.url ?? '')
  const [ctaTimestamp, setCtaTimestamp] = useState(String(cfg.ctas?.[0]?.timestamp ?? 15))
  const [isPublished, setIsPublished] = useState(video.is_published)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    setError(null)
    setSaved(false)

    const playerConfig: PlayerConfig = {
      ...cfg,
      expertName: expertName || undefined,
      expertAvatarUrl: expertAvatarUrl || undefined,
      ctas: ctaText && ctaUrl ? [{
        timestamp: parseInt(ctaTimestamp) || 15,
        text: ctaText,
        url: ctaUrl,
        style: 'primary',
      }] : [],
      autoplay: true,
      muted: true,
      loop: false,
    }

    startTransition(async () => {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, player_config: playerConfig, is_published: isPublished }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Erro ao salvar')
        return
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle>Informações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded accent-accent"
              />
              <span className="text-sm text-foreground">Publicado (ativa o embed)</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Expert overlay</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nome do expert"
            placeholder="Ex: João Silva"
            value={expertName}
            onChange={(e) => setExpertName(e.target.value)}
          />
          <Input
            label="URL da foto do expert"
            placeholder="https://..."
            value={expertAvatarUrl}
            onChange={(e) => setExpertAvatarUrl(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>CTA</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Texto do botão"
            placeholder="Ex: Quero saber mais →"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
          />
          <Input
            label="URL de destino"
            placeholder="https://..."
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
          />
          <Input
            label="Aparecer após (segundos)"
            type="number"
            min="0"
            value={ctaTimestamp}
            onChange={(e) => setCtaTimestamp(e.target.value)}
          />
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <Button
        variant="accent"
        size="lg"
        className="w-full"
        onClick={handleSave}
        loading={isPending}
      >
        {saved ? (
          <><Check size={14} /> Salvo!</>
        ) : 'Salvar configurações'}
      </Button>
    </div>
  )
}
