import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // For embed routes: allow iframe embedding
  if (pathname.startsWith('/embed/')) {
    const response = NextResponse.next()
    response.headers.delete('X-Frame-Options')
    response.headers.set('Content-Security-Policy', 'frame-ancestors *')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/embed/:path*',
  ],
}
