import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that don't require authentication
const PUBLIC_PATHS = ['/login']
const LINGOMINER_BASE_URL = 'lingominer_base_url'
const LINGOMINER_API_KEY = 'lingominer_api_key'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for authentication
  if (request.cookies.has(LINGOMINER_BASE_URL) && request.cookies.has(LINGOMINER_API_KEY)) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/* (API routes)
     * 2. /_next/* (Next.js internals)
     * 3. /_static/* (static files)
     * 4. /_vercel/* (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
} 