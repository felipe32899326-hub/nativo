'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Video,
  Settings,
  CreditCard,
  LogOut,
} from 'lucide-react'
import { signOut } from '@/features/auth/_lib/actions'
import type { Profile } from '@/lib/supabase/types'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/videos', label: 'Vídeos', icon: Video },
  { href: '/settings', label: 'Configurações', icon: Settings },
  { href: '/billing', label: 'Plano', icon: CreditCard },
]

interface SidebarProps {
  profile: Profile
}

export function Sidebar({ profile }: SidebarProps) {
  const router = useRouter()

  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex h-14 items-center px-5 border-b border-border">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          Nati<span className="text-accent">v₀</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-white/8 text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/4',
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User / plan */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar src={profile.avatar_url} name={profile.full_name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {profile.full_name ?? profile.email}
            </p>
            <Badge variant={profile.plan_id === 'trial' ? 'warning' : 'success'} className="mt-0.5">
              {profile.plan_id === 'trial' ? 'Trial' : profile.plan_id}
            </Badge>
          </div>
          <button
            onClick={async () => { await signOut(); router.push('/login'); router.refresh() }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Sair"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
