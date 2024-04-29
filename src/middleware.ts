export { default } from "next-auth/middleware"
import { NextRequest , NextResponse } from 'next/server'
import {getToken} from 'next-auth/jwt'
 
export async function middleware(request: NextRequest) {

    const token = await getToken({req: request});
    const url = request.nextUrl;

    if (token && 
        (
            url.pathname.startsWith('/signin') ||
            url.pathname.startsWith('/signup') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

  return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
  matcher: ['/signin', '/signup', '/', '/dashboard/:path*', '/verify/:path*'],
}

// 58.00