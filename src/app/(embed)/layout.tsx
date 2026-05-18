export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" style={{ margin: 0, padding: 0, background: '#000' }}>
      <body style={{ margin: 0, padding: 0, background: '#000', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
