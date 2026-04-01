import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import BottomNav from "@/components/BottomNav";
import WaterfallCard from "@/components/WaterfallCard";
import type { CardData } from "@/components/WaterfallCard";
import { hotTopicsApi } from  '@/api/api'
import { Metadata } from 'next';

// 导出元数据对象 📄
export const metadata: Metadata = {
  title: '我的nextApp',
  description: '提供高效、安全的 0-1 客户关系管理系统，助力企业数字化转型。',
  keywords: ['CRM', '客户管理', 'Next.js 16', 'SaaS 方案'],
};

export default async function HomePage() {
  const feedData:CardData[] = []
    try{
      const res = await hotTopicsApi.getHomeList()
      feedData.push(...res.data)
    }catch(error){
      if (error && typeof error === 'object' && 'digest' in error && 
        typeof (error as { digest: string }).digest === 'string' && 
        (error as { digest: string }).digest.includes('NEXT_REDIRECT')) {
        throw error;
      } 
    }
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