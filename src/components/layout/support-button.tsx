'use client'

import { HelpCircle } from 'lucide-react'

export function SupportButton() {
  return (
    <a
      href="mailto:suporte@nativo.app"
      title="Suporte"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:scale-105 transition-transform"
    >
      <HelpCircle size={22} />
    </a>
  )
}
