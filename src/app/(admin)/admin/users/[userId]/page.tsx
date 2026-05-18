import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminUserActions } from './admin-user-actions'

export const metadata: Metadata = { title: 'Admin — Usuário' }

export default async function AdminUserPage(props: PageProps<'/admin/users/[userId]'>) {
  const { userId } = await props.params
  const supabase = getSupabaseServiceClient()

  const [{ data: user }, { data: videos }, { count: totalPlays }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('videos').select('id, title, bunny_status, created_at').eq('user_id', userId).eq('is_deleted', false).order('created_at', { ascending: false }),
    supabase.from('play_sessions').select('id', { count: 'exact', head: true }).in(
      'video_id',
      (await supabase.from('videos').select('id').eq('user_id', userId).eq('is_deleted', false)).data?.map(v => v.id) ?? [],
    ),
  ])

  if (!user) notFound()

  return (
    <div>
      <PageHeader
        title={user.full_name ?? user.email}
        description={user.email}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Informações</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Plano" value={<Badge>{user.plan_id}</Badge>} />
            <Row label="Plays usados" value={`${user.plays_used} / ${user.plays_limit}`} />
            <Row label="Vídeos" value={`${videos?.length ?? 0} / ${user.videos_limit}`} />
            <Row label="Plays totais" value={String(totalPlays ?? 0)} />
            <Row label="Status" value={user.is_blocked ? <Badge variant="error">Bloqueado</Badge> : <Badge variant="success">Ativo</Badge>} />
            <Row label="Membro desde" value={new Date(user.created_at).toLocaleDateString('pt-BR')} />
            {user.trial_ends_at && (
              <Row label="Trial expira" value={new Date(user.trial_ends_at).toLocaleDateString('pt-BR')} />
            )}
          </CardContent>
        </Card>

        <AdminUserActions user={user} />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
