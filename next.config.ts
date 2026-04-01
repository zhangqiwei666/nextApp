import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ===================== 部署路径 =====================
  // 生产环境 Nginx 通过 /app/ 代理，需要 basePath
  // 开发环境不需要，通过 .env 文件控制
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // 2. 自定义构建输出目录（默认是 .next）
  // distDir: 'build', // 若修改，启动生产环境需加 --dir build

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // ===================== 静态/动态渲染相关 =====================
  // 1. 默认渲染模式（App Router）
  // 优先静态渲染，动态路由自动降级为动态渲染
  // output: 'standalone', // 生成独立可部署的包（生产环境推荐）

  // standalone 模式下不要设置 assetPrefix，使用默认的绝对路径

  // ===================== API 代理（rewrites） =====================
  // 把前端的 /api/backend/xxx 请求代理到外部后端服务器
  // 浏览器地址栏不变，相当于 Nginx 反向代理
  async rewrites() {
    return [
      // 示例1：代理到外部后端（最常用）
      // 前端请求 /api/discover/list → 实际请求 http://115.191.43.57/api/discover/list
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'https://aiballs.cn/'}/api/:path*`,
      },
      // 示例2：代理特定路径
      // 前端请求 /api/auth/login → http://auth-service:3001/auth/login
      // {
      //   source: '/api/auth/:path*',
      //   destination: 'http://localhost:3001/auth/:path*',
      // },
    ];
  },

  // ===================== 3. 缓存优化（16.20 新机制） =====================
  // 启用 Cache Components（替代旧 PPR，稳定版）
  // cacheComponents: true,
  // 路由缓存过期时间（单位：ms，静态页默认 5min，动态页默认不缓存）
  // experimental: {
  //   staleTimes: {
  //     static: 300,   // 静态段默认缓存 300 秒（原 300000ms）
  //     dynamic: 60,   // 动态段默认缓存 60 秒（原 60000ms）
  //     // 动态路由：/blog/[slug] 不建议设长缓存，用 revalidate 控制
  //   },
  // },
  // cacheComponents: true,
  // cacheLife: {
  //     'discover': {
  //         expire: 10,
  //     }
  // },
  // 去掉console
  compiler: {
    // 仅在生产环境移除 console
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
