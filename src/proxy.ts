import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // For embed routes: allow iframe embedding (remove X-Frame-Options, set CSP)
  if (pathname.startsWith('/embed/')) {
    const response = NextResponse.next()
    response.headers.delete('X-Frame-Options')
    response.headers.set('Content-Security-Policy', "frame-ancestors *")
    return response
  }

  // For all other routes: refresh Supabase auth session
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh session if expired
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    '/embed/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
