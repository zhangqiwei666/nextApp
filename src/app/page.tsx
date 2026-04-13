import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import BottomNav from "@/components/BottomNav";
import WaterfallCard from "@/components/WaterfallCard";
import WaterfallSkeleton from "@/components/WaterfallSkeleton";
import type { CardData } from "@/components/WaterfallCard";
import { hotTopicsApi } from '@/api/api'
import { Metadata } from 'next';
import { Suspense } from 'react';

// 导出元数据对象 📄
export const metadata: Metadata = {
  title: '我的nextApp',
  description: '提供高效、安全的 0-1 客户关系管理系统，助力企业数字化转型。',
  keywords: ['CRM', '客户管理', 'Next.js 16', 'SaaS 方案'],
};

// 🟢 抽离出的数据获取组件，支持流式渲染
async function FeedList() {
  let feedData: CardData[] = [];
  try {
    const res = await hotTopicsApi.getHomeList();
    feedData = res.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error &&
      typeof (error as { digest: string }).digest === 'string' &&
      (error as { digest: string }).digest.includes('NEXT_REDIRECT')) {
      throw error;
    }
  }

  // 计算瀑布流布局
  const leftCards = feedData.filter((_, i) => i % 2 === 0);
  const rightCards = feedData.filter((_, i) => i % 2 === 1);

  return (
    <div className="flex gap-2">
      {/* Left Column */}
      <div className="flex-1 flex flex-col">
        {leftCards.map((card, i) => (
          <WaterfallCard key={card.id} data={card} index={i * 2} priority={i * 2 < 4} />
        ))}
      </div>
      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        {rightCards.map((card, i) => (
          <WaterfallCard key={card.id} data={card} index={i * 2 + 1} priority={i * 2 + 1 < 4} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-xhs-gray-light max-w-lg mx-auto relative">
      {/* Header - 现在是服务端组件，渲染更省 JS */}
      <Header />

      {/* Category Tabs */}
      <CategoryTabs />

      {/* Waterfall Feed - 使用 Suspense 开启流式加载 */}
      <main className="px-2 pt-2 pb-20">
        <Suspense fallback={<WaterfallSkeleton />}>
          <FeedList />
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}