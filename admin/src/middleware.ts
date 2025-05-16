import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which paths are public (don't require authentication)
const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Check if the path is for public pages
  const isPublicPath = PUBLIC_PATHS.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  )
  
  // Get auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value
  const isAuthenticated = !!authToken

  // Handle path access based on authentication status
  if (!isAuthenticated && !isPublicPath) {
    // Not authenticated and trying to access protected route
    const url = new URL('/login', request.url)
    url.searchParams.set('returnUrl', path)
    return NextResponse.redirect(url)
  }

  if (isAuthenticated && isPublicPath) {
    // Authenticated but trying to access login or other public pages
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Access is allowed, continue with the request
  return NextResponse.next()
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.ico|.*\\.png|.*\\.svg).*)',
  ],
} 