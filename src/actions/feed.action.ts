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
export async function likeTopicAction(topicId: number) {
  try {
    // 这里假装走你的 http 拦截器。即使是调用外部服务器（如 Express）
    // 该请求也是由 Next.js 服务端发出的，绝不会受 CORS 跨域限制
    // const res = await http.post(`/api/topics/${topicId}/like`);
    
    // 模拟耗时网络延迟
    await new Promise((r) => setTimeout(r, 800));
    
    // 🔥 Next.js 特性：动作成功后，自动清空对应页面的缓存并触发更新
    revalidatePath("/discover");
    
    return { success: true, message: "点赞已记录到服务器！" };
  } catch (error) {
    return { success: false, error: "系统开小差了，稍后再试吧" };
  }
}

/**
 * 示例：更彻底的 "安全网关包装器" 思想
 * 如果未来你想在所有的写入动作（写评价、发帖）前做一遍强制验权
 * 可以用这个高阶函数套一层。
 */
export function withAuthAction(actionHandler: Function) {
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
