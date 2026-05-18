import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function DebugPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return (
    <div className="p-8 text-foreground">
      <h1 className="text-2xl font-bold mb-4">Debug Page (Server Component)</h1>
      <pre className="bg-surface p-4 rounded-lg text-xs whitespace-pre-wrap">
        {JSON.stringify({
          user_id: user?.id ?? null,
          user_email: user?.email ?? null,
          auth_error: error?.message ?? null,
          test_time: new Date().toISOString(),
        }, null, 2)}
      </pre>
    </div>
  )
}
