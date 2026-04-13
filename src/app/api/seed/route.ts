import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import HotTopic from '@/models/HotTopic';
import Feed from '@/models/Feed';

export async function GET() {
  await dbConnect();
  
  try {
    // 1. Seed HotTopics
    const currentTopics = await HotTopic.countDocuments();
    if (currentTopics === 0) {
      await HotTopic.insertMany([
        {
          rank: 1, title: '《繁花》大结局引发全网热议', description: '王家卫导演的首部电视剧《繁花》迎来大结局，宝总和排骨年糕的结局让人唏嘘。', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b', heat: 589.2, isHot: true
        },
        {
          rank: 2, title: '2024 年巴黎奥运会倒计时 200 天', description: '巴黎奥组委公布了一系列庆祝活动，展示场馆建设和赛事筹备最新进展。', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e', heat: 421.5, tag: '体育'
        },
        {
          rank: 3, title: 'GPT-5 传闻发布时间确认', description: '科技界盛传 OpenAI 将在今年夏天发布下一代大语言模型 GPT-5，具备更强的逻辑推理能力。', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995', heat: 388.9, isNew: true, tag: '科技'
        },
        {
          rank: 4, title: '周末旅游新去处：泉州凭什么火出圈？', description: '随着文旅局的持续发力，泉州这座半城烟火半城仙的城市成为年轻人周末打卡首选。', image: 'https://images.unsplash.com/photo-1533050487297-09b45013190a', heat: 256.4
        },
      ]);
    }

    // 2. Seed Feeds
    const currentFeeds = await Feed.countDocuments();
    if (currentFeeds === 0) {
      await Feed.insertMany([
        {
          title: '氛围感拉满！江浙沪绝美小众古镇推荐', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368', author: '旅行收集癖', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', likes: 12500, aspectRatio: 1.33, tags: ['旅行', '周末去哪儿']
        },
        {
          title: '下班后的治愈时刻：极简晚餐食谱公开', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', author: '料理小天才', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', likes: 8900, aspectRatio: 0.8, isVideo: true, overlay: '20分钟快手菜！\n拯救工作日'
        },
      ]);
    }

    return NextResponse.json({
      code: 200,
      message: 'Database seeded successfully with dummy data',
    });
  } catch (error: any) {
    return NextResponse.json(
      { code: 500, message: 'Failed to seed database', error: error.message },
      { status: 500 }
    );
  }
}
