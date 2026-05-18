'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { uploadVideoFile } from '../_lib/upload-client'
import { pollVideoStatus } from '../_lib/poll-status'
import { BUNNY_STATUS_LABEL } from '@/lib/constants'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

type UploadPhase = 'idle' | 'creating' | 'uploading' | 'processing' | 'done' | 'error'

export function UploadForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [progress, setProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type.startsWith('video/')) {
      setFile(dropped)
      if (!title) setTitle(dropped.name.replace(/\.[^.]+$/, ''))
    }
  }, [title])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !title.trim()) return

    setError(null)
    setPhase('creating')

    try {
      // 1. Create video record
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })

      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg ?? 'Erro ao criar vídeo')
      }

      const { videoId: vid } = await res.json()
      setVideoId(vid)

      // 2. Upload binary
      setPhase('uploading')
      setProgress(0)
      await uploadVideoFile({
        file,
        videoId: vid,
        onProgress: setProgress,
      })

      // 3. Poll for processing
      setPhase('processing')
      const result = await pollVideoStatus({
        videoId: vid,
        onStatusChange: setProcessingStatus,
      })

      if (result === 'error') throw new Error('Erro no processamento do vídeo')
      if (result === 'timeout') throw new Error('Timeout no processamento')

      setPhase('done')
      setTimeout(() => router.push(`/videos/${vid}`), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setPhase('error')
    }
  }

  if (phase === 'done') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <CheckCircle size={40} className="text-emerald-400 mb-4" />
          <p className="text-lg font-medium text-foreground">Vídeo pronto!</p>
          <p className="text-sm text-muted-foreground mt-1">Redirecionando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-3
          rounded-2xl border-2 border-dashed p-12 cursor-pointer
          transition-colors duration-150
          ${isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-border/80 hover:bg-surface-raised'}
        `}
      >
        <input
          id="file-input"
          type="file"
          accept="video/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) {
              setFile(f)
              if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''))
            }
          }}
        />
        <Upload size={28} className="text-muted-foreground" />
        {file ? (
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Arraste um vídeo ou clique para selecionar</p>
            <p className="text-xs text-muted-foreground mt-0.5">MP4, MOV, AVI, MKV — até 10 GB</p>
          </div>
        )}
      </div>

      <Input
        label="Título do vídeo"
        placeholder="Ex: VSL Principal - Produto X"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Progress */}
      {(phase === 'uploading' || phase === 'processing' || phase === 'creating') && (
        <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {phase === 'creating' && 'Criando vídeo...'}
              {phase === 'uploading' && `Enviando... ${progress}%`}
              {phase === 'processing' && BUNNY_STATUS_LABEL[processingStatus as keyof typeof BUNNY_STATUS_LABEL]}
            </span>
            <span className="text-foreground font-medium">
              {phase === 'uploading' ? `${progress}%` : ''}
            </span>
          </div>
          {phase === 'uploading' && (
            <div className="h-1.5 rounded-full bg-surface-raised overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {phase === 'processing' && (
            <div className="h-1.5 rounded-full bg-surface-raised overflow-hidden">
              <div className="h-full w-full rounded-full bg-accent/30 animate-pulse" />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        variant="accent"
        className="w-full"
        disabled={!file || !title.trim() || phase !== 'idle' && phase !== 'error'}
        loading={phase === 'creating' || phase === 'uploading' || phase === 'processing'}
      >
        {phase === 'idle' || phase === 'error' ? 'Fazer upload' : 'Processando...'}
      </Button>
    </form>
  )
}
