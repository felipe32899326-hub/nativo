'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Video,
  FlaskConical,
  Shield,
  Target,
  Settings,
  GraduationCap,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/videos', label: 'Meus vídeos', icon: Video },
  { href: '/testes-ab', label: 'Testes A/B', icon: FlaskConical },
  { href: '/seguranca', label: 'Segurança', icon: Shield },
  { href: '/conversoes', label: 'Conversões', icon: Target },
  { href: '/settings', label: 'Configurações', icon: Settings },
  { href: '/academy', label: 'Academy', icon: GraduationCap },
]

const APP_VERSION = 'v1.0.0'

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-surface">
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              isActive(href)
                ? 'bg-accent-soft text-accent font-medium'
                : 'text-foreground hover:bg-muted',
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        {/* Ajuda — with chevron */}
        <Link
          href="/ajuda"
          className={cn(
            'mt-1 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors',
            isActive('/ajuda')
              ? 'bg-accent-soft text-accent font-medium'
              : 'text-foreground hover:bg-muted',
          )}
        >
          <span className="flex items-center gap-3">
            <HelpCircle size={16} />
            Ajuda
          </span>
          <ChevronRight size={14} className="text-muted-foreground" />
        </Link>
      </nav>

      {/* Version footer */}
      <div className="px-4 py-3">
        <p className="text-[10px] text-muted-foreground text-center">{APP_VERSION}</p>
      </div>
    </aside>
  )
}
