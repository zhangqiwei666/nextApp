import Link from "next/link";

// ============================================================
// 文章列表页 /posts
// 展示所有文章入口，点击可跳转到对应的动态路由页面
// ============================================================

const posts = [
  { id: "1", title: "Next.js 动态路由入门", emoji: "🚀", desc: "了解 [id] 文件夹命名的魔法", color: "from-blue-500 to-indigo-500" },
  { id: "2", title: "SSR 与 CSR 的核心区别", emoji: "⚡", desc: "服务端渲染 vs 客户端渲染深度对比", color: "from-emerald-500 to-teal-500" },
  { id: "3", title: "React Server Components 深度解析", emoji: "🧩", desc: "RSC 的原理与实践", color: "from-purple-500 to-fuchsia-500" },
  { id: "4", title: "Tailwind CSS 实战技巧", emoji: "🎨", desc: "功能类优先的高效开发方式", color: "from-orange-500 to-amber-500" },
  { id: "5", title: "TypeScript 类型体操入门", emoji: "🔮", desc: "掌握高级类型系统的奥秘", color: "from-rose-500 to-pink-500" },
];

export default function PostsListPage() {
  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto relative pb-10 z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-12">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline">
            ← 首页
          </Link>
          <h1 className="text-base font-bold text-gray-900">文章列表</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 动态路由说明 */}
      <div className="mx-4 mt-4 mb-4 px-4 py-3 bg-linear-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
        <p className="text-sm font-bold text-violet-700 mb-1">📁 动态路由演示</p>
        <p className="text-[12px] text-violet-600 leading-relaxed">
          文件位置: <code className="bg-violet-100 px-1.5 py-0.5 rounded text-[11px]">app/posts/[id]/page.tsx</code>
          <br />
          点击下方任意文章，URL 中的 <strong>[id]</strong> 会被替换为对应的数字（1~5），同一个页面模板渲染不同内容。
        </p>
      </div>

      {/* 文章列表 */}
      <div className="px-4 space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block no-underline group"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
              {/* 顶部色条 */}
              <div className={`h-1.5 bg-linear-to-br ${post.color}`}></div>
              <div className="px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{post.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-violet-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-[12px] text-gray-400 mt-1">{post.desc}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[11px] text-gray-300">路由: /posts/</span>
                      <span className="text-[11px] px-1.5 py-0.5 bg-violet-100 text-violet-600 rounded font-mono font-bold">
                        {post.id}
                      </span>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-300 group-hover:text-violet-500 transition-colors mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* 测试不存在的 ID */}
      <div className="mx-4 mt-6">
        <p className="text-xs text-gray-400 mb-2 font-medium">🧪 试试不存在的 ID:</p>
        <div className="flex gap-2">
          <Link
            href="/posts/999"
            className="flex-1 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-center text-xs text-red-500 font-medium no-underline hover:bg-red-100 transition-colors"
          >
            /posts/999 → 404
          </Link>
          <Link
            href="/posts/hello"
            className="flex-1 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-center text-xs text-red-500 font-medium no-underline hover:bg-red-100 transition-colors"
          >
            /posts/hello → 404
          </Link>
        </div>
      </div>
    </div>
  );
}
