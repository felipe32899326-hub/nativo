'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

interface EmbedCodeSnippetProps {
  code: string
}

export function EmbedCodeSnippet({ code }: EmbedCodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">HTML</span>
        <Button variant="ghost" size="sm" onClick={copy} className="h-7 gap-1.5">
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  )
}
