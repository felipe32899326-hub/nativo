export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Nati<span className="text-accent">v₀</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
