import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return NextResponse.json({
    user_id: user?.id ?? null,
    user_email: user?.email ?? null,
    auth_error: error?.message ?? null,
    method: 'getSupabaseServerClient (same as dashboard)',
  })
}
