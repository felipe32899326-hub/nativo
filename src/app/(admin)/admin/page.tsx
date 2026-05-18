import type { Metadata } from 'next'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'
import { Users, Video, Play } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin — Overview' }

export default async function AdminPage() {
  const supabase = getSupabaseServiceClient()

  const [{ count: totalUsers }, { count: totalVideos }, { count: totalPlays }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('videos').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
    supabase.from('play_sessions').select('id', { count: 'exact', head: true }),
  ])

  return (
    <div>
      <PageHeader title="Admin" description="Visão geral da plataforma." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2 text-muted-foreground"><Users size={16} /><span className="text-xs">Usuários</span></div>
            <p className="text-2xl font-semibold">{formatNumber(totalUsers ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2 text-muted-foreground"><Video size={16} /><span className="text-xs">Vídeos</span></div>
            <p className="text-2xl font-semibold">{formatNumber(totalVideos ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2 text-muted-foreground"><Play size={16} /><span className="text-xs">Plays totais</span></div>
            <p className="text-2xl font-semibold">{formatNumber(totalPlays ?? 0)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
