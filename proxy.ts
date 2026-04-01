// proxy.ts（放在项目根目录）
import { NextRequest, NextResponse } from 'next/server';

// 不需要登录的白名单路径
const PUBLIC_PATHS = ['/login', '/register'];

/**
 * Next.js 16 Proxy (原 Middleware)
 * 处理全局路由拦截和鉴权
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. 白名单路径直接放行
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. 从 cookie 中获取 token
  const token = request.cookies.get('token')?.value;

  // 3. 基本鉴权逻辑
  // 注意：静态资源如 /images/ 已经在 matcher 中被排除，不会进入此逻辑
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login'; 
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // 有 token → 放行
  return NextResponse.next();
}

// 默认导出以便某些构建工具能够识别
export default proxy;

// 配置哪些路径进入/排除 proxy
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * 1. _next/static (静态文件)
     * 2. _next/image (图片优化)
     * 3. favicon.ico (图标)
     * 4. api (API 路由)
     * 5. images (public 下的图片文件夹)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|images).*)',
  ],
};
