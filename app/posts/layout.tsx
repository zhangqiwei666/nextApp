import Link from "next/link";

// ============================================================
// 嵌套路由布局：app/posts/layout.tsx
//
// 这个文件等价于 React Router 中的嵌套路由父组件
// React Router:  <Outlet />
// Next.js:       {children}
//
// 所有 /posts/* 路由都会被这个 layout 包裹：
//   /posts       → layout 包裹 posts/page.tsx
//   /posts/1     → layout 包裹 posts/[id]/page.tsx
//   /posts/2     → layout 包裹 posts/[id]/page.tsx
//   ...
// 切换子页面时，layout 不会重新渲染（保持状态）
// ============================================================

const sidebarPosts = [
  { id: "1", title: "Next.js 动态路由入门", emoji: "🚀" },
  { id: "2", title: "SSR 与 CSR 的核心区别", emoji: "⚡" },
  { id: "3", title: "React Server Components", emoji: "🧩" },
  { id: "4", title: "Tailwind CSS 实战技巧", emoji: "🎨" },
  { id: "5", title: "TypeScript 类型体操", emoji: "🔮" },
];

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode; // ← 这就是 React Router 中的 <Outlet />
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部标题栏（共享） */}
      <header className="sticky top-0 z-150 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors no-underline text-sm">
              ← 首页
            </Link>
            <span className="text-gray-200">|</span>
            <h1 className="text-lg font-bold text-gray-900">📚 文章中心</h1>
          </div>
          <div className="px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-xs font-bold">
            嵌套路由 Layout 演示
          </div>
        </div>
      </header>

      {/* 嵌套布局：左侧边栏 + 右侧内容区 */}
      <div className="max-w-5xl mx-auto flex min-h-[calc(100vh-3.5rem)]">

        {/* ====== 左侧侧边栏（共享部分，切换子路由不会重新渲染） ====== */}
        <aside className="w-64 shrink-0 bg-white border-r border-gray-100 p-4 hidden md:block">
          {/* Layout 说明 */}
          <div className="mb-4 px-3 py-2.5 bg-linear-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
            <p className="text-[11px] text-violet-600 font-bold mb-1">🔄 嵌套路由 Layout</p>
            <p className="text-[10px] text-violet-500 leading-relaxed">
              这个侧边栏来自 <code className="bg-violet-100 px-1 rounded text-[9px]">posts/layout.tsx</code>，
              切换文章时<strong>不会重新渲染</strong>，
              只有右侧的 <code className="bg-violet-100 px-1 rounded text-[9px]">children</code> 会更新。
            </p>
          </div>

          {/* 文章导航列表 */}
          <nav>
            <p className="text-xs text-gray-400 font-medium mb-2 px-2">全部文章</p>
            <ul className="space-y-1 list-none p-0 m-0">
              <li>
                <Link
                  href="/posts"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors no-underline"
                >
                  <span>📋</span>
                  <span>文章列表</span>
                </Link>
              </li>
              {sidebarPosts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors no-underline"
                  >
                    <span>{post.emoji}</span>
                    <span className="truncate">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 对比说明 */}
          <div className="mt-6 px-3 py-2.5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <p className="text-[11px] text-amber-700 font-bold mb-1">📐 对比 React Router</p>
            <div className="text-[10px] text-amber-600 leading-relaxed space-y-1">
              <p>React Router:</p>
              <code className="block bg-amber-100 px-1.5 py-0.5 rounded text-[9px]">&lt;Outlet /&gt;</code>
              <p className="mt-1">Next.js:</p>
              <code className="block bg-amber-100 px-1.5 py-0.5 rounded text-[9px]">{`{children}`}</code>
              <p className="mt-1">效果完全相同 ✅</p>
            </div>
          </div>
        </aside>

        {/* ====== 右侧内容区 = {children} = <Outlet /> ====== */}
        <main className="flex-1 min-w-0">
          {children}
          {/* ↑ 这里就是子路由渲染的位置！
              /posts     → 渲染 posts/page.tsx
              /posts/1   → 渲染 posts/[id]/page.tsx (id=1)
              /posts/2   → 渲染 posts/[id]/page.tsx (id=2)
          */}
        </main>
      </div>
    </div>
  );
}
