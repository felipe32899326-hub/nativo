import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ step: 'getUser', error: userError?.message, user: null })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    step: 'profile_query',
    user_id: user.id,
    profile_id: profile?.id ?? null,
    profile_email: profile?.email ?? null,
    is_blocked: profile?.is_blocked ?? null,
    profile_error: profileError?.message ?? null,
    profile_error_code: profileError?.code ?? null,
  })
}
