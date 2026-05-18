import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseServerClient, getSupabaseServiceClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<'/api/admin/users/[userId]'>,
) {
  const { userId } = await ctx.params

  // Verify caller is admin
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: caller } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!caller || caller.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { is_blocked, plan_id, plays_limit } = body

  const serviceClient = getSupabaseServiceClient()
  const { data, error } = await serviceClient
    .from('profiles')
    .update({ is_blocked, plan_id, plays_limit })
    .eq('id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
