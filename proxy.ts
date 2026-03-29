// proxy.ts（放在项目根目录）
import { NextRequest, NextResponse } from 'next/server';

// 不需要登录的白名单路径
const PUBLIC_PATHS = ['/login'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // 白名单路径直接放行（现在只有 /login 在里面）
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 从 cookie 中获取 token
  const token = request.cookies.get('token')?.value;
  // 没有 token → 重定向到登录页
  if (!token) {
     const loginUrl = request.nextUrl.clone();
     loginUrl.pathname = '/login'; 
     loginUrl.searchParams.set('redirect', request.nextUrl.pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // 有 token → 放行（可选：验证 token 有效性）
  return NextResponse.next();
}

// 配置哪些路径需要经过 middleware
export const config = {
  matcher: [
    // 排除静态资源和 API 路径
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
