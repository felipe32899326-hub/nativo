import { getSupabaseServerClient } from '@/lib/supabase/server'
import { cookies, headers } from 'next/headers'

export default async function DebugAppPage() {
  const cookieStore = await cookies()
  const headersList = await headers()
  const allCookies = cookieStore.getAll()
  const supabaseCookies = allCookies.filter(c => c.name.startsWith('sb-'))

  const supabase = await getSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return (
    <div className="p-8 text-foreground">
      <h1 className="text-2xl font-bold mb-4">Debug App Context</h1>
      <pre className="bg-surface p-4 rounded-lg text-xs whitespace-pre-wrap">
        {JSON.stringify({
          user_id: user?.id ?? null,
          user_email: user?.email ?? null,
          auth_error: error?.message ?? null,
          total_cookies: allCookies.length,
          supabase_cookies: supabaseCookies.map(c => ({ name: c.name, len: c.value.length })),
          x_forwarded_host: headersList.get('x-forwarded-host'),
          host: headersList.get('host'),
        }, null, 2)}
      </pre>
    </div>
  )
}
