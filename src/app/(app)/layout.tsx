import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { SupportButton } from '@/components/layout/support-button'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
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
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <Topbar profile={profile} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
      <SupportButton />
    </div>
  )
}
