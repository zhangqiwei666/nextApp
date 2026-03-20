import Link from "next/link";
import { notFound } from "next/navigation";

// ============================================================
// 动态路由页面：/posts/[id]
// [id] 是动态参数，访问 /posts/1、/posts/2 等会匹配到这个页面
// Next.js 会自动将 URL 中的 id 值传递给组件的 params
// ============================================================

// 模拟文章数据库
const postsData: Record<
  string,
  { title: string; content: string; author: string; date: string; tags: string[]; emoji: string }
> = {
  "1": {
    title: "Next.js 动态路由入门",
    content:
      "动态路由是 Next.js 中非常强大的特性。通过在文件夹名称中使用方括号 [param]，你可以创建能匹配任意值的路由。例如 /posts/[id] 可以匹配 /posts/1、/posts/hello 等任何路径。在页面组件中，你可以通过 params 获取到这个动态值，从而根据不同的参数返回不同的内容。这使得你可以用一个页面模板来展示成千上万条不同的内容。",
    author: "张三",
    date: "2026-03-19",
    tags: ["Next.js", "React", "前端"],
    emoji: "🚀",
  },
  "2": {
    title: "SSR 与 CSR 的核心区别",
    content:
      "服务端渲染 (SSR) 在服务器上生成完整的 HTML，用户收到页面时内容已经就绪；客户端渲染 (CSR) 先发送一个空壳页面，然后由浏览器执行 JavaScript 来获取数据并渲染内容。SSR 的优势在于更好的 SEO 和更快的首屏展示，而 CSR 则在交互体验和状态管理上更加灵活。Next.js 的 App Router 默认使用 Server Component（SSR），需要客户端交互时使用 'use client' 指令。",
    author: "李四",
    date: "2026-03-18",
    tags: ["SSR", "CSR", "性能优化"],
    emoji: "⚡",
  },
  "3": {
    title: "React Server Components 深度解析",
    content:
      "React Server Components (RSC) 是 React 18 引入的全新概念。它们只在服务端运行，不会被打包到客户端的 JavaScript bundle 中，这意味着更小的包体积和更快的页面加载速度。Server Components 可以直接访问数据库、文件系统等服务端资源，而不需要创建 API 接口。在 Next.js 的 App Router 中，所有组件默认都是 Server Component，只有显式标记了 'use client' 的才会变成 Client Component。",
    author: "王五",
    date: "2026-03-17",
    tags: ["React", "RSC", "架构"],
    emoji: "🧩",
  },
  "4": {
    title: "Tailwind CSS 实战技巧",
    content:
      "Tailwind CSS 是一个功能类优先的 CSS 框架，它通过在 HTML 中直接使用预定义的工具类来快速构建界面。与传统的 CSS 框架不同，Tailwind 不提供预制的组件样式，而是提供底层的工具类，让你可以自由组合出独特的设计。常用技巧包括：使用 group 和 peer 实现联动效果、利用 @apply 提取重复样式、通过 arbitrary values 突破预设限制等。",
    author: "赵六",
    date: "2026-03-16",
    tags: ["CSS", "Tailwind", "UI设计"],
    emoji: "🎨",
  },
  "5": {
    title: "TypeScript 类型体操入门",
    content:
      "TypeScript 的类型系统是图灵完备的，意味着你可以用它来实现各种复杂的类型运算。常见的类型体操技巧包括：条件类型 (Conditional Types)、映射类型 (Mapped Types)、模板字面量类型 (Template Literal Types)、递归类型等。掌握这些高级类型技巧可以帮助你写出更安全、更精确的类型定义，减少运行时错误。",
    author: "钱七",
    date: "2026-03-15",
    tags: ["TypeScript", "类型系统", "进阶"],
    emoji: "🔮",
  },
};

// 颜色方案映射
const colorSchemes: Record<string, { bg: string; border: string; text: string; tagBg: string; tagText: string }> = {
  "1": { bg: "from-blue-50 to-indigo-50", border: "border-blue-200", text: "text-blue-700", tagBg: "bg-blue-100", tagText: "text-blue-600" },
  "2": { bg: "from-emerald-50 to-teal-50", border: "border-emerald-200", text: "text-emerald-700", tagBg: "bg-emerald-100", tagText: "text-emerald-600" },
  "3": { bg: "from-purple-50 to-fuchsia-50", border: "border-purple-200", text: "text-purple-700", tagBg: "bg-purple-100", tagText: "text-purple-600" },
  "4": { bg: "from-orange-50 to-amber-50", border: "border-orange-200", text: "text-orange-700", tagBg: "bg-orange-100", tagText: "text-orange-600" },
  "5": { bg: "from-rose-50 to-pink-50", border: "border-rose-200", text: "text-rose-700", tagBg: "bg-rose-100", tagText: "text-rose-600" },
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 获取动态路由参数
  const { id } = await params;

  // 查找对应的文章
  const post = postsData[id];

  // 如果文章不存在，返回 404
  if (!post) {
    notFound();
  }

  const colors = colorSchemes[id] || colorSchemes["1"];

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto relative pb-20">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-12">
          <Link
            href="/posts"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors no-underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">返回列表</span>
          </Link>
          <h1 className="text-base font-bold text-gray-900">文章{postsData[id].title}详情</h1>
          <div className="w-16"></div>
        </div>
      </header>

      {/* 动态路由参数展示 */}
      <div className="mx-4 mt-3 mb-4">
        <div className={`px-4 py-3 bg-linear-to-br ${colors.bg} rounded-xl border ${colors.border}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className={`text-xs font-bold ${colors.text}`}>
              📍 动态路由参数: id = &quot;{id}&quot;
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            当前 URL: /posts/<strong>{id}</strong> → 匹配到 /posts/[id]/page.tsx
          </p>
        </div>
      </div>

      {/* 文章内容 */}
      <article className="mx-4">
        {/* Emoji 标识 */}
        <div className="text-5xl mb-4 text-center">{post.emoji}</div>

        {/* 标题 */}
        <h2 className="text-xl font-black text-gray-900 leading-tight text-center mb-3">
          {post.title}
        </h2>

        {/* 元信息 */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="text-xs text-gray-400">✍️ {post.author}</span>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs text-gray-400">📅 {post.date}</span>
        </div>

        {/* 标签 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[11px] px-2.5 py-1 ${colors.tagBg} ${colors.tagText} rounded-full font-medium`}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 正文 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-[15px] text-gray-700 leading-relaxed">
            {post.content}
          </p>
        </div>
      </article>

      {/* 底部：导航到其他文章 */}
      <div className="mx-4 mt-6">
        <h3 className="text-sm font-bold text-gray-500 mb-3">📖 其他文章</h3>
        <div className="space-y-2">
          {Object.entries(postsData)
            .filter(([key]) => key !== id)
            .map(([key, p]) => {
              const c = colorSchemes[key] || colorSchemes["1"];
              return (
                <Link
                  key={key}
                  href={`/posts/${key}`}
                  className={`block px-4 py-3 bg-linear-to-br ${c.bg} rounded-xl border ${c.border} no-underline hover:scale-[1.02] transition-transform duration-200`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.emoji}</span>
                    <span className={`text-sm font-semibold ${c.text}`}>{p.title}</span>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      {/* 返回按钮 */}
      <div className="mx-4 mt-6">
        <Link
          href="/posts"
          className="block px-4 py-3 bg-gray-900 text-white text-center text-sm font-bold rounded-xl no-underline hover:bg-gray-800 transition-colors"
        >
          ← 返回文章列表
        </Link>
      </div>
    </div>
  );
}
