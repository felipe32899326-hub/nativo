import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Nativo — Player Social-Native para VSLs',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs text-accent mb-8">
          Player social-native para VSLs
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6 max-w-3xl">
          Suas VSLs com a experiência do{' '}
          <span className="text-accent">Instagram Stories</span>
        </h1>

        <p className="text-lg text-muted-foreground mb-10 max-w-xl">
          Transforme seus vídeos de venda em uma experiência imersiva, fluida e social-native.
          Maior retenção, mais watch time, mais conversões.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href="/signup">Começar grátis — 7 dias</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Já tenho conta</Link>
          </Button>
        </div>

        {/* Feature grid */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl text-left">
          {[
            { title: 'Stories-style', desc: 'Barras de progresso, avatar, overlay — exatamente como o Instagram.' },
            { title: 'Embed universal', desc: 'Funciona em WordPress, Webflow, Framer, Lovable e qualquer HTML.' },
            { title: 'Analytics em tempo real', desc: 'Watch time, retenção, cliques no CTA e abandono por segmento.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nativo · Player Social-Native para VSLs
      </footer>
    </div>
  )
}
