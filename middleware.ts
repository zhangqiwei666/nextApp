// middleware.ts（放在项目根目录）
import { NextRequest, NextResponse } from 'next/server';

// 不需要登录的白名单路径
const PUBLIC_PATHS = ['/login', '/register', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 白名单路径直接放行（'/' 精确匹配，其他前缀匹配）
  if (pathname === '/' || PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 从 cookie 中获取 token
  const token = request.cookies.get('token')?.value;
  console.log('token', token)
  // 没有 token → 重定向到登录页
//   if (!token) {
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('redirect', pathname); // 记录原始路径
//     return NextResponse.redirect(loginUrl);
//   }

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
