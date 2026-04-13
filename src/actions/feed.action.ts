"use server";

import { revalidatePath } from "next/cache";
import http from "@/api/request";
import { HotTopicsResponse } from "@/api/api";

/**
 * 示例：使用 Server Action 封装点赞操作
 * 优势：
 * 1. 无需手写 /api/like 接口路由
 * 2. 天然屏蔽了真实后端的域名和 token 参数暴露给浏览器
 * 3. 可以在 Node.js 服务器内调用任何第三方或者底层微服务
 */
import dbConnect from "@/lib/mongoose";
import Feed from "@/models/Feed";

export async function likeTopicAction(topicId: string, isLike: boolean = true) {
  try {
    await dbConnect();
    
    // update logic based on isLike
    const increment = isLike ? 1 : -1;
    
    const feed = await Feed.findByIdAndUpdate(
      topicId,
      { $inc: { likes: increment } },
      { new: true }
    );
    
    if (!feed) {
      return { success: false, error: "Feed not found" };
    }

    // 🔥 Next.js 特性：动作成功后，自动清空对应页面的缓存并触发更新
    // revalidatePath("/");
    
    return { success: true, likes: feed.likes, message: "点赞已记录到服务器！" };
  } catch (error) {
    return { success: false, error: "系统开小差了，稍后再试吧" };
  }
}

/**
 * 示例：更彻底的 "安全网关包装器" 思想
 * 如果未来你想在所有的写入动作（写评价、发帖）前做一遍强制验权
 * 可以用这个高阶函数套一层。
 */
function withAuthAction(actionHandler: Function) {
  return async (prevState: any, formData: FormData) => {
    // 引入 cookies, headers() 去判断当前是否有 Token
    // const { cookies } = await import('next/headers');
    // const token = (await cookies()).get('token')?.value;
    
    const token = "mock-token-check"; // 这里只是示范
    if (!token) {
      return { success: false, error: "未登录，拒接操作" };
    }
    
    // 验权完毕，放行给真正的业务函数执行：
    return actionHandler(prevState, formData);
  };
}
