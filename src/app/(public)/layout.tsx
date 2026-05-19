export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
            <span className="text-base font-bold">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Nativo</span>
        </div>
        {children}
      </div>
    </div>
  )
}
