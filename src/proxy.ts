import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The middleware file convention is deprecated and has been renamed to proxy

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl
    if (token && (
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/") ||
        url.pathname.startsWith("/verify")
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))

    }

    // Not logged in users can't access dashboard
    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Allow everything else
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
}