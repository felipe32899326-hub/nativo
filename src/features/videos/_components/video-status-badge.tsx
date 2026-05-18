import { Badge } from '@/components/ui/badge'
import { BUNNY_STATUS, BUNNY_STATUS_LABEL, type BunnyStatus } from '@/lib/constants'

export function VideoStatusBadge({ status }: { status: number }) {
  const s = status as BunnyStatus
  const variant =
    s === BUNNY_STATUS.FINISHED ? 'success' :
    s === BUNNY_STATUS.ERROR ? 'error' :
    s === BUNNY_STATUS.PROCESSING || s === BUNNY_STATUS.TRANSCODING ? 'warning' :
    'default'

  return <Badge variant={variant}>{BUNNY_STATUS_LABEL[s] ?? 'Desconhecido'}</Badge>
}
