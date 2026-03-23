"use client";

import { useState, useEffect, useCallback } from "react";
import BottomNav from "../components/BottomNav";
import Link from "next/link";
import { hotTopicsApi, type HotTopic } from "../lib/api";

// ============================================================
// 🔴 CSR — Client Component（客户端渲染）
// 有 "use client" 指令
// 浏览器先收到空白骨架 HTML，然后 JS 执行，发 fetch 请求获取数据
// 用户会先看到 Loading 状态，再看到内容
// ============================================================

export default function DiscoverCSRPage() {
  const [topics, setTopics] = useState<HotTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchTime, setFetchTime] = useState<string>("");
  const [fetchDuration, setFetchDuration] = useState<number>(0);
  const [clientTime, setClientTime] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const start = Date.now();
    // 记录开始请求的时间
    setClientTime(
      new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );

    // 🔑 关键区别：这里的 fetch 在 浏览器 中执行！
    // 你可以在 Network 面板清楚地看到这个请求
    console.log("[CSR Client] 开始在浏览器端请求数据...");
    // ✅ 使用封装后的 API，自动处理 baseURL、错误、超时
    try{
      const {data, code } = await hotTopicsApi.getTopics();
      const duration = Date.now() - start;
      if(code === 200) {
        console.log(
          `[CSR Client] 浏览器端数据获取完成，耗时 ${duration}ms，共 ${data} 条热搜`
        );
        setTopics(data);
        const serverTime = new Date().toLocaleString("zh-CN", {
            timeZone: "Asia/Shanghai",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
        setFetchTime(serverTime);
        setFetchDuration(duration);
        
      }
    }catch{
        setTopics([]);
    }finally{
    setLoading(false);
    }
    
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto relative pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-12">
          <h1 className="text-lg font-bold text-gray-900">发现 (CSR)</h1>
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ===== CSR 信息面板 ===== */}
      <div className="mx-4 mt-3 mb-2">
        <div className="px-4 py-3 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 rounded-xl border border-orange-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
            <span className="text-sm font-bold text-orange-700">
              🔴 CSR — 客户端渲染
            </span>
          </div>
          <div className="space-y-1.5 text-[12px] text-orange-600">
            <p>📌 数据在 <strong>浏览器端</strong> 通过 fetch 获取{fetchDuration > 0 && <>，耗时 <strong>{fetchDuration}ms</strong></>}</p>
            <p>📌 客户端发起请求时间: <strong>{clientTime || "获取中..."}</strong></p>
            <p>📌 浏览器先收到 <strong>空白骨架 HTML</strong>，然后才加载数据</p>
            <p>📌 查看 <strong>网页源代码</strong> 看不到任何热搜数据</p>
            <p>📌 浏览器 Network 面板 <strong>可以看到</strong> /api/hot-topics 请求</p>
          </div>
        </div>

        {/* 跳转到 SSR 版本 */}
        <Link
          href="/discover"
          className="block mt-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02] no-underline"
        >
          👈 点击查看 SSR 服务端渲染版本 — 感受区别
        </Link>

        {/* 刷新按钮 */}
        <button
          onClick={fetchData}
          className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
        >
          🔄 重新加载数据（观察 Loading 效果）
        </button>
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

      {/* 热榜列表 —— CSR: 先显示骨架屏，数据到了再显示内容 */}
      <div className="divide-y divide-gray-50">
        {loading ? (
          // ===== 骨架屏 Loading：CSR 的典型特征 =====
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-4 py-3.5 flex gap-3 animate-pulse">
                <div className="flex-shrink-0 w-7 pt-0.5">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-100 rounded w-16"></div>
                    <div className="h-4 bg-gray-100 rounded w-8"></div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-[88px] h-[66px] bg-gray-200 rounded-lg"></div>
              </div>
            ))}
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 text-sm text-orange-500 font-medium">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                浏览器正在请求数据中... 请观察 Network 面板
              </div>
            </div>
          </>
        ) : (
          // ===== 数据加载完成后显示内容 =====
          topics.map((topic) => (
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
          ))
        )}
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
