/**
 * ============================================================================
 * 🚀 Next.js 16 / React 19 Server Actions 实战代码示例
 * ============================================================================
 * 
 * 💡 必读说明：
 * 在真实项目中，为了配合客户端组件（"use client"）的高级 Hook（如 useActionState），
 * Server Action 函数通常必须写在一个独立的、以 "use server" 起头的文件里，然后再被页面 import。
 * 
 * 这里为了方便你在单一文件里直观地学习整个联调闭环结构，我把它们拆分成上下两部分演示了。
 */

// ----------------------------------------------------------------------------
// 📂 文件 1：app/actions.ts (专属的“后端/服务端”逻辑文件)
// ----------------------------------------------------------------------------
/*
"use server"; // 这行非常重要，声明下面所有的函数只在服务器端 Node 坏境运行！

// 这是一个完全跑在服务器里的接口级函数，直接丢弃了手写 API 路由这层“胶水代码”
export async function submitFeedback(prevState: any, formData: FormData) {
  // 1. 获取表单原生字段数据 (不用像以前 Express 那样傻乎乎地去解析 JSON 跟 Body 参数了)
  const username = formData.get("username");
  const message = formData.get("message");

  // 2. 模拟真实后端的网络和查库延迟
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 3. 后端业务逻辑与参数校验
  if (!username || !message) {
    return { success: false, error: "用户名和建议内容不能为空哦！", message: "" };
  }

  // 4. 返回的这个对象，Next.js 引擎会自动在底层走隐藏的 RPC 流安全地运回给纯血前端组件！
  return { 
    success: true, 
    error: null,
    message: `感谢用户 [${username}]！系统已将其建议（${message}）落盘进数据库！` 
  };
}
*/


// ----------------------------------------------------------------------------
// 📂 文件 2：app/page.tsx (这是一个普通的“纯血前端”客户端 React 组件)
// ----------------------------------------------------------------------------
"use client";

import React, { useActionState } from "react"; // Next.js 16/React 19 全新状态钩子
import { useFormStatus } from "react-dom";     // 表单挂起状态感知钩子
// import { submitFeedback } from "./actions"; // 真实开发时将顶部的代码剪切后导入

/** 
 * 🎈 定义页面的初始状态（格式与上文中后端返回的数据结构匹配）
 */
const initialState = {
  success: false,
  error: null,
  message: "",
};


/**
 * 🟡 抽离出一个原生的提交按钮组件（利用 useFormStatus 自动拦截加载状态）
 * （告别历史包袱，再也不用满天飞地定义 const [loading, setLoading] = useState 这种样板代码了！）
 */
function SubmitButton() {
  // pending 为 true 说明整个表单的 request 正处在跨网路发给服务器途中的路上
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: "12px 24px",
        background: pending ? "#9ca3af" : "#3b82f6",
        color: "white",
        border: "none",
        fontWeight: "bold",
        borderRadius: "8px",
        cursor: pending ? "not-allowed" : "pointer",
        transition: "all 0.3s"
      }}
    >
      {pending ? "🕒 正在跨网络联调存入服务器..." : "🔥 点我免 API 路由提交给后端！"}
    </button>
  );
}


/**
 * 🟢 主页面/主表单组件
 */
export default function ServerActionDemo() {
  
  // 这里我们在同文件 mock 了一下。如果在你的项目中应用，请直接把参数 1 换成 import 获取到的 action。
  const mockSubmitFeedback = async (prevState: any, formData: FormData) => {
    // 强制声明为局部 Server Action (仅演示用)
    "use server";
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const username = formData.get("username") as string;
    if (username.length < 3) return { success: false, error: "名字怎么这么短！？" };
    return { success: true, error: null, message: `搞定了！成功录入后台，大名：${username}` };
  };

  /**
   * ❤️ 体验 Next.js 16 最大杀器：useActionState
   * - 参1: mockSubmitFeedback 也就是你后端的 Server Action 函数名（纯名传入即可）
   * - 参2: initialState 也就是页面的初始状态值
   * - 参3（可选）: 拦截路由
   * 
   * 返回值: 
   *    state => 包含服务端每次 return 的鲜活成果
   *    formAction => 直接塞进 DOM 的 <form action={formAction}> 槽里，代替繁琐的 onSubmit
   */
  const [state, formAction] = useActionState(mockSubmitFeedback, initialState as any);

  return (
    <div style={{ maxWidth: 450, margin: "50px auto", padding: "24px", fontFamily: "sans-serif", background: "#f8fafc", borderRadius: 16 }}>
      
      <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#1e293b" }}>
        Next.js 16 Server Actions 实战
      </h2>
      
      {/* 
        这里不再写老掉牙的 onSubmit={(e)=>{ e.preventDefault(); fetch('/api/xxx') ... }} 了！
        全部化繁为简，交给原生属性 formAction 接管。
      */}
      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <input 
          type="text" 
          name="username" 
          placeholder="请输入你的全名（必须大于3个字）" 
          required
          style={{ padding: "14px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none" }}
        />
        
        <textarea 
          name="message" 
          placeholder="给这台 Node.js 服务器留几句话扯个闲篇吧..." 
          required
          rows={5}
          style={{ padding: "14px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", resize: "none" }}
        />

        {/* 使用无状态的按钮，它在内部嗅探表单提交事件改变自己的加载文字 */}
        <SubmitButton />
        
        {/* 动态展示来自后端传回的校验失败错误信息 */}
        {state?.error && (
          <div style={{ background: "#fef2f2", color: "#ef4444", padding: "12px", borderRadius: "8px", fontSize: "14px" }}>
            ❌ {state.error}
          </div>
        )}
        
        {/* 动态展示来自后端的写入成功确认信息 */}
        {state?.success && (
          <div style={{ background: "#f0fdf4", color: "#22c55e", padding: "12px", borderRadius: "8px", fontSize: "14px", fontWeight: "bold" }}>
            ✅ {state.message}
          </div>
        )}

      </form>
    </div>
  );
}
