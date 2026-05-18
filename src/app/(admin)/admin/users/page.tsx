import type { Metadata } from 'next'
import Link from 'next/link'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'

export const metadata: Metadata = { title: 'Admin — Usuários' }

export default async function AdminUsersPage() {
  const supabase = getSupabaseServiceClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <PageHeader title="Usuários" description={`${users?.length ?? 0} usuários registrados`} />

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Plano</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Plays</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Criado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-surface-raised transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${user.id}`} className="text-foreground hover:text-accent transition-colors">
                    {user.email}
                  </Link>
                  {user.full_name && (
                    <p className="text-xs text-muted-foreground">{user.full_name}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="default">{user.plan_id}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatNumber(user.plays_used)} / {formatNumber(user.plays_limit)}
                </td>
                <td className="px-4 py-3">
                  {user.is_blocked ? (
                    <Badge variant="error">Bloqueado</Badge>
                  ) : (
                    <Badge variant="success">Ativo</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
