import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
export {default} from 'next-auth/middleware'
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signIn', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/about/:path*','/mainpage/:path*'],
};