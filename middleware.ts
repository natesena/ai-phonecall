import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const LOGIN = '/sign-in';
export const ROOT = '/';

export const PUBLIC_ROUTES = [
    '/sign-in',
    '/sign-up',
    '/_next',
    '/api/auth',
    '/favicon.ico',
    '/images',
    '/assets',
    
] as const;

export const PROTECTED_SUB_ROUTES = [
    '/dashboard',
    '/api/calls',
    '/api/user',
    '/user-profile',
    '/settings',
    "/verify-phoneno"
] as const;

export async function middleware(request: NextRequest) {
    const { nextUrl } = request;

    // Check if the path is for static files or public assets
    if (nextUrl.pathname.includes('/_next') || 
        nextUrl.pathname.includes('/static') ||
        nextUrl.pathname.includes('/images') ||
        nextUrl.pathname.includes('/assets') ||
        nextUrl.pathname.endsWith('.ico')) {
        return NextResponse.next();
    }

    try {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        const isAuthenticated = !!token;

        // Typing the route matching logic
        const isPublicRoute = PUBLIC_ROUTES.some(route => 
            nextUrl.pathname.startsWith(route) || nextUrl.pathname === ROOT
        );

        const isProtectedRoute = PROTECTED_SUB_ROUTES.some(route => 
            nextUrl.pathname.includes(route)
        );


        // Redirect to login if trying to access protected route while not authenticated
        if (!isAuthenticated && (isProtectedRoute || !isPublicRoute)) {
            const loginUrl = new URL(LOGIN, nextUrl.origin);
            loginUrl.searchParams.set('callbackUrl', nextUrl.href);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        // In case of any error, redirect to login
        const loginUrl = new URL(LOGIN, nextUrl.origin);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
