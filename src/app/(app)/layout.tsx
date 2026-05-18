import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // DEBUG: Renderizar info do erro em vez de redirect
  if (!user) {
    return (
      <div className="p-8 bg-background min-h-screen text-foreground">
        <h1 className="text-2xl mb-4">DEBUG: Auth check failed in layout</h1>
        <pre className="bg-surface p-4 rounded text-xs">
          {JSON.stringify({
            has_user: !!user,
            error: userError?.message ?? null,
            timestamp: new Date().toISOString(),
          }, null, 2)}
        </pre>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  if (profile.is_blocked) {
    redirect('/login?error=blocked')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar profile={profile} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
