import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // Dashboard agora redireciona para Meus vídeos (padrão VTurb)
  redirect('/videos')
}
