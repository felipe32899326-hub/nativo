import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { signOut } from '@/features/auth/_lib/actions'
import { Shield } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Admin sidebar */}
      <aside className="flex h-full w-52 flex-col border-r border-border bg-surface">
        <div className="flex h-14 items-center gap-2 px-5 border-b border-border">
          <Shield size={14} className="text-accent" />
          <span className="text-sm font-bold text-foreground">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {[
            { href: '/admin', label: 'Overview' },
            { href: '/admin/users', label: 'Usuários' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/4 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Link href="/dashboard" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
            ← Voltar ao app
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
