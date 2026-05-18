import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { UploadForm } from '@/features/upload/_components/upload-form'

export const metadata: Metadata = { title: 'Novo vídeo' }

export default function UploadPage() {
  return (
    <div className="max-w-xl">
      <PageHeader
        title="Novo vídeo"
        description="Faça o upload de uma VSL para configurar seu player social-native."
      />
      <UploadForm />
    </div>
  )
}
