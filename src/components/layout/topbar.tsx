'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, Trophy, LogOut, User } from 'lucide-react'
import { signOut } from '@/features/auth/_lib/actions'
import type { Profile } from '@/lib/supabase/types'
import { formatNumber } from '@/lib/utils'

interface TopbarProps {
  profile: Profile
}

export function Topbar({ profile }: TopbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const playsUsed = profile.plays_used ?? 0
  const playsLimit = profile.plays_limit ?? 1500
  const percent = playsLimit > 0 ? Math.min(100, Math.round((playsUsed / playsLimit) * 100)) : 0

  const initials = (profile.full_name ?? profile.email ?? '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-6">
      {/* Left: Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
          <span className="text-sm font-bold">N</span>
        </div>
        <span className="text-base font-bold tracking-tight text-foreground">Nativo</span>
      </Link>

      {/* Right: Premiações + bell + avatar */}
      <div className="flex items-center gap-6">
        {/* Premiações progress */}
        <Link
          href="/billing"
          className="hidden md:flex flex-col items-end gap-1 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Trophy size={14} className="text-amber-500" />
              <span>Premiações</span>
            </div>
            <div className="text-sm text-foreground">
              <span className="font-semibold">{formatNumber(playsUsed)} Plays</span>
              <span className="text-muted-foreground ml-1">({percent}%)</span>
            </div>
          </div>
          <div className="h-1 w-56 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </Link>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Notificações"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
            2
          </span>
        </button>

        {/* Avatar with menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            title={profile.full_name ?? profile.email}
          >
            {initials}
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-surface shadow-lg z-50">
                <div className="border-b border-border px-3 py-2.5">
                  <p className="text-xs font-medium text-foreground truncate">
                    {profile.full_name ?? profile.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{profile.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={14} />
                    Conta
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut()
                      router.push('/login')
                      router.refresh()
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <LogOut size={14} />
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
