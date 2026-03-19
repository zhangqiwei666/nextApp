"use client";

import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import BottomNav from "./components/BottomNav";
import WaterfallCard from "./components/WaterfallCard";
import type { CardData } from "./components/WaterfallCard";

const feedData: CardData[] = [
  {
    id: 1,
    image: "/images/makeup1.png",
    title: "花100个W娶得空姐老婆 画完妆超像范冰冰妆前...",
    author: "马大姐美妆",
    avatar: "/images/makeup1.png",
    likes: 64,
    isVideo: true,
    overlay: "花100个W娶得空姐老婆\n妆前：58岁\n妆后：超像范冰冰",
    aspectRatio: 1.35,
  },
  {
    id: 2,
    image: "/images/contacts.png",
    title: "超美蓝色美瞳分享 让你的眼睛会说话✨",
    author: "一只健身小猫🐱",
    avatar: "/images/contacts.png",
    likes: 328,
    isVideo: true,
    aspectRatio: 1.1,
  },
  {
    id: 3,
    image: "/images/purple_dress.png",
    title: "Share | 💜 GRWM",
    author: "桃子家有只猪妹",
    avatar: "/images/purple_dress.png",
    likes: 861,
    isVideo: true,
    tags: ["穿搭"],
    aspectRatio: 1.5,
  },
  {
    id: 4,
    image: "/images/beauty.png",
    title: "大家好! 我来自印度 🇮🇳",
    author: "Yashaswi~叶...",
    avatar: "/images/beauty.png",
    likes: 985,
    aspectRatio: 1.3,
  },
  {
    id: 5,
    image: "/images/grwm.png",
    title: "每日妆容分享 今天画了一个超温柔的奶茶妆🧋",
    author: "甜甜的化妆台",
    avatar: "/images/grwm.png",
    likes: 1243,
    isVideo: true,
    aspectRatio: 1.25,
  },
  {
    id: 6,
    image: "/images/skincare.png",
    title: "网络美少女の卸妆vlog 真实卸妆全过程",
    author: "小鱼护肤日记",
    avatar: "/images/skincare.png",
    likes: 567,
    isVideo: true,
    overlay: "网络美少女の\n卸妆vlog",
    aspectRatio: 1.4,
  },
  {
    id: 7,
    image: "/images/makeup1.png",
    title: "新手化妆教程 手把手教你打造日常通勤妆💄",
    author: "美妆小课堂",
    avatar: "/images/makeup1.png",
    likes: 2156,
    aspectRatio: 1.15,
  },
  {
    id: 8,
    image: "/images/contacts.png",
    title: "日抛美瞳合集·上班族必备 自然不突兀",
    author: "瞳色研究所",
    avatar: "/images/contacts.png",
    likes: 439,
    tags: ["彩妆", "美瞳"],
    aspectRatio: 1.2,
  },
];

export default function HomePage() {
  // Split cards into left and right columns for waterfall layout
  const leftCards = feedData.filter((_, i) => i % 2 === 0);
  const rightCards = feedData.filter((_, i) => i % 2 === 1);

  return (
    <div className="min-h-screen bg-xhs-gray-light max-w-lg mx-auto relative">
      {/* Header */}
      <Header />

      {/* Category Tabs */}
      <CategoryTabs />

      {/* Waterfall Feed */}
      <main className="px-2 pt-2 pb-20">
        <div className="flex gap-2">
          {/* Left Column */}
          <div className="flex-1 flex flex-col">
            {leftCards.map((card, i) => (
              <WaterfallCard key={card.id} data={card} index={i * 2} />
            ))}
          </div>
          {/* Right Column */}
          <div className="flex-1 flex flex-col">
            {rightCards.map((card, i) => (
              <WaterfallCard key={card.id} data={card} index={i * 2 + 1} />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}