import BottomNav from "../components/BottomNav";

// ============================================================
// 这是一个 Server Component（服务端渲染）
// 没有 "use client" 指令，数据在服务端获取后直接渲染 HTML
// ============================================================

interface HotTopic {
  id: number;
  rank: number;
  title: string;
  description: string;
  image: string;
  heat: number; // 万热度
  tag?: string;
  isNew?: boolean;
  isHot?: boolean;
}

// 模拟服务端数据获取（实际项目中可以调用真实 API / 数据库）
async function fetchHotTopics(): Promise<HotTopic[]> {
  // 模拟服务端延迟
  await new Promise((resolve) => setTimeout(resolve, 100));

  const topics: HotTopic[] = [
    {
      id: 1,
      rank: 1,
      title: "男子4S店买车一年蹭饭260次，自家电动车也带来充电，被拉黑后扬言维权，薅羊毛边界...",
      description: "3月17日，浙江。男子比亚迪买车...",
      image: "/images/hot_car.png",
      heat: 1159,
      isHot: true,
    },
    {
      id: 2,
      rank: 2,
      title: "如何评价小米3月19日发布的 Xiaomi MiMo-V2-Pro / Omni/TTS?",
      description: "[图片]",
      image: "/images/hot_tech.png",
      heat: 881,
      isHot: true,
    },
    {
      id: 3,
      rank: 3,
      title: "如何看待央视网发布的动画短片《AI 奇谈 | 止戈为武：流金谷无「鹰」家》？",
      description: "AI 奇谈 | 止戈为武：流金谷无「鹰」...",
      image: "/images/hot_animation.png",
      heat: 255,
      isNew: true,
    },
    {
      id: 4,
      rank: 4,
      title: "3月19日沪指跌1.39%险守4000点，油气、绿电板块逆势走强，如何看待今日行情？",
      description: "3月19日，市场全天震荡调整，三...",
      image: "/images/hot_stock.png",
      heat: 185,
    },
    {
      id: 5,
      rank: 5,
      title: "2025年火电比例还占64.8%，到底是火电太强还是新能源太弱？",
      description: "国家统计局信息公开",
      image: "/images/hot_energy.png",
      heat: 150,
      tag: "能源",
    },
    {
      id: 6,
      rank: 6,
      title: "美以袭击伊朗进入第20天，当前局势如何？还有哪些信息值得关注？",
      description: "伊朗总统证实情报部长遇害 伊朗...",
      image: "/images/hot_car.png",
      heat: 145,
      tag: "国际",
    },
    {
      id: 7,
      rank: 7,
      title: "为什么越来越多年轻人开始拒绝加班文化？",
      description: "近日一份调查报告显示，超过72%的95后...",
      image: "/images/hot_tech.png",
      heat: 132,
      isNew: true,
      tag: "职场",
    },
    {
      id: 8,
      rank: 8,
      title: "3月最值得去的10个旅行目的地，第一个就心动了",
      description: "春暖花开，万物复苏。三月是最适合...",
      image: "/images/hot_animation.png",
      heat: 98,
      tag: "旅行",
    },
    {
      id: 9,
      rank: 9,
      title: "科学家首次在实验室中成功模拟黑洞辐射，霍金预言被证实",
      description: "一个国际科学团队在《自然》杂志上...",
      image: "/images/hot_energy.png",
      heat: 87,
      tag: "科技",
    },
    {
      id: 10,
      rank: 10,
      title: "今年最火的穿搭趋势：静奢风是真的高级还是智商税？",
      description: "从Quiet Luxury到Old Money风...",
      image: "/images/hot_stock.png",
      heat: 76,
      tag: "时尚",
    },
  ];

  return topics;
}

// 服务端渲染时间戳，用于展示 SSR 特性
function getServerTime() {
  return new Date().toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default async function DiscoverPage() {
  // 服务端获取数据 —— 这些代码只会在服务端执行！
  const topics = await fetchHotTopics();
  const serverTime = getServerTime();

  console.log("[Server] 发现页数据已在服务端获取，共", topics.length, "条热搜");

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

      {/* SSR 标识 */}
      <div className="mx-4 mt-3 mb-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[11px] text-blue-600 font-medium">
            服务端渲染 (SSR) · 数据获取于 {serverTime}
          </span>
        </div>
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

      {/* 热榜列表 —— 数据在服务端已渲染好 HTML */}
      <div className="divide-y divide-gray-50">
        {topics.map((topic) => (
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
                {/* 热度 */}
                <span className="text-[12px] text-orange-500 font-medium">
                  {topic.heat} 万热度
                </span>

                {/* 标签 */}
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

      {/* 底部导航 - 客户端组件 */}
      <BottomNav />
    </div>
  );
}
