import BottomNav from "../components/BottomNav";
import Link from "next/link";
import { hotTopicsApi, HotTopic } from "../lib/api";

// ============================================================
// 🟢 SSR — Server Component（服务端渲染）
// 没有 "use client" 指令
// 数据在服务端获取，HTML 完整渲染后才发送给浏览器
// 用户看到页面时，内容已经全部就绪（无 Loading 状态）
// ============================================================

export default async function DiscoverPage() {
  // 🔑 关键区别：这里的 fetch 在 NODE.JS 服务端执行！
  // 浏览器完全看不到这个请求（Network 面板不会出现）
  // eslint-disable-next-line react-hooks/purity
  const startTime = Date.now();
  interface Response {
    data: Array<HotTopic>,
    value: string,
    fetchDuration: number
  }
  // ✅ 使用封装后的 API，一行搞定
  const response:Response = {
    data: [],
    value: '',
    fetchDuration: 0
  }
  try{
    const res = await hotTopicsApi.getTopicsSSR();
    const { data, code } = res;
    response.data = data
    if(code === 200) {
      // eslint-disable-next-line react-hooks/purity
      response.fetchDuration = Date.now() - startTime;
      response.value = new Date().toLocaleString("zh-CN", {
            timeZone: "Asia/Shanghai",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
      // 这行 console.log 只会出现在 终端/服务端控制台 中！
      console.log(
        `[SSR Server] 发现页数据已在服务端获取，耗时 ${response.fetchDuration}ms，共 ${data.length} 条热搜`
      );
    }
    
  }catch{
    response.data = [];
    response.value = '';
    response.fetchDuration = 0;
  }
  

  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto relative pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-12">
          <h1 className="text-lg font-bold text-gray-900">发现</h1>
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ===== SSR 信息面板 ===== */}
      <div className="mx-4 mt-3 mb-2">
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-xl border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-emerald-700">
              🟢 SSR — 服务端渲染
            </span>
          </div>
          <div className="space-y-1.5 text-[12px] text-emerald-600">
            <p>📌 数据在 <strong>Node.js 服务端</strong> 获取，耗时 <strong>{response.fetchDuration}ms</strong></p>
            <p>📌 服务端获取时间: <strong>{response.value}</strong></p>
            <p>📌 浏览器收到的是 <strong>完整的 HTML</strong>，无需二次请求</p>
            <p>📌 查看 <strong>网页源代码</strong> 可以看到所有热搜数据</p>
            <p>📌 浏览器 Network 面板 <strong>没有</strong> /api/hot-topics 请求</p>
          </div>
        </div>

        {/* 跳转到 CSR 对比版本 */}
        <Link
          href="/discover-csr"
          className="block mt-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02] no-underline"
        >
          👉 点击查看 CSR 客户端渲染版本 — 感受区别
        </Link>
      </div>

      {/* Tab 栏 */}
      <div className="flex items-center gap-6 px-4 py-2.5 border-b border-gray-50">
        <button className="text-base font-bold text-gray-900 relative pb-1">
          热榜
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-red-500 rounded-full"></span>
        </button>
        <button className="text-base text-gray-400 pb-1 hover:text-gray-600 transition-colors">视频</button>
        <button className="text-base text-gray-400 pb-1 hover:text-gray-600 transition-colors">直播</button>
        <button className="text-base text-gray-400 pb-1 hover:text-gray-600 transition-colors">好物</button>
      </div>

      {/* 热榜列表 —— 数据在服务端已渲染好 HTML，到达浏览器时内容完整 */}
      <div className="divide-y divide-gray-50">
        {response.data?.map((topic) => (
          <article key={topic.id} className="px-4 py-3.5 flex gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer group">
            {/* 排名 */}
            <div className="flex-shrink-0 w-7 pt-0.5">
              <span
                className={`text-lg font-black leading-none ${
                  topic.rank <= 3
                    ? topic.rank === 1
                      ? "text-red-500"
                      : topic.rank === 2
                      ? "text-orange-500"
                      : "text-orange-400"
                    : "text-gray-300"
                }`}
              >
                {String(topic.rank).padStart(2, "0")}
              </span>
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                {topic.title}
              </h3>

              <p className="text-[13px] text-gray-400 mt-1.5 line-clamp-1">
                {topic.description}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-[12px] text-orange-500 font-medium">
                  {topic.heat} 万热度
                </span>

                {topic.isHot && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded font-medium">
                    热
                  </span>
                )}
                {topic.isNew && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded font-medium">
                    新
                  </span>
                )}
                {topic.tag && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                    {topic.tag}
                  </span>
                )}
              </div>
            </div>

            {/* 图片 */}
            <div className="flex-shrink-0 w-[88px] h-[66px] rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={topic.image}
                alt={topic.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </article>
        ))}
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
