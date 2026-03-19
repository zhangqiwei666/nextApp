import { NextResponse } from "next/server";

// ============================================================
// API 路由 — 模拟后端数据接口
// 故意加 1.5 秒延迟，让你能感受到数据获取的等待时间
// ============================================================

export interface HotTopic {
  id: number;
  rank: number;
  title: string;
  description: string;
  image: string;
  heat: number;
  tag?: string;
  isNew?: boolean;
  isHot?: boolean;
}

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

export async function GET() {
  // 🔑 关键：1.5 秒延迟，模拟真实 API 请求
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const serverTime = new Date().toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  console.log(`[API] /api/hot-topics 被调用，返回 ${topics.length} 条数据，时间: ${serverTime}`);

  return NextResponse.json({
    topics,
    serverTime,
    fetchedAt: Date.now(),
  });
}
