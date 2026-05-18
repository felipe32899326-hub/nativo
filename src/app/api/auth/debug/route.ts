import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll()
  const supabaseCookies = allCookies.filter(c => c.name.startsWith('sb-'))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {},
      },
    },
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  return NextResponse.json({
    cookies_total: allCookies.length,
    cookies_supabase: supabaseCookies.map(c => ({ name: c.name, value_length: c.value.length })),
    user_id: user?.id ?? null,
    user_email: user?.email ?? null,
    auth_error: error?.message ?? null,
    env_url_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    env_anon_set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })
}
