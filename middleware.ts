import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';

export default withMiddlewareAuthRequired({
  returnTo: '/',
  async middleware(req) {
    const res = NextResponse.next();
    const session = await getSession(req, res);
    res.cookies.set('lang', session?.user?.user_metadata?.lang);
    return res;
  },
});

export const config = {
  matcher: '/profile/:path*',
};
